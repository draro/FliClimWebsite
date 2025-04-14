import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';
import { cleanMarkdownForLinkedIn } from '@/utils/utils';



export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let client;
  const { title, content, url } = await request.json();

  try {

    // Get LinkedIn tokens from MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flyclim');
    const settings = await db.collection('settings').findOne({});

    if (!settings?.linkedinAccessToken || !settings?.linkedinMemberId) {
      return NextResponse.json(
        { error: 'LinkedIn not connected or organization ID not set' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (settings.linkedinTokenExpiry && new Date(settings.linkedinTokenExpiry) < new Date()) {
      return NextResponse.json(
        { error: 'token_expired' },
        { status: 401 }
      );
    }

    // Clean markdown content for LinkedIn
    const cleanContent = cleanMarkdownForLinkedIn(content);

    // Create share using LinkedIn Share API
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.linkedinAccessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202401'
      },
      body: JSON.stringify({
        author: `urn:li:person:${settings.linkedinMemberId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: `${title}\n\n${cleanContent}\n\n@FlyClim\n\nRead more: ${url}`
            },
            shareMediaCategory: 'ARTICLE',
            media: [{
              status: 'READY',
              originalUrl: url,
              title: {
                text: title
              },
              description: {
                text: cleanContent.substring(0, 200) + '...'
              }
            }]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LinkedIn API error:', error);

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'token_expired' },
          { status: 401 }
        );
      }

      throw new Error('Failed to post to LinkedIn');
    }

    const data = await response.json();

    // Store the share in MongoDB for tracking
    await db.collection('linkedin_shares').insertOne({
      shareId: data.id,
      title,
      url,
      sharedAt: new Date(),
      status: 'success',
      organizationId: settings.linkedinMemberId
    });

    return NextResponse.json({
      success: true,
      shareId: data.id
    });
  } catch (error) {
    console.error('Failed to post to LinkedIn:', error);

    if (client) {
      try {
        // Log failed share attempt
        await client.db('flyclim').collection('linkedin_shares').insertOne({
          title,
          url,
          sharedAt: new Date(),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.error('Failed to log share error:', logError);
      }
    }

    return NextResponse.json(
      { error: 'Failed to post to LinkedIn' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}