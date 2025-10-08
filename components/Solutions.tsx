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
  BookOpen,
  FileText,
  Search,
  Globe,
} from "lucide-react";
import Link from "next/link";

export function Solutions() {
  const solutions = [
    {
      icon: CloudLightning,
      title: "Flight Optimization: In-Flight Risk Assessment & Smart Rerouting",
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
      title: "Flight Optimization: Airport Risk Assessment",
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

  const eaipFeatures = [
    {
      icon: BookOpen,
      label: "ICAO Compliant Document Management",
      description: "Fully compliant with ICAO Annex 15 and EUROCONTROL Specification 3.0. Support for GEN, ENR, and AD sections with template-based creation.",
    },
    {
      icon: FileText,
      label: "Automatic NOTAM Integration",
      description: "Automated NOTAM generation compliant with ICAO standards. Support for Categories A-X with seamless integration.",
    },
    {
      icon: Workflow,
      label: "Advanced Workflow Management",
      description: "Multi-level approval workflows with digital signatures. Custom workflow templates and role-based access control.",
    },
    {
      icon: Gauge,
      label: "Compliance & Validation",
      description: "Automated validation against ICAO standards with data quality checking and compliance scoring.",
    },
    {
      icon: Clock,
      label: "Version Control & AIRAC",
      description: "Git-based tracking with AIRAC cycle management. Visual change comparison and automated scheduling.",
    },
    {
      icon: Globe,
      label: "Multi-Format Export & Distribution",
      description: "Export to JSON, XML, HTML with professional formatting. Automated metadata generation and distribution.",
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
            Two Powerful Solutions for Modern Aviation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From comprehensive digital aeronautical information management to intelligent flight optimization
          </p>
        </motion.div>

        {/* eAIP Section - Featured First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-block bg-blue-500/30 px-6 py-2 rounded-full mb-6"
                >
                  <span className="text-white font-semibold text-sm uppercase tracking-wide">
                    For Civil Aviation Authorities
                  </span>
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  eAIP System
                </h3>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
                  Electronic Aeronautical Information Publication Management Platform
                </p>
                <p className="text-lg text-blue-200 max-w-3xl mx-auto">
                  Designed specifically for Civil Aviation Authorities. Fully compliant with ICAO Annex 15
                  and EUROCONTROL Specification 3.0. Streamline your AIP publication process with our
                  enterprise-grade, secure platform.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center p-6 bg-blue-700/40 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-blue-100 text-sm">Regulatory Compliance</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center p-6 bg-blue-700/40 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-4xl font-bold text-white mb-2">70%</div>
                  <div className="text-blue-100 text-sm">Faster Publication</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center p-6 bg-blue-700/40 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-blue-100 text-sm">Uptime SLA</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center p-6 bg-blue-700/40 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-4xl font-bold text-white mb-2">SOC 2</div>
                  <div className="text-blue-100 text-sm">Compliant & Secure</div>
                </motion.div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {eaipFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
                  >
                    <div className="bg-blue-500/30 p-3 rounded-lg w-fit mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-lg">
                      {feature.label}
                    </h4>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Security & Technical Highlights */}
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-8 mb-10">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">
                  Enterprise-Grade Security & Capabilities
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Security Features
                    </h5>
                    <ul className="space-y-2 text-blue-100">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>256-bit encryption & GDPR ready</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Multi-tenant architecture with role-based access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Digital signatures & audit trails</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Technical Capabilities
                    </h5>
                    <ul className="space-y-2 text-blue-100">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Coordinate & frequency validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>ICAO identifier validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Automated AIRAC cycle scheduling</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  href="https://eaip.flyclim.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Explore eAIP System in Detail
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flight Optimization Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Flight Optimization
          </motion.h3>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Smarter Routes. Fewer Delays. Greater Efficiency.
          </p>
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
      </div>
    </section>
  );
}
