'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import emailjs from '@emailjs/browser';
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    hbspt: any;
  }
}

const CesiumViewer = dynamic(
  () => import('@/components/CesiumViewer').then(mod => mod.default),
  {
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Cesium viewer...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function DemoPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    acceptTerms: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
    if (formErrors.acceptTerms) {
      setFormErrors(prev => ({ ...prev, acceptTerms: '' }));
    }
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#fplForm',
          popover: {
            title: 'Flight Plan Form',
            description: 'Enter your flight plan details here. You can either paste your own FPL or use one of our templates.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.tab-buttons',
          popover: {
            title: 'Input Methods',
            description: 'Choose between manually entering your flight plan or selecting from pre-configured templates.',
            side: 'right'
          }
        },
        {
          element: '#cesiumContainer',
          popover: {
            title: '3D Globe View',
            description: 'This interactive 3D globe shows your flight route and real-time storm data.',
            side: 'left'
          }
        },
        {
          element: '.cesium-viewer-toolbar',
          popover: {
            title: 'Navigation Controls',
            description: 'Use these controls to zoom, rotate, and navigate around the globe.',
            side: 'left'
          }
        },
        {
          element: '.cesium-viewer-animationContainer',
          popover: {
            title: 'Time Controls',
            description: 'Control the playback of your flight simulation and storm data visualization.',
            side: 'top'
          }
        },
        {
          element: '#viewRisksButton',
          popover: {
            title: 'Risk Analysis',
            description: 'After submitting a flight plan, this button appears to show detailed risk analysis, including potential weather hazards, suggested route modifications, and updated flight plans.',
            side: 'right'
          }
        }
      ]
    });

    driverObj.drive();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Send email via EmailJS
        await emailjs.send(
          'service_c2sgsml',
          'template_oboeia9',
          {
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            company: formData.company,
            subject: 'Demo Access Request',
            message: `New demo access request from ${formData.company}.`,
            to_email: 'davide@flyclim.com'
          },
          'M6qeI5v5CtMA9WGRb'
        );

        // Submit to HubSpot
        if (window.hbspt) {
          const hubspotData = {
            fields: [
              { name: "firstname", value: formData.firstName },
              { name: "lastname", value: formData.lastName },
              { name: "email", value: formData.email },
              { name: "company", value: formData.company }
            ],
            context: {
              pageUri: window.location.href,
              pageName: "Demo Request"
            }
          };

          window.hbspt.forms.submit("demo-form", hubspotData);
        }

        toast({
          title: "Success!",
          description: "Your demo access request has been sent.",
        });

        setShowIntro(false);
        startTour();
      } catch (error) {
        console.error('Failed to send email:', error);
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="relative h-screen">
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              Welcome to FlyClim Demo
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                <p className="text-base">
                  This is a proof-of-concept demonstration of FlyClim&apos;s storm tracking and flight route optimization capabilities.
                </p>

                <form id="demo-form" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? 'border-red-500' : ''}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-red-500">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? 'border-red-500' : ''}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-red-500">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={formErrors.company ? 'border-red-500' : ''}
                    />
                    {formErrors.company && (
                      <p className="text-sm text-red-500">{formErrors.company}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I accept the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
                          terms and conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                          privacy policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {formErrors.acceptTerms && (
                    <p className="text-sm text-red-500">{formErrors.acceptTerms}</p>
                  )}
                </form>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Please note:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>This is a simplified version of our full platform</li>
                    <li>Some features may be limited or unavailable</li>
                  </ul>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Start Demo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 z-50 flex gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={startTour}
          className="bg-white/95 hover:bg-white border-blue-100 hover:border-blue-200 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Link href="/" passHref>
          <Button
            variant="outline"
            className="bg-white/95 hover:bg-white border-blue-100 hover:border-blue-200 shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Website
          </Button>
        </Link>
        <Link href="/" passHref>
          <Button
            size="icon"
            variant="outline"
            className="bg-white/95 hover:bg-white border-blue-100 hover:border-blue-200 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <Home className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
      <CesiumViewer />
    </div>
  );
}