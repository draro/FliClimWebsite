import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { PilotDirectory } from '@/components/PilotDirectory';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pilot Directory',
  description: 'Discover professional pilots in the FlyClim community. Connect with experienced aviators and explore their profiles.',
  openGraph: {
    title: 'FlyClim Pilot Directory - Professional Aviation Community',
    description: 'Discover professional pilots in the FlyClim community. Connect with experienced aviators and explore their profiles.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Pilot Directory - Professional Aviation Community',
    description: 'Discover professional pilots in the FlyClim community. Connect with experienced aviators and explore their profiles.',
    images: ['/logo.png'],
  }
};

export default function PilotDirectoryPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PilotDirectory />
      </div>
      <Footer />
    </main>
  );
}