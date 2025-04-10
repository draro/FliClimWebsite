import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';



export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_ACCESS_TOKEN) {
        throw new Error('Missing LinkedIn credentials');
    }
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate random state
    const state = crypto.randomBytes(16).toString('hex');

    // Store state in cookie for validation
    cookies().set('linkedin_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
    });

    // Get base URL from environment or request
    const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get('host')}`;
    const callbackUrl = `${baseUrl}/api/linkedin/callback`;

    // Construct LinkedIn OAuth URL with required scopes
    const linkedinAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    linkedinAuthUrl.searchParams.append('response_type', 'code');
    linkedinAuthUrl.searchParams.append('client_id', process.env.LINKEDIN_CLIENT_ID);
    linkedinAuthUrl.searchParams.append('redirect_uri', callbackUrl);
    linkedinAuthUrl.searchParams.append('state', state);
    linkedinAuthUrl.searchParams.append('scope', 'openid profile email w_member_social');

    return NextResponse.redirect(linkedinAuthUrl);
}