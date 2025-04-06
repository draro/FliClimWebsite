'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Avoid Flight Delays
          <br />
          <span className="text-blue-600">Before They Happen</span>
        </motion.h1>

        <motion.div
          className="mt-4 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl text-gray-600">
            AI-Powered Weather Optimization for Smarter Aviation Operations
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FlyClim helps airlines proactively detect and avoid weather-related disruptions using real-time data and predictive routing intelligence. Save time, reduce fuel burn, lower operational costs—and transform how you fly.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/pilot-program" passHref>
            <Button size="lg">
              Join Our Pilot Program
            </Button>
          </Link>
          <Link href="/demo" passHref>
            <Button size="lg" variant="outline">
              Try Live Demo
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}