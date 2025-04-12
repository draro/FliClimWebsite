import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';



export async function GET(request: NextRequest) {
    let client;
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
    try {
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');

        const flights = await db.collection('flight_plans')
            .find({})
            .sort({ dep_time: -1 })
            .toArray();

        return NextResponse.json({
            flights: flights.map(flight => ({
                ...flight,
                _id: flight._id.toString()
            }))
        });
    } catch (error) {
        console.error('Failed to fetch flights:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flights' },
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
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
    try {
        const { fpl } = await request.json();

        // Generate FPL via external API
        const response = await fetch('https://demo.flyclim.com/api/generate-fpl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fpl })
        });

        if (!response.ok) {
            throw new Error('Failed to generate flight plan');
        }

        const data = await response.json();

        // Store in MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');

        const result = await db.collection('flight_plan').insertOne({
            ...data,
            createdAt: new Date()
        });

        return NextResponse.json({
            success: true,
            _id: result.insertedId.toString(),
            ...data
        });
    } catch (error) {
        console.error('Failed to create flight:', error);
        return NextResponse.json(
            { error: 'Failed to create flight' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}