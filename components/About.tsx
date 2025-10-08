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
            Built by Aviation Experts. Powered by Innovation.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            From AI-powered flight optimization to comprehensive eAIP systems for Civil Aviation Authorities,
            we deliver enterprise-grade aviation solutions backed by deep industry expertise.
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
            <h3 className="text-xl font-semibold mb-4">Global Experience</h3>
            <p className="text-gray-600">
              Operating in 50+ countries with major airports and air navigation services
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
            <h3 className="text-xl font-semibold mb-4">15+ Years Experience</h3>
            <p className="text-gray-600">
              Deep expertise in air traffic management and weather systems
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
            <h3 className="text-xl font-semibold mb-4">Trusted Partners</h3>
            <p className="text-gray-600">
              Working with leading airports and weather agencies worldwide
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}