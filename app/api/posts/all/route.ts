export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('flyclim');

        const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();

        if (!posts || posts.length === 0) {
            return NextResponse.json({ error: 'No posts found' }, { status: 404 });
        }

        return NextResponse.json({
            posts: posts.map(post => ({
                ...post,
                _id: post._id.toString() // ✅ make ObjectId serializable
            }))
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}