import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { BlogList } from '@/components/BlogList';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest insights and updates from FlyClim on aviation weather optimization and flight planning.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <BlogList type="blog" />
      </div>
      <Footer />
    </main>
  );
}