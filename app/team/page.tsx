import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Our Team',
    description: 'Meet the experienced aviation and technology professionals behind FlyClim.',
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