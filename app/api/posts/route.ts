import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'blog';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 9;
  const skip = (page - 1) * limit;

  // Check if request is from admin dashboard
  const isAdmin = searchParams.get('admin') === 'true';
  const session = await getServerSession(authOptions);

  // For admin routes, verify authentication
  if (isAdmin && !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flyclim');

    let posts = [];
    let total = 0;

    if (isAdmin && session) {
      // For admin, get all posts regardless of status
      const [allPosts, scheduledPosts] = await Promise.all([
        db.collection('posts')
          .find({})
          .sort({ createdAt: -1 })
          .toArray(),
        db.collection('schedules')
          .find({
          })
          .sort({ scheduledFor: 1 })
          .toArray()
      ]);

      // Combine and sort all posts
      posts = [
        ...allPosts,
        ...scheduledPosts.map(post => ({
          ...post,
          status: 'scheduled',
          publishedAt: post.scheduledFor
        }))
      ].sort((a, b) => {
        const dateA = new Date(a.publishedAt || (a as any).scheduledFor || (a as any).createdAt);
        const dateB = new Date(b.publishedAt || (b as any).scheduledFor || (b as any).createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      total = posts.length;
      posts = posts.slice(skip, skip + limit);
    } else {
      // For public requests, only get published posts
      [posts, total] = await Promise.all([
        db.collection('posts')
          .find({ type, status: 'published' })
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        db.collection('posts').countDocuments({ type, status: 'published' })
      ]);
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        _id: post._id.toString()
      })),
      pages: totalPages,
      total
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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
    const body = await request.json();
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flyclim');

    const result = await db.collection('posts').insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.status === 'published' ? new Date() : null
    });

    return NextResponse.json({
      success: true,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}