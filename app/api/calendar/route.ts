import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

const tasks = google.tasks({ version: 'v1', auth: oauth2Client });
function formatDateForGoogle(date: Date): string {
  // Format date to RFC3339 format with UTC timezone
  return date.toISOString().split('.')[0] + 'Z';
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

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

    // Get task lists
    const taskLists = await tasks.tasklists.list();

    // Get tasks from each list
    const allTasks = [];
    for (const list of taskLists.data.items || []) {
      if (!list.id) continue; // ✅ Skip invalid task lists

      const taskResponse = await tasks.tasks.list({
        tasklist: list.id,
        showCompleted: true,
        showHidden: false
      });

      if (taskResponse.data.items) {
        allTasks.push(...taskResponse.data.items.map(task => ({
          ...task,
          listTitle: list.title
        })));
      }
    }

    return NextResponse.json({ tasks: allTasks });
  } catch (error: any) {
    console.error('Failed to fetch Google tasks:', error);

    // Check for token expiration
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Google Calendar token expired. Please reconnect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch Google tasks' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    const { title, notes, due, listId } = await request.json();

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

    const dueDate = new Date(due);

    if (!isValidDate(dueDate)) {
      return NextResponse.json(
        { error: 'Invalid due date format' },
        { status: 400 }
      );
    }
    const formattedDue = formatDateForGoogle(dueDate);
    // Create task
    const task = await tasks.tasks.insert({
      tasklist: listId,
      requestBody: {
        title,
        notes,
        due: formattedDue,
        status: 'needsAction'
      }
    });

    return NextResponse.json({
      success: true,
      taskId: task.data.id
    });
  } catch (error: any) {
    console.error('Failed to create Google task:', error);

    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Google Calendar token expired. Please reconnect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create Google task' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}