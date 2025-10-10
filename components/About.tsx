'use client';

import { motion } from 'framer-motion';
import { Globe2, Award, Users } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Civil Aviation Authorities Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Our enterprise-grade eAIP system serves Civil Aviation Authorities and Air Navigation Service Providers globally,
            ensuring ICAO compliance and operational excellence. Plus AI-powered flight optimization solutions for airlines
            backed by 15+ years of aviation expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Globe2 className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">ICAO & EUROCONTROL Certified</h3>
            <p className="text-gray-600">
              100% compliant with ICAO Annex 15 and EUROCONTROL Specification 3.0 standards for eAIP systems
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Award className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Enterprise-Grade Security</h3>
            <p className="text-gray-600">
              SOC 2 compliant with 256-bit encryption, role-based access control, and 99.9% uptime SLA
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Proven Track Record</h3>
            <p className="text-gray-600">
              15+ years serving Civil Aviation Authorities, airports, and airlines across 50+ countries
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}