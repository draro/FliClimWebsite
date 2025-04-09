import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export async function POST(request: NextRequest) {
  let client;

  try {
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flyclim');
    
    // Update view count
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { 
        $inc: { views: 1 },
        $set: { lastViewed: new Date() }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET(request: NextRequest) {
  let client;

  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flyclim');
    
    const post = await db.collection('posts').findOne(
      { _id: new ObjectId(postId) },
      { projection: { views: 1 } }
    );

    return NextResponse.json({ views: post?.views || 0 });
  } catch (error) {
    console.error('Failed to get view count:', error);
    return NextResponse.json(
      { error: 'Failed to get view count' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}