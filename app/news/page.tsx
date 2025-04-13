import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { BlogList } from '@/components/BlogList';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and announcements from FlyClim.',
  alternates: {
    canonical: `https://www.flyclim.com/news`,
  },
  openGraph: {
    title: 'FlyClim News - Aviation Weather Updates',
    description: 'Latest news and announcements from FlyClim.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim News - Aviation Weather Updates',
    description: 'Latest news and announcements from FlyClim.',
    images: ['/logo.png'],
  }
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