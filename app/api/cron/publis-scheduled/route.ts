import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';



export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    let client;
    if (!process.env.MONGODB_URI) {
        throw new Error('Missing MONGODB_URI');
    }
    try {
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');

        // Find all scheduled posts that are due for publishing
        const scheduledPosts = await db.collection('schedules').find({
            status: 'scheduled',
            scheduledFor: { $lte: new Date() }
        }).toArray();

        const results = await Promise.all(scheduledPosts.map(async (post) => {
            try {
                // Move post to posts collection
                await db.collection('posts').insertOne({
                    ...post,
                    status: 'published',
                    publishedAt: new Date()
                });

                // Update schedule status
                await db.collection('schedules').updateOne(
                    { _id: post._id },
                    { $set: { status: 'published', publishedAt: new Date() } }
                );

                // Share to LinkedIn if requested
                if (post.shareToLinkedIn) {
                    try {
                        await fetch(`${process.env.NEXTAUTH_URL}/api/linkedin/post`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: post.title,
                                content: post.content,
                                url: `${process.env.NEXTAUTH_URL}/${post.type}/${post.slug}`
                            })
                        });
                    } catch (shareError) {
                        console.error('Failed to share to LinkedIn:', shareError);
                    }
                }

                return { id: post._id, status: 'success' };
            } catch (error) {
                console.error('Failed to publish post:', error);
                return { id: post._id, status: 'error', error };
            }
        }));

        return NextResponse.json({
            published: results.filter(r => r.status === 'success').length,
            failed: results.filter(r => r.status === 'error').length,
            results
        });
    } catch (error) {
        console.error('Failed to process scheduled posts:', error);
        return NextResponse.json(
            { error: 'Failed to process scheduled posts' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}