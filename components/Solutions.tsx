'use client';

import { motion } from 'framer-motion';
import { CloudLightning, Workflow, DollarSign, Plane } from 'lucide-react';

export function Solutions() {
  const solutions = [
    {
      icon: CloudLightning,
      title: 'Weather-Driven Delay Prevention',
      description: 'FlyClim analyzes flight routes and proactively identifies potential weather disruptions—helping airlines avoid delays before they occur.'
    },
    {
      icon: Workflow,
      title: 'Seamless Integration',
      description: 'No need to overhaul existing systems. Our API connects easily to your current operations, making adoption simple and fast.'
    },
    {
      icon: DollarSign,
      title: 'Real Savings, Real ROI',
      description: 'Participating airlines can expect to reduce delays and save up to $2M annually. Break-even in just 1–2 months.'
    },
    {
      icon: Plane,
      title: 'Built for Airlines',
      description: 'FlyClim supports both commercial and cargo carriers, with plans to expand to drone and urban air mobility sectors.'
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smarter Routes. Fewer Delays. Greater Efficiency.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-4">
                <solution.icon className="h-8 w-8 text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">{solution.title}</h3>
              </div>
              <p className="text-gray-600">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}