import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { MongoClient } from 'mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';
import { cookies } from 'next/headers';


// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

// Create calendar client
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!process.env.MONGODB_URI) {
        throw new Error('Missing MONGODB_URI');
    }
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client;

    try {
        const { leadId, title, description, startTime, endTime, createMeet = false } = await request.json();

        // Get stored tokens from MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');
        const settings = await db.collection('settings').findOne({});

        if (!settings?.googleAccessToken) {
            return NextResponse.json(
                { error: 'Google Calendar not connected' },
                { status: 401 }
            );
        }

        // Set credentials
        oauth2Client.setCredentials({
            access_token: settings.googleAccessToken,
            refresh_token: settings.googleRefreshToken,
            expiry_date: new Date(settings.googleTokenExpiry).getTime()
        });

        // Create calendar event with optional Google Meet
        const event = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: title,
                description: description,
                start: {
                    dateTime: new Date(startTime).toISOString(),
                    timeZone: 'UTC'
                },
                end: {
                    dateTime: new Date(endTime).toISOString(),
                    timeZone: 'UTC'
                },
                conferenceData: createMeet ? {
                    createRequest: {
                        requestId: Math.random().toString(36).substring(7),
                        conferenceSolutionKey: { type: 'hangoutsMeet' }
                    }
                } : undefined
            },
            conferenceDataVersion: createMeet ? 1 : 0
        });

        // Store event reference in lead's activities
        if (leadId) {
            await db.collection('leads').updateOne(
                { _id: leadId },
                {
                    $push: {
                        activities: {
                            type: 'calendar_event',
                            note: `Calendar event created: ${title}`,
                            eventId: event.data.id,
                            meetLink: event.data.hangoutLink,
                            timestamp: new Date()
                        }
                    }
                } as any
            );
        }

        return NextResponse.json({
            success: true,
            eventId: event.data.id,
            eventLink: event.data.htmlLink,
            meetLink: event.data.hangoutLink
        });
    } catch (error: any) {
        console.error('Failed to create calendar event:', error);

        // Check for token expiration
        if (error.code === 401) {
            return NextResponse.json(
                { error: 'Google Calendar token expired. Please reconnect.' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create calendar event' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const cookieStore = cookies();
  const savedState = cookieStore.get('google_state')?.value;
  let client;

  // Handle errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/admin/settings?error=google_auth_failed', request.url));
  }

  // Validate state to prevent CSRF
  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/admin/settings?error=invalid_state', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin/settings?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('flyclim');
    
    await db.collection('settings').updateOne(
      {},
      {
        $set: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiry: new Date(Date.now() + (tokens.expiry_date || 3600000)),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Clear the state cookie
    cookieStore.delete('google_state');

    return NextResponse.redirect(new URL('/admin/settings?success=true', request.url));
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(new URL('/admin/settings?error=server_error', request.url));
  } finally {
    if (client) {
      await client.close();
    }
  }
}