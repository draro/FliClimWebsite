import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import OpenAI from 'openai';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Invalid/Missing environment variable: "OPENAI_API_KEY"');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client;

    try {
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');
        const schedules = await db.collection('schedules')
            .find({})
            .sort({ scheduledFor: 1 })
            .toArray();

        return NextResponse.json(schedules.map(schedule => ({
            ...schedule,
            _id: schedule._id.toString()
        })));
    } catch (error) {
        console.error('Failed to fetch schedules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch schedules' },
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

        // Generate content with ChatGPT if requested
        let content = '';
        let title = body.title;

        if (body.generateContent) {
            const prompt = `Write a ${body.type} post about ${body.topic} for an aviation weather optimization company. 
                     The post should be informative and professional. 
                     Include a title and content. Format in markdown.`;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4",
            });

            const generatedContent = completion.choices[0].message.content;

            // Extract title and content from generated markdown
            const lines = (generatedContent ?? '').split('\n');
            if (lines[0].startsWith('# ')) {
                title = lines[0].substring(2);
                content = lines.slice(1).join('\n').trim();
            } else {
                content = generatedContent ?? '';
            }
        } else {
            content = body.content || '';
        }

        // Create slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const postData = {
            title,
            content,
            type: body.type,
            slug,
            status: body.publishNow ? 'published' : 'scheduled',
            scheduledFor: new Date(body.scheduledFor),
            shareToLinkedIn: body.shareToLinkedIn,
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: body.publishNow ? new Date() : null
        };

        // Save to schedules collection
        const result = await db.collection('schedules').insertOne(postData);

        // If immediate publication is requested
        if (body.publishNow) {
            await db.collection('posts').insertOne(postData);

            // Share to LinkedIn if requested
            if (body.shareToLinkedIn) {
                await fetch(`${request.nextUrl.origin}/api/linkedin/post`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: postData.title,
                        content: postData.content.substring(0, 200),
                        url: `https://flyclim.com/${postData.type}/${postData.slug}`
                    })
                });
            }
        }

        return NextResponse.json({
            success: true,
            _id: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Failed to create schedule:', error);
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}