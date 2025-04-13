import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Demo',
    description: 'Experience FlyClim\'s real-time weather optimization and flight planning capabilities.',
    alternates: {
        canonical: 'https://www.flyclim.com/demo',
    },
    openGraph: {
        title: 'FlyClim Demo - Try Our Flight Planning Solution',
        description: 'Experience FlyClim\'s real-time weather optimization and flight planning capabilities.',
        images: ['/logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FlyClim Demo - Try Our Flight Planning Solution',
        description: 'Experience FlyClim\'s real-time weather optimization and flight planning capabilities.',
        images: ['/logo.png'],
    }
};

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}