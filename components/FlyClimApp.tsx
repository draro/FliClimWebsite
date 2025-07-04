"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  CloudRain,
  BookOpen,
  Zap,
  Shield,
  Smartphone,
  MapPin,
  Clock,
  TrendingUp,
  Wind,
  Eye,
  Navigation,
  BarChart3,
  FileText,
  Users,
  Star,
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Gauge,
  CloudLightning,
  Route,
  Calculator,
  Lock,
  Layers,
  RefreshCw,
  Target,
  Award,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FlyClimApp() {
  const features = [
    {
      category: "Flight Planning",
      icon: Plane,
      color: "bg-blue-500",
      items: [
        {
          icon: Route,
          title: "Smart FPL Generation",
          description:
            "Intelligent route generation optimizing for shortest route, fuel efficiency, and weather avoidance",
        },
        {
          icon: Navigation,
          title: "IFR & VFR Support",
          description:
            "Comprehensive support for both instrument and visual flight rules planning",
        },
        {
          icon: Calculator,
          title: "Fuel & Time Calculations",
          description:
            "Automatic calculations for fuel requirements and estimated time en route",
        },
        {
          icon: Target,
          title: "Route Optimization",
          description:
            "Advanced algorithms to find the most efficient routes considering multiple factors",
        },
      ],
    },
    {
      category: "Weather Intelligence",
      icon: CloudRain,
      color: "bg-orange-500",
      items: [
        {
          icon: CloudLightning,
          title: "Real-Time Storm Tracking",
          description:
            "Live storm detection and tracking with 5-minute update intervals",
        },
        {
          icon: Wind,
          title: "Turbulence Analysis",
          description:
            "Advanced turbulence prediction and jet stream visualization",
        },
        {
          icon: Layers,
          title: "SIGWX Layers",
          description:
            "Detailed Significant Weather charts and NWP data overlay",
        },
        {
          icon: RefreshCw,
          title: "Dynamic Updates",
          description:
            "Real-time weather updates every 5 minutes with proprietary algorithms",
        },
      ],
    },
    {
      category: "Digital Logbook",
      icon: BookOpen,
      color: "bg-green-500",
      items: [
        {
          icon: Clock,
          title: "Auto-Calculations",
          description:
            "Automatic calculation of night time, landings, and flight hours per aviation standards",
        },
        {
          icon: FileText,
          title: "Digital Signatures",
          description:
            "Secure digital signature support for logbook verification and compliance",
        },
        {
          icon: BarChart3,
          title: "Flight Analytics",
          description:
            "Detailed analysis of flight stages, performance metrics, and trends",
        },
        {
          icon: Award,
          title: "Compliance Tracking",
          description:
            "Automatic tracking of currency requirements and certification compliance",
        },
      ],
    },
  ];

  const strengths = [
    {
      icon: Zap,
      title: "Comprehensive Integration",
      description:
        "Single platform combining flight planning, weather, and logbook functionality",
    },
    {
      icon: Eye,
      title: "Advanced Visualization",
      description:
        "Sophisticated weather overlays and interactive mapping capabilities",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with encrypted data handling and secure authentication",
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description:
        "Consistent experience across web and mobile platforms with native features",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description:
        "Deep insights into flight performance and operational efficiency",
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description:
        "Intuitive interface making complex aviation data accessible and actionable",
    },
  ];

  const screenshots = [
    {
      title: "Flight Planning Interface",
      description:
        "Comprehensive flight planning with real-time weather overlay",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Weather Visualization",
      description:
        "Advanced weather layers including storms, turbulence, and SIGWX data",
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Digital Logbook",
      description:
        "Comprehensive flight logging with automatic calculations and analytics",
      image:
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                Coming Soon
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Professional Flight Planning
                <span className="text-blue-600 block">Redefined</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                FlyClim App is a comprehensive flight planning and weather
                application designed for professional pilots. Combining advanced
                flight planning, real-time weather intelligence, and digital
                logbook capabilities in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  <Download className="h-5 w-5 mr-2" />
                  Get Early Access
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Plane className="h-16 w-16 text-white" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">
                      Real-time weather updates
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Smart route optimization
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Digital logbook integration
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Professional Flight Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FlyClim App integrates all essential flight planning tools into
              one comprehensive platform, designed specifically for professional
              pilots and aviation operations.
            </p>
          </motion.div>

          <div className="space-y-16">
            {features.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-full ${category.color}`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: categoryIndex * 0.2 + itemIndex * 0.1,
                      }}
                    >
                      <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <item.icon className="h-5 w-5 text-gray-700" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Uniqueness Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What Makes FlyClim App Unique
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                FlyClim App stands out in the aviation software landscape
                through its integrated approach and advanced capabilities that
                address real pilot needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Comprehensive Integration
                    </h3>
                    <p className="text-gray-600">
                      Single platform combining flight planning, real-time
                      weather, and digital logbook, eliminating the need for
                      multiple tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <CloudLightning className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Advanced Weather Intelligence
                    </h3>
                    <p className="text-gray-600">
                      Proprietary algorithms providing real-time turbulence and
                      storm data updated every 5 minutes with SIGWX and NWP
                      integration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Fingerprint className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Smart Automation
                    </h3>
                    <p className="text-gray-600">
                      Intelligent flight plan generation and automatic logbook
                      calculations based on official aviation definitions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={screenshot.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={index === 0 ? "col-span-2" : ""}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-video">
                      <Image
                        src={screenshot.image}
                        alt={screenshot.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold mb-1">
                          {screenshot.title}
                        </h4>
                        <p className="text-sm opacity-90">
                          {screenshot.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strengths Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Professional Aviation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FlyClim App's core strengths make it the ideal choice for
              professional pilots and aviation operations seeking efficiency and
              reliability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strengths.map((strength, index) => (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-6">
                    <strength.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {strength.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {strength.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technical Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology and designed for scalability,
              security, and performance.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Platform Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Cross-platform compatibility (Web & Mobile)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time data synchronization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Offline capability for critical functions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Biometric authentication support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Cloud backup and synchronization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Subscription management integration</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Security & Compliance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>Secure authentication protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>Aviation compliance standards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>Digital signature verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>Audit trail and logging</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>GDPR and privacy compliance</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Flight Operations?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join the waitlist for early access to FlyClim App and be among the
              first pilots to experience the future of flight planning and
              weather intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group">
                <Download className="h-5 w-5 mr-2" />
                Join Waitlist
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/contact" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
