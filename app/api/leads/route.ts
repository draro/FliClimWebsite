import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    let client;

    try {
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');
        const collection = db.collection('leads');

        const [leads, total] = await Promise.all([
            collection
                .find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments({})
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            leads: leads.map(lead => ({
                ...lead,
                _id: lead._id.toString()
            })),
            pages: totalPages
        });
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function POST(request: NextRequest) {
    let client;

    try {
        const body = await request.json();
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');

        const result = await db.collection('leads').insertOne({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            _id: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Failed to create lead:', error);
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}