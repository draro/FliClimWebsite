import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flyclim');
    
    // Delete the lead
    const result = await db.collection('leads').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Delete associated tasks
    await db.collection('tasks').deleteMany({
      leadId: new ObjectId(params.id)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}