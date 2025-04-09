export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('flyclim');

    const updateResult = await db.collection('posts').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
          publishedAt: body.status === 'published' ? new Date() : null
        }
      }
    );

    // If no document matched, create a new one
    if (updateResult.matchedCount === 0) {
      await db.collection('posts').insertOne({
        ...body,
        _id: new ObjectId(params.id), // ✅ create with given id
        updatedAt: new Date(),
        createdAt: body.status === 'published' ? new Date() : null,
        publishedAt: body.status === 'published' ? new Date() : null
      });

      await db.collection('schedules').deleteOne({ _id: new ObjectId(params.id) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}