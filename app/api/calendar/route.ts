import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';



// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

// Create calendar client
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

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

    // Validate dates
    if (!isValidDate(startTime) || !isValidDate(endTime)) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

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
  const session = await getServerSession(authOptions);
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
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

    // Get upcoming events
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json({ events: response.data.items });
  } catch (error: any) {
    console.error('Failed to fetch calendar events:', error);

    // Check for token expiration
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Google Calendar token expired. Please reconnect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}