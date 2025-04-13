import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Terms } from '@/components/Terms';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'FlyClim terms and conditions of service.',
  alternates: {
    canonical: `https://www.flyclim.com/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Terms />
      </div>
      <Footer />
    </main>
  );
}