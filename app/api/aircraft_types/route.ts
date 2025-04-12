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

        const aircraftTypes = await db.collection('aircraft_types')
            .find({})
            .sort({ icao_code: 1 })
            .toArray();

        return NextResponse.json(aircraftTypes.map(aircraft => ({
            icao_code: aircraft.icao_code,
            manufacturer: aircraft.manufacturer,
            model: aircraft.model,
            description: aircraft.description,
            speeds: {
                cruise: aircraft.performance_levels.cruise[2]
            },
            typical_altitude: aircraft.max_altitude_ft - 3000,
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

export async function POST(request: NextRequest) {
    let client;

    try {
        const body = await request.json();
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');

        // Validate required fields
        if (!body.icao_code || !body.manufacturer || !body.model || !body.speeds?.cruise || !body.typical_altitude) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check for duplicate ICAO code
        const existing = await db.collection('aircraft_types').findOne({
            icao_code: body.icao_code
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Aircraft type with this ICAO code already exists' },
                { status: 409 }
            );
        }

        const result = await db.collection('aircraft_types').insertOne({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            _id: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Failed to create aircraft type:', error);
        return NextResponse.json(
            { error: 'Failed to create aircraft type' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function PUT(request: NextRequest) {
    let client;

    try {
        const body = await request.json();
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db('flyclim');

        // Validate required fields
        if (!body.icao_code || !body.manufacturer || !body.model || !body.speeds?.cruise || !body.typical_altitude) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await db.collection('aircraft_types').updateOne(
            { icao_code: body.icao_code },
            {
                $set: {
                    ...body,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Aircraft type not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update aircraft type:', error);
        return NextResponse.json(
            { error: 'Failed to update aircraft type' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}