import { Metadata } from 'next';
import { MongoClient } from 'mongodb';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BlogPost } from '@/components/BlogPost';
export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  featuredImage?: string;
  slug: string;
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('flyclim');
  const post = await db.collection('posts').findOne({ slug: params.slug });
  await client.close();

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
      robots: { index: false, follow: false }
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.flyclim.com/blog/${post.slug}`,
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
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db('flyclim');
  const post = await db.collection('posts').findOne({ slug: params.slug }) as Post | null;
  await client.close();

  if (!post) {
    return <h1 className="text-center pt-24 text-2xl">404: Blog Post Not Found</h1>;
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <BlogPost post={post} />
      <Footer />
    </main>
  );
}