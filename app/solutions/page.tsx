import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Solutions } from '@/components/Solutions';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Solutions',
  description: 'Discover FlyClim\'s complete aviation solutions: AI-powered flight optimization to prevent delays and a comprehensive digital eAIP system for aeronautical information management.',
  alternates: {
    canonical: `https://www.flyclim.com/solutions`,
  },
  openGraph: {
    title: 'FlyClim Solutions - Flight Optimization & eAIP System',
    description: 'Discover FlyClim\'s complete aviation solutions: AI-powered flight optimization and digital eAIP system.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Solutions - Flight Optimization & eAIP System',
    description: 'Discover FlyClim\'s complete aviation solutions: AI-powered flight optimization and digital eAIP system.',
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