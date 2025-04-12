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
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: 'MongoDB URI not set' },
      { status: 500 }
    );
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

    // Get task lists
    const taskLists = await tasks.tasklists.list();

    // Get tasks from each list
    const allTasks = [];
    for (const list of taskLists.data.items || []) {
      if (!list.id) continue;
      const taskResponse = await tasks.tasks.list({
        tasklist: list.id,
        showCompleted: true,
        showHidden: false,
        maxResults: 100
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
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: 'MongoDB URI not set' },
      { status: 500 }
    );
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    const { title, notes, due, listId } = await request.json();

    // Validate due date
    if (!due) {
      return NextResponse.json(
        { error: 'Due date is required' },
        { status: 400 }
      );
    }

    // Parse and validate the due date
    const dueDate = new Date(due);
    if (!isValidDate(dueDate)) {
      return NextResponse.json(
        { error: 'Invalid due date format' },
        { status: 400 }
      );
    }

    // Format date to RFC3339 format
    const formattedDue = formatDateForGoogle(dueDate);

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

    // Get default task list if no listId provided
    let taskListId = listId;
    if (!taskListId) {
      const taskLists = await tasks.tasklists.list();
      taskListId = taskLists.data.items?.[0].id;

      if (!taskListId) {
        return NextResponse.json(
          { error: 'No task list found' },
          { status: 400 }
        );
      }
    }

    // Create task
    const task = await tasks.tasks.insert({
      tasklist: taskListId,
      requestBody: {
        title,
        notes,
        due: formattedDue,
        status: 'needsAction'
      }
    });

    // Store task reference in MongoDB
    await db.collection('google_tasks').insertOne({
      taskId: task.data.id,
      title,
      notes,
      due: dueDate,
      listId: taskListId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      taskId: task.data.id,
      task: task.data
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