import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!process.env.MONGODB_URI) {
        return NextResponse.json({ error: 'MongoDB URI not set' }, { status: 500 });
    }
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client;

    try {
        // Get stored tokens from MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI!);
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

        // Get events from primary calendar
        const now = new Date();
        const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toISOString(),
            timeMax: threeMonthsFromNow.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        return NextResponse.json({ events: response.data.items });
    } catch (error: any) {
        console.error('Failed to fetch calendar events:', error);

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