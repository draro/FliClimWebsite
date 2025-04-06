'use client';

import { motion } from 'framer-motion';

export function Terms() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: March 20, 2024
            </p>

            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-6">
              Welcome to FlyClim. By accessing or using our services, you agree to be bound by these terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">"Service" refers to FlyClim's weather optimization and flight planning platform</li>
              <li className="mb-2">"User" refers to any individual or entity accessing or using the Service</li>
              <li className="mb-2">"Content" refers to all information and data provided through the Service</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. Use License</h2>
            <p className="mb-6">
              FlyClim grants you a limited, non-exclusive, non-transferable license to access and use the Service for your internal business purposes.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Restrictions</h2>
            <p className="mb-6">
              You may not:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Modify or copy the materials</li>
              <li className="mb-2">Use the materials for any commercial purpose without authorization</li>
              <li className="mb-2">Remove any copyright or other proprietary notations</li>
              <li className="mb-2">Transfer the materials to another person or entity</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
            <p className="mb-6">
              The Service is provided "as is". FlyClim makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Limitations</h2>
            <p className="mb-6">
              FlyClim shall not be liable for any damages arising out of the use or inability to use the Service.
            </p>

            <h2 className="text-2xl font-semibold mb-4">7. Revisions</h2>
            <p className="mb-6">
              FlyClim may revise these terms at any time without notice. By using the Service, you agree to be bound by the current version of these terms.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="mb-6">
              These terms shall be governed by and construed in accordance with the laws of the United States.
            </p>

            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="mb-6">
              For any questions regarding these terms, please contact us at legal@flyclim.com.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}