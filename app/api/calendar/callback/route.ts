import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { MongoClient } from 'mongodb';



export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const cookieStore = cookies();
  const savedState = cookieStore.get('google_state')?.value;
  let client;
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.MONGODB_URI) {
  throw new Error('Missing required environment variables');
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);
  // Handle errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/admin/settings?error=google_auth_failed', request.url));
  }

  // Validate state to prevent CSRF
  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/admin/settings?error=invalid_state', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin/settings?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens in MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');
    
    await db.collection('settings').updateOne(
      {},
      {
        $set: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiry: new Date(tokens.expiry_date!),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Clear the state cookie
    cookieStore.delete('google_state');

    return NextResponse.redirect(new URL('/admin/settings?success=true', request.url));
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(new URL('/admin/settings?error=server_error', request.url));
  } finally {
    if (client) {
      await client.close();
    }
  }
}