'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PilotProgram() {
  const router = useRouter();
  
  const benefits = [
    'Access early insights on flight delay risks',
    'Evaluate alternate routes based on predictive logic',
    'Measure impact on cost, time, and fuel',
    'Help shape the future of aviation efficiency',
    'Full onboarding support',
    'Integration assistance',
    'Real-time operational feedback'
  ];

  const handleApply = () => {
    router.push('/contact?subject=pilot-program');
  };

  return (
    <section id="pilot-program" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join the FlyClim Pilot Program
          </h2>
          <p className="text-xl text-gray-600">
            Be among the first airlines to experience real-time delay prevention, smarter routing, and measurable ROI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-6">Program Benefits</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-6">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8">
              Participation is free for selected partners. Limited spots available.
            </p>
            <Button 
              size="lg" 
              className="w-full group relative overflow-hidden"
              onClick={handleApply}
            >
              <span className="flex items-center justify-center gap-2 group-hover:-translate-y-[150%] transition-transform duration-300">
                Apply to the Pilot Program
                <Send className="h-4 w-4" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300">
                Contact Us Now
                <Send className="h-4 w-4" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}