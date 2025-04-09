import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { BlogList } from '@/components/BlogList';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and announcements from FlyClim.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <BlogList type="news" />
      </div>
      <Footer />
    </main>
  );
}