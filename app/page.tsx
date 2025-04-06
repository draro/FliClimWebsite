import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Solutions } from '@/components/Solutions';
import { PilotProgram } from '@/components/PilotProgram';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <About />
        <Solutions />
        <PilotProgram />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}