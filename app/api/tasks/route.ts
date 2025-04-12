// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';



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
    const { leadId, title, description, dueDate, priority, type } = await request.json();

    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    // Create task
    const task = {
      leadId: new ObjectId(leadId),
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      type,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tasks').insertOne(task);

    // Update lead with task reference
    await db.collection('leads').updateOne(
      { _id: new ObjectId(leadId) },
      {
        $push: {
          tasks: result.insertedId,
          activities: {
            type: 'task_created',
            note: `Task created: ${title}`,
            timestamp: new Date()
          }
        }
      } as any
    );

    // Create calendar event if requested
    if (type === 'meeting' || type === 'call') {
      const calendarResponse = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startTime: dueDate,
          endTime: new Date(new Date(dueDate).getTime() + 30 * 60000), // 30 min duration
        }),
      });

      if (!calendarResponse.ok) {
        console.error('Failed to create calendar event');
      }
    }

    return NextResponse.json({
      success: true,
      taskId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
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
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');

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
        leadId: task.leadId.toString()
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
