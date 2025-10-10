"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, XIcon, Youtube, Facebook } from "lucide-react";
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white" aria-label="Hero section">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" role="presentation" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-blue-600">Enterprise eAIP System</span>
          <br />
          for Civil Aviation Authorities
        </motion.h1>

        <motion.div
          className="mt-4 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            ICAO Annex 15 Compliant Digital AIP Platform
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive electronic Aeronautical Information Publication system with automated NOTAM integration,
            AIRAC cycle management, and enterprise-grade security. Plus AI-powered flight weather optimization
            for airlines to reduce delays and operational costs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 font-medium">
            <span className="bg-blue-50 px-4 py-2 rounded-full">✓ ICAO Compliant</span>
            <span className="bg-blue-50 px-4 py-2 rounded-full">✓ EUROCONTROL Spec 3.0</span>
            <span className="bg-blue-50 px-4 py-2 rounded-full">✓ SOC 2 Certified</span>
            <span className="bg-blue-50 px-4 py-2 rounded-full">✓ 99.9% Uptime</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="https://eaip.flyclim.com" target="_blank" rel="noopener noreferrer" passHref>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Explore eAIP System →
            </Button>
          </Link>
          <Link href="/solutions" passHref>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View All Solutions
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Request Demo
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* <a
            href="https://twitter.com/flyclim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-400 transition-colors"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">X</span>
            </Button>
          </a> */}
          <a
            href="https://linkedin.com/company/flyclim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-700 transition-colors"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </a>
          <a
            href="https://www.facebook.com/flyclim/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Button>
          </a>
          {/* <a
            href="https://youtube.com/@flyclim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Button>
          </a> */}
        </motion.div>
      </div>
    </section>
  );
}
