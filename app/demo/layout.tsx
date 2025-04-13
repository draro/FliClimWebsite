import type { Metadata } from 'next';
import Script from 'next/script';

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
    return (
        <>
            <Script
                src="https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Cesium.js"
                strategy="afterInteractive"
            />
            <link
                href="https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Widgets/widgets.css"
                rel="stylesheet"
            />
            {children}
        </>
    );
}