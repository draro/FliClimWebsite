import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';

if (!process.env.LINKEDIN_CLIENT_ID) {
    throw new Error('Missing LINKEDIN_CLIENT_ID');
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate random state
    const state = crypto.randomBytes(16).toString('hex');

    // Store state in cookie for validation
    cookies().set('linkedin_state', state, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
    });

    // Construct LinkedIn OAuth URL
    const linkedinAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    linkedinAuthUrl.searchParams.append('response_type', 'code');
    linkedinAuthUrl.searchParams.append('client_id', process.env.LINKEDIN_CLIENT_ID || "");
    linkedinAuthUrl.searchParams.append('redirect_uri', `${process.env.NEXTAUTH_URL}/api/linkedin/callback`);
    linkedinAuthUrl.searchParams.append('state', state);
    linkedinAuthUrl.searchParams.append('scope', 'w_member_social email profile openid');

    return NextResponse.redirect(linkedinAuthUrl);
}