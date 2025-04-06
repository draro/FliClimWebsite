'use client';

import { motion } from 'framer-motion';

export function Privacy() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: March 20, 2024
            </p>

            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-6">
              FlyClim is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Contact information (name, email, phone number)</li>
              <li className="mb-2">Company information</li>
              <li className="mb-2">Flight planning data</li>
              <li className="mb-2">Usage data and analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Provide and improve our services</li>
              <li className="mb-2">Communicate with you about our services</li>
              <li className="mb-2">Send you marketing communications (with consent)</li>
              <li className="mb-2">Analyze and improve our platform</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational measures to protect your personal information.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p className="mb-6">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Google Analytics for website analytics</li>
              <li className="mb-2">Google Tag Manager for tag management</li>
              <li className="mb-2">HubSpot for customer relationship management</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Access your personal information</li>
              <li className="mb-2">Correct inaccurate information</li>
              <li className="mb-2">Request deletion of your information</li>
              <li className="mb-2">Opt-out of marketing communications</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="mb-6">
              We use cookies and similar technologies to improve your browsing experience and analyze website traffic.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
            <p className="mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="mb-6">
              For any questions about this privacy policy, please contact us at privacy@flyclim.com.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}