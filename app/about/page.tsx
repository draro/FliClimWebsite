import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about FlyClim\'s mission to revolutionize aviation with AI-powered flight optimization and comprehensive digital eAIP solutions.',
  alternates: {
    canonical: `https://www.flyclim.com/about`,
  },
  openGraph: {
    title: 'About FlyClim - Flight Optimization & eAIP Solutions',
    description: 'Learn about FlyClim\'s mission to revolutionize aviation with AI-powered flight optimization and digital eAIP solutions.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FlyClim - Flight Optimization & eAIP Solutions',
    description: 'Learn about FlyClim\'s mission to revolutionize aviation with AI-powered flight optimization and digital eAIP solutions.',
    images: ['/logo.png'],
  }
};


export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <About />
      </div>
      <Footer />
    </main>
  );
}