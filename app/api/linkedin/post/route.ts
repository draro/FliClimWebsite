import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { cleanMarkdownForLinkedIn } from '@/utils/utils';
import axios from 'axios'


const getLinkedInAccessToken = async () => {
  const url = 'https://www.linkedin.com/oauth/v2/accessToken';
  const payload = new URLSearchParams({
    grant_type: 'authorization_code',
    code: 'AUTHORIZATION_CODE_FROM_CALLBACK',
    redirect_uri: 'https://flyclim.com/api/linkedin/callback',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    client_secret: process.env.LINKEDIN_ACCESS_TOKEN || '',
  });

  try {
    const response = await axios.post(url, payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('✅ Access Token:', response.data.access_token);
    console.log('🕒 Expires In:', response.data.expires_in);

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get LinkedIn token:', error.response?.data || error.message);
  }
};
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = await getLinkedInAccessToken();
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!accessToken || !orgId) {
    console.error('Missing LinkedIn credentials');
    return NextResponse.json(
      { error: 'LinkedIn access token or organization ID missing' },
      { status: 500 }
    );
  }

  try {
    const { title, content, url }: { title: string; content: string; url: string } =
      await request.json();

    const cleanContent = cleanMarkdownForLinkedIn(content);
    const formattedMessage = `${title}\n\n${cleanContent}\n\nRead more: ${url}`;

    const linkedInPayload = {
      author: `urn:li:organization:${orgId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: formattedMessage,
          },
          shareMediaCategory: 'NONE', // Or "ARTICLE" if you add media
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const linkedInResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(linkedInPayload),
    });

    if (!linkedInResponse.ok) {
      const error = await linkedInResponse.json();
      console.error('LinkedIn API Error:', error);
      return NextResponse.json({ error: 'Failed to post to LinkedIn', detail: error }, { status: linkedInResponse.status });
    }

    const data = await linkedInResponse.json();
    return NextResponse.json({ success: true, postId: data.id });
  } catch (error) {
    console.error('Unexpected error while posting to LinkedIn:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}