import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Privacy } from '@/components/Privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FlyClim privacy policy and data protection information.',
  alternates: {
    canonical: `https://www.flyclim.com/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Privacy />
      </div>
      <Footer />
    </main>
  );
}