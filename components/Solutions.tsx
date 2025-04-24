"use client";

import { motion } from "framer-motion";
import {
  CloudLightning,
  Workflow,
  DollarSign,
  Plane,
  AlertTriangle,
  Wind,
  Eye,
  Gauge,
  Clock,
  Zap,
  Navigation,
  BarChart,
} from "lucide-react";

export function Solutions() {
  const solutions = [
    {
      icon: CloudLightning,
      title: "In-Flight Risk Assessment & Smart Rerouting",
      description:
        "Real-time and predictive route analysis using satellite data, lightning detection, and advanced weather models to ensure safer, more efficient flights.",
      features: [
        {
          icon: Zap,
          label: "Storm Detection",
          description: "Monitors convective activity and storm cells",
        },
        {
          icon: Wind,
          label: "Turbulence Analysis",
          description: "Tracks jet stream and wind shear conditions",
        },
        {
          icon: Navigation,
          label: "Route Optimization",
          description: "Suggests safer alternate routes",
        },
        {
          icon: BarChart,
          label: "Impact Analysis",
          description: "Calculates time and fuel effects",
        },
      ],
    },
    {
      icon: AlertTriangle,
      title: "Airport Risk Assessment",
      description:
        "Real-time and forecast-based weather risk analysis for airports, evaluating wind conditions, visibility, storm proximity, and more to predict operational challenges.",
      features: [
        {
          icon: Wind,
          label: "Wind Risk Analysis",
          description: "Evaluates gusts, crosswind, and tailwind impact",
        },
        {
          icon: Eye,
          label: "Visibility Assessment",
          description: "Monitors fog, cloud base, and visibility trends",
        },
        {
          icon: Gauge,
          label: "Pressure Monitoring",
          description: "Tracks rapid changes indicating hazards",
        },
        {
          icon: Clock,
          label: "Delay Prediction",
          description: "Calculates probability based on conditions",
        },
      ],
    },
    {
      icon: Workflow,
      title: "Seamless Integration",
      description:
        "No need to overhaul existing systems. Our API connects easily to your current operations, making adoption simple and fast.",
    },
    {
      icon: DollarSign,
      title: "Real Savings, Real ROI",
      description:
        "Participating airlines can expect to reduce delays and save up to $2M annually. Break-even in just 1–2 months.",
    },
    {
      icon: Plane,
      title: "Built for Airlines",
      description:
        "FlyClim supports both commercial and cargo carriers, with plans to expand to drone and urban air mobility sectors.",
    },
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
              className={`bg-white p-8 rounded-lg shadow-sm ${
                solution.features ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center mb-4">
                <solution.icon className="h-8 w-8 text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">{solution.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{solution.description}</p>

              {solution.features && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t">
                  {solution.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + featureIndex * 0.1,
                      }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="bg-blue-50 p-3 rounded-full mb-4">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium mb-2">{feature.label}</h4>
                      <p className="text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
