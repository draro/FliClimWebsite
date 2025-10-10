import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Workflow,
  Gauge,
  Clock,
  Globe,
  Shield,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'eAIP System - Electronic Aeronautical Information Publication Platform',
  description: 'Enterprise-grade eAIP (Electronic Aeronautical Information Publication) system for Civil Aviation Authorities. ICAO Annex 15 and EUROCONTROL Specification 3.0 compliant with automated NOTAM integration, AIRAC cycle management, version control, and enterprise security. Streamline your AIP publication process.',
  keywords: [
    'eAIP system',
    'electronic AIP',
    'digital AIP platform',
    'ICAO Annex 15 compliance',
    'EUROCONTROL Specification 3.0',
    'civil aviation authority software',
    'AIP management system',
    'NOTAM automation',
    'AIRAC cycle management',
    'aeronautical information publication',
    'aviation information management',
    'AIS automation',
    'aeronautical data quality',
    'aviation compliance software'
  ],
  alternates: {
    canonical: `https://www.flyclim.com/eaip`,
  },
  openGraph: {
    title: 'eAIP System - ICAO Compliant Digital AIP Platform | FlyClim',
    description: 'Enterprise eAIP system for Civil Aviation Authorities. ICAO Annex 15 compliant with automated NOTAM integration, AIRAC management, and SOC 2 security.',
    images: ['/logo.png'],
    url: 'https://www.flyclim.com/eaip',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eAIP System - ICAO Compliant Digital AIP Platform | FlyClim',
    description: 'Enterprise eAIP system for Civil Aviation Authorities. ICAO Annex 15 compliant with automated NOTAM integration, AIRAC management, and SOC 2 security.',
    images: ['/logo.png'],
  }
};

export default function EAIPPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-blue-500/30 px-6 py-2 rounded-full mb-6">
              <span className="font-semibold text-sm uppercase tracking-wide">
                For Civil Aviation Authorities
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Enterprise eAIP System
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              ICAO Annex 15 & EUROCONTROL Specification 3.0 Compliant
            </p>
            <p className="text-lg text-blue-200 mb-10 max-w-3xl mx-auto">
              Comprehensive electronic Aeronautical Information Publication management platform designed specifically
              for Civil Aviation Authorities and Air Navigation Service Providers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="https://eaip.flyclim.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  Access eAIP Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Request Demo
                </Button>
              </Link>
            </div>

            {/* Key Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">✓ ICAO Annex 15</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">✓ EUROCONTROL Spec 3.0</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">✓ SOC 2 Certified</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">✓ 99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Regulatory Compliance</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-gray-600">Faster Publication</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete eAIP Management Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage, publish, and distribute aeronautical information in full compliance with international standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ICAO Compliant Document Management</h3>
              <p className="text-gray-600 mb-4">
                Fully compliant with ICAO Annex 15 and EUROCONTROL Specification 3.0. Support for GEN, ENR, and AD sections with template-based creation.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Complete GEN, ENR, AD section templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>ICAO field validation & formatting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automated compliance checking</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated NOTAM Integration</h3>
              <p className="text-gray-600 mb-4">
                Automated NOTAM generation compliant with ICAO standards. Support for Categories A-X with seamless integration.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All ICAO NOTAM categories (A-X)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automatic formatting & validation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Q-line code generation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <Workflow className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Workflow Management</h3>
              <p className="text-gray-600 mb-4">
                Multi-level approval workflows with digital signatures. Custom workflow templates and role-based access control.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Customizable approval chains</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Digital signature integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email notifications & reminders</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <Gauge className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance & Validation</h3>
              <p className="text-gray-600 mb-4">
                Automated validation against ICAO standards with data quality checking and compliance scoring.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time ICAO validation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Coordinate & frequency verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Data quality reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Version Control & AIRAC</h3>
              <p className="text-gray-600 mb-4">
                Git-based tracking with AIRAC cycle management. Visual change comparison and automated scheduling.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>28-day AIRAC cycle automation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Visual diff comparison</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rollback & amendment tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Format Export & Distribution</h3>
              <p className="text-gray-600 mb-4">
                Export to JSON, XML, HTML with professional formatting. Automated metadata generation and distribution.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>PDF, HTML, JSON, XML export</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automated metadata generation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>FTP/SFTP distribution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security & Reliability
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with aviation-critical security standards and backed by industry-leading SLAs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                Security Features
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">256-bit Encryption & GDPR Compliance</strong>
                    <p className="text-gray-600 text-sm mt-1">End-to-end encryption for all data in transit and at rest</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Multi-Tenant Architecture</strong>
                    <p className="text-gray-600 text-sm mt-1">Complete data isolation with role-based access control</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Digital Signatures & Audit Trails</strong>
                    <p className="text-gray-600 text-sm mt-1">Full traceability with comprehensive logging</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">SOC 2 Type II Certified</strong>
                    <p className="text-gray-600 text-sm mt-1">Annual audits and penetration testing</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-600" />
                Technical Capabilities
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Coordinate & Frequency Validation</strong>
                    <p className="text-gray-600 text-sm mt-1">Automatic validation of geographic coordinates and radio frequencies</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">ICAO Identifier Validation</strong>
                    <p className="text-gray-600 text-sm mt-1">Real-time checking against ICAO location indicators</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Automated AIRAC Cycle Scheduling</strong>
                    <p className="text-gray-600 text-sm mt-1">28-day cycle management with automatic publication</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">99.9% Uptime SLA</strong>
                    <p className="text-gray-600 text-sm mt-1">Redundant infrastructure with automatic failover</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who Uses Our eAIP System?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by aviation authorities and service providers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border-2 border-blue-100">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Civil Aviation Authorities</h3>
              <p className="text-gray-600">
                National CAAs managing complete AIP publications, NOTAM systems, and aeronautical data for their entire airspace.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-2 border-blue-100">
              <Globe className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Air Navigation Service Providers</h3>
              <p className="text-gray-600">
                ANSPs coordinating airspace information, route structures, and navigation procedures across regions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-2 border-blue-100">
              <Award className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Airport Authorities</h3>
              <p className="text-gray-600">
                Major airports managing aerodrome information, procedures, and infrastructure data publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Modernize Your AIP Management?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join Civil Aviation Authorities worldwide who trust FlyClim's eAIP system for compliant,
            efficient aeronautical information management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://eaip.flyclim.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                Access eAIP Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Schedule a Demo
              </Button>
            </Link>
          </div>

          <p className="text-blue-200 mt-8">
            Questions? Contact our team at <a href="mailto:info@flyclim.com" className="underline hover:text-white">info@flyclim.com</a> or call <a href="tel:+19894472494" className="underline hover:text-white">+1 (989) 447-2494</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
