import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about FlyClim\'s mission to revolutionize aviation weather optimization and flight planning.',
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