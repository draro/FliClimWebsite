import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Solutions } from '@/components/Solutions';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Solutions',
  description: 'Discover how FlyClim\'s AI-powered solutions help prevent flight delays and optimize routes.',
  openGraph: {
    title: 'FlyClim Solutions - AI-Powered Flight Optimization',
    description: 'Discover how FlyClim\'s AI-powered solutions help prevent flight delays and optimize routes.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Solutions - AI-Powered Flight Optimization',
    description: 'Discover how FlyClim\'s AI-powered solutions help prevent flight delays and optimize routes.',
    images: ['/logo.png'],
  }
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Solutions />
      </div>
      <Footer />
    </main>
  );
}