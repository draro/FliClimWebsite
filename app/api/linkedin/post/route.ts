// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { cleanMarkdownForLinkedIn } from '@/utils/utils';

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
//   const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

//   if (!accessToken || !orgId) {
//     console.error('Missing LinkedIn access token or org ID');
//     return NextResponse.json({ error: 'LinkedIn config missing' }, { status: 500 });
//   }

//   try {
//     const { title, content, url } = await request.json();

//     const cleanContent = cleanMarkdownForLinkedIn(content);
//     const fullMessage = `${title}\n\n${cleanContent}\n\nRead more: ${url}`;

//     const linkedInResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//         'X-Restli-Protocol-Version': '2.0.0',
//       },
//       body: JSON.stringify({
//         author: `urn:li:organization:${orgId}`,
//         lifecycleState: 'PUBLISHED',
//         specificContent: {
//           'com.linkedin.ugc.ShareContent': {
//             shareCommentary: {
//               text: fullMessage,
//             },
//             shareMediaCategory: 'NONE',
//           },
//         },
//         visibility: {
//           'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
//         },
//       }),
//     });

//     if (!linkedInResponse.ok) {
//       const err = await linkedInResponse.text();
//       console.error('LinkedIn API Error:', err);
//       return NextResponse.json({ error: 'Failed to post on LinkedIn' }, { status: 500 });
//     }

//     const data = await linkedInResponse.json();
//     return NextResponse.json({ success: true, postId: data.id });
//   } catch (error) {
//     console.error('Post error:', error);
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { cleanMarkdownForLinkedIn } from '@/utils/utils';

export async function POST(request: NextRequest) {
  // Authenticate user session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check LinkedIn env vars
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!accessToken || !orgId) {
    console.error('Missing LinkedIn access token or organization ID');
    return NextResponse.json(
      { error: 'LinkedIn access token or org ID missing' },
      { status: 500 }
    );
  }

  try {
    const { title, content, url }: { title: string; content: string; url: string } =
      await request.json();

    // Clean up markdown
    const cleanContent = cleanMarkdownForLinkedIn(content);
    const fullMessage = `${title}\n\n${cleanContent}\n\nRead more: ${url}`;

    // Send request to LinkedIn
    const linkedInResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:organization:${orgId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: fullMessage,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    // Handle failure
    if (!linkedInResponse.ok) {
      const errorResponse = await linkedInResponse.json();
      console.error('LinkedIn API Error:', errorResponse);
      return NextResponse.json(
        { error: 'Failed to post to LinkedIn', detail: errorResponse },
        { status: linkedInResponse.status }
      );
    }

    // Success
    const data = await linkedInResponse.json();
    return NextResponse.json({ success: true, postId: data.id });
  } catch (error) {
    console.error('LinkedIn POST error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}