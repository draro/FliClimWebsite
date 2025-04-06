import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with FlyClim for inquiries about our aviation weather optimization solutions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}