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
    let client;
    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_ACCESS_TOKEN || !process.env.MONGODB_URI) {
        throw new Error('Missing required environment variables');
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
        // Get base URL from environment or request
        const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get('host')}`;
        const callbackUrl = `${baseUrl}/api/linkedin/callback`;

        // Exchange code for access token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_ACCESS_TOKEN,
                redirect_uri: callbackUrl,
            }),
        });

        if (!tokenResponse.ok) {
            console.error('LinkedIn token exchange error:', await tokenResponse.text());
            return NextResponse.redirect(new URL('/admin/settings?error=token_exchange_failed', request.url));
        }

        const tokenData = await tokenResponse.json();

        // Get member profile to store member ID using v2 API
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'LinkedIn-Version': '202401',
            },
        });

        if (!profileResponse.ok) {
            console.error('Failed to fetch profile:', await profileResponse.text());
            return NextResponse.redirect(new URL('/admin/settings?error=profile_fetch_failed', request.url));
        }

        const profileData = await profileResponse.json();

        // Store the access token and member ID in MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('flyclim');

        await db.collection('settings').updateOne(
            {},
            {
                $set: {
                    linkedinAccessToken: tokenData.access_token,
                    linkedinTokenExpiry: new Date(Date.now() + (tokenData.expires_in * 1000)),
                    linkedinMemberId: profileData.sub, // Using sub from userinfo endpoint
                    linkedinEmail: profileData.email,
                    linkedinName: profileData.name,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        // Clear the state cookie
        cookieStore.delete('linkedin_state');

        return NextResponse.redirect(new URL('/admin/settings?success=true', request.url));
    } catch (error) {
        console.error('LinkedIn callback error:', error);
        return NextResponse.redirect(new URL('/admin/settings?error=server_error', request.url));
    } finally {
        if (client) {
            await client.close();
        }
    }
}