import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { PilotProgram } from '@/components/PilotProgram';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pilot Program',
  description: 'Join FlyClim\'s pilot program and be among the first to experience our revolutionary weather optimization technology.',
  alternates: {
    canonical: `https://www.flyclim.com/pilot-program`,
  },
  openGraph: {
    title: 'FlyClim Pilot Program - Early Access',
    description: 'Join FlyClim\'s pilot program and be among the first to experience our revolutionary weather optimization technology.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Pilot Program - Early Access',
    description: 'Join FlyClim\'s pilot program and be among the first to experience our revolutionary weather optimization technology.',
    images: ['/logo.png'],
  }
};

export default function PilotProgramPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PilotProgram />
      </div>
      <Footer />
    </main>
  );
}