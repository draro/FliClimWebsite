'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { SocialShare } from '@/components/SocialShare';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SEO } from '@/components/SEO';
import Image from 'next/image';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  featuredImage?: string;
}

export default function NewsPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);

        // Track view
        if (data._id) {
          await fetch('/api/posts/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: data._id })
          });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <Skeleton className="w-full h-[400px]" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Post not found</h1>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://flyclim.com/news/${slug}`;

  return (
    <main className="min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt}
        ogImage={post.featuredImage || '/logo.png'}
        ogType="article"
      />
      <Navigation />
      <article>
        {post.featuredImage && (
          <div className="relative w-full h-[400px] pt-16">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        )}
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${post.featuredImage ? '-mt-32 relative z-10' : 'pt-24'} pb-16`}>
          <div className={`${post.featuredImage ? 'bg-white p-8 rounded-lg shadow-xl' : ''}`}>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </p>
              <SocialShare
                url={currentUrl}
                title={post.title}
                summary={post.excerpt}
              />
            </div>
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}