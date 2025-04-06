import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { PilotProgram } from '@/components/PilotProgram';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pilot Program',
  description: 'Join FlyClim\'s pilot program and be among the first to experience our revolutionary weather optimization technology.',
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