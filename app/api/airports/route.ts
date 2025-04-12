import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export async function GET(request: NextRequest) {
    let client;

    try {
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');

        const airports = await db.collection('airports')
            .find({ country: "US", iata: { $ne: "" } })
            .sort({ icao_code: 1 })
            .toArray();

        return NextResponse.json(airports.map(airport => ({
            ...airport
        })));
    } catch (error) {
        console.error('Failed to fetch aircraft types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch aircraft types' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}