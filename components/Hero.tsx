"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, XIcon, Youtube, Facebook } from "lucide-react";
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
          Complete Aviation Solutions
          <br />
          <span className="text-blue-600">From Flight Planning to Digital AIP</span>
        </motion.h1>

        <motion.div
          className="mt-4 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl text-gray-600">
            AI-Powered Flight Optimization & Advanced eAIP System
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FlyClim offers two powerful solutions: AI-driven weather optimization to reduce flight delays,
            and a comprehensive digital eAIP system for streamlined aeronautical information management.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="https://eaip.flyclim.com" target="_blank" rel="noopener noreferrer" passHref>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Explore eAIP System
            </Button>
          </Link>
          <Link href="/pilot-program" passHref>
            <Button size="lg" variant="outline">
              Join Pilot Program
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
    </div>
  );
}
