import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient } from 'mongodb';


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const cookieStore = cookies();
    const savedState = cookieStore.get('linkedin_state')?.value;
    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
        throw new Error('Missing LinkedIn credentials');
    }

    // Handle errors from LinkedIn
    if (error) {
        console.error('LinkedIn OAuth error:', error);
        return NextResponse.redirect(new URL('/admin/settings?error=linkedin_auth_failed', request.url));
    }

    // Validate state to prevent CSRF
    if (!state || state !== savedState) {
        return NextResponse.redirect(new URL('/admin/settings?error=invalid_state', request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/admin/settings?error=no_code', request.url));
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXTAUTH_URL}/api/linkedin/callback`,
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('LinkedIn token exchange error:', error);
            return NextResponse.redirect(new URL('/admin/settings?error=token_exchange_failed', request.url));
        }

        const tokenData = await tokenResponse.json();

        // Store the access token in MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI!);
        const db = client.db('flyclim');

        await db.collection('settings').updateOne(
            {},
            {
                $set: {
                    linkedinAccessToken: tokenData.access_token,
                    linkedinTokenExpiry: new Date(Date.now() + (tokenData.expires_in * 1000)),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        await client.close();

        // Clear the state cookie
        cookieStore.delete('linkedin_state');

        return NextResponse.redirect(new URL('/admin/settings?success=true', request.url));
    } catch (error) {
        console.error('LinkedIn callback error:', error);
        return NextResponse.redirect(new URL('/admin/settings?error=server_error', request.url));
    }
}