import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    let client;
    try {
        client = await MongoClient.connect(process.env.MONGODB_URI!);
        const db = client.db('flyclim');
        const user = await db.collection('users').findOne({ email });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role ?? 'user',
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}