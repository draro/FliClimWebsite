import { format } from 'date-fns';
import { SocialShare } from '@/components/SocialShare';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import Image from 'next/image';
import { BlogPostJsonLd } from './JsonLd';

interface Post {
    slug: string;
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    publishedAt: string;
    featuredImage?: string;
}

export function BlogPost({ post }: { post: Post }) {
    const currentUrl = `https://flyclim.com/blog/${post.slug}`;

    return (
        <article>
            <BlogPostJsonLd
                title={post.title}
                description={post.excerpt}
                publishedAt={post.publishedAt}
                updatedAt={post.publishedAt}
                images={post.featuredImage ? [post.featuredImage] : []}
                url={currentUrl}
            />
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
                        <p className="text-gray-600">{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</p>
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
    );
}