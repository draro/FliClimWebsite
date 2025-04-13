import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the experienced aviation and technology professionals behind FlyClim.',
  alternates: {
    canonical: `https://www.flyclim.com/team`,
  },
  openGraph: {
    title: 'FlyClim Team - Aviation Experts',
    description: 'Meet the experienced aviation and technology professionals behind FlyClim.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Team - Aviation Experts',
    description: 'Meet the experienced aviation and technology professionals behind FlyClim.',
    images: ['/logo.png'],
  }
};

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Team />
      </div>
      <Footer />
    </main>
  );
}