import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MongoClient, ObjectId } from 'mongodb';
import { authOptions } from '../auth/[...nextauth]/route';



export type TaskStatus =
  | 'in_progress'
  | 'scheduled'
  | 'meeting_done'
  | 'not_answered'
  | 'done'
  | 'to_follow_up';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const leadId = searchParams.get('leadId');
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    const query = leadId ? { leadId: new ObjectId(leadId) } : {};
    const tasks = await db.collection('tasks')
      .find(query)
      .sort({ dueDate: 1 })
      .toArray();

    return NextResponse.json({
      tasks: tasks.map(task => ({
        ...task,
        _id: task._id.toString(),
        leadId: task.leadId?.toString()
      }))
    });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
    throw new Error('Missing MONGODB_URI');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    const { leadId, title, description, dueDate, priority } = await request.json();

    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    // Create task
    const task = await db.collection('tasks').insertOne({
      leadId: leadId ? new ObjectId(leadId) : null,
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      status: 'in_progress' as TaskStatus,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add task reference to lead's activities if leadId exists
    if (leadId) {
      await db.collection('leads').updateOne(
        { _id: new ObjectId(leadId) },
        {
          $push: {
            activities: {
              type: 'task_created',
              note: `Task created: ${title}`,
              taskId: task.insertedId,
              timestamp: new Date()
            }
          }
        } as any
      );
    }

    return NextResponse.json({
      success: true,
      taskId: task.insertedId.toString()
    });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    const { taskId, ...updates } = await request.json();

    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}