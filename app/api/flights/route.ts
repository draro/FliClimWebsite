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
            .sort({ createdAt: -1 })
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
        const { fpl, routeData } = await request.json();

        // Extract flight data from FPL string
        const adepMatch = fpl.match(/-([A-Z]{4})\d{4}/);
        const adesMatch = fpl.match(/-([A-Z]{4})\d{4}$/);
        const aircraftMatch = fpl.match(/-([A-Z0-9]{4})\//);
        const timeMatch = fpl.match(/-[A-Z]{4}(\d{4})/);
        const dateMatch = fpl.match(/DOF\/(\d{6})/);

        if (!adepMatch || !adesMatch || !aircraftMatch || !timeMatch) {
            return NextResponse.json(
                { error: 'Invalid FPL format' },
                { status: 400 }
            );
        }

        const adep = adepMatch[1];
        const ades = adesMatch[1];
        const aircraft = aircraftMatch[1];
        const time = timeMatch[1];

        // Parse date
        let flightDate = new Date();
        if (dateMatch) {
            const [, yymmdd] = dateMatch;
            const year = 2000 + parseInt(yymmdd.substring(0, 2));
            const month = parseInt(yymmdd.substring(2, 4)) - 1;
            const day = parseInt(yymmdd.substring(4, 6));
            flightDate = new Date(Date.UTC(year, month, day));
        }

        // Set departure time
        const hours = parseInt(time.substring(0, 2));
        const minutes = parseInt(time.substring(2, 4));
        flightDate.setUTCHours(hours, minutes, 0, 0);

        // Calculate arrival time based on EET
        const arrivalTime = new Date(flightDate);
        if (routeData?.properties?.eet_minutes) {
            arrivalTime.setMinutes(arrivalTime.getMinutes() + routeData.properties.eet_minutes);
        }

        // Store in MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');

        const result = await db.collection('flight_plans').insertOne({
            fpl,
            adep,
            ades,
            aircraft_type: aircraft,
            dep_time: flightDate,
            arr_time: arrivalTime,
            route: routeData?.features?.[0]?.geometry?.coordinates || [],
            eet_minutes: routeData?.properties?.eet_minutes || 0,
            fuel_burn: routeData?.properties?.fuel_burn || 0,
            risk_level: routeData?.properties?.risk_level || 'low',
            risk_factors: routeData?.properties?.risk_factors || [],
            status: 'scheduled',
            createdAt: new Date()
        });

        return NextResponse.json({
            success: true,
            _id: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Failed to store flight:', error);
        return NextResponse.json(
            { error: 'Failed to store flight' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}