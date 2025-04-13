import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { NewsPost } from '@/components/NewsPost';
import { Metadata } from 'next';
import { MongoClient } from 'mongodb';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('flyclim');
    const post = await db.collection('posts').findOne({ slug: params.slug });

    if (!post) {
      return {
        title: 'Article Not Found',
        description: 'The requested news article could not be found.'
      };
    }

    return {
      title: post.title,
      description: post.excerpt,
      alternates: {
        canonical: `https://www.flyclim.com/news/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: post.featuredImage ? [post.featuredImage] : ['/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : ['/logo.png'],
      }
    };
  } catch (error) {
    console.error('Failed to fetch article metadata:', error);
    return {
      title: 'News Article',
      description: 'FlyClim news article'
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <NewsPost slug={params.slug} />
      <Footer />
    </main>
  );
}