import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';



export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    // Only return necessary settings
    const settings = await db.collection('settings').findOne(
      {},
      {
        projection: {
          linkedinAccessToken: 1,
          linkedinTokenExpiry: 1,
          linkedinOrganizationId: 1,
          googleAccessToken: 1,
          googleTokenExpiry: 1
        }
      }
    );

    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;

  try {
    const body = await request.json();

    // Validate organization ID if provided
    if (body.linkedinOrganizationId && !/^\d+$/.test(body.linkedinOrganizationId)) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn Organization ID format' },
        { status: 400 }
      );
    }

    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');

    // Only update allowed fields
    const allowedFields = [
      'linkedinOrganizationId',
      'linkedinAccessToken',
      'linkedinTokenExpiry',
      'googleAccessToken',
      'googleTokenExpiry',
      'googleRefreshToken'
    ];

    const updateData = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => ({
        ...obj,
        [key]: body[key]
      }), {});

    await db.collection('settings').updateOne(
      {},
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}