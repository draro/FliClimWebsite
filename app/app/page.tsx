import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { FlyClimApp } from "@/components/FlyClimApp";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FlyClim App - Professional Flight Planning & Weather",
  description:
    "Professional flight planning and weather application for pilots. Comprehensive suite of tools for flight management, real-time weather monitoring, and flight data analysis.",
  openGraph: {
    title: "FlyClim App - Professional Flight Planning & Weather",
    description:
      "Professional flight planning and weather application for pilots. Comprehensive suite of tools for flight management, real-time weather monitoring, and flight data analysis.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlyClim App - Professional Flight Planning & Weather",
    description:
      "Professional flight planning and weather application for pilots. Comprehensive suite of tools for flight management, real-time weather monitoring, and flight data analysis.",
    images: ["/logo.png"],
  },
};

export default function AppPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <FlyClimApp />
      </div>
      <Footer />
    </main>
  );
}
