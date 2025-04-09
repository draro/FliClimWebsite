'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const subjects = [
    { value: 'pilot-program', label: 'Pilot Program Application' },
    { value: 'investor', label: 'Investor Inquiry' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const subjectLabel = subjects.find(s => s.value === formData.subject)?.label || 'Contact Form Submission';
    
    try {
      await emailjs.send(
        'service_c2sgsml',
        'template_oboeia9',
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company,
          subject: subjectLabel,
          message: formData.message,
          accept_marketing: formData.acceptMarketing ? 'Yes' : 'No',
          to_email: 'davide@flyclim.com'
        },
        'M6qeI5v5CtMA9WGRb'
      );

      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        acceptTerms: false,
        acceptMarketing: false
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleCheckboxChange = (checked: boolean, id: string) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Let&apos;s Talk About Smarter Aviation
          </h2>
          <p className="text-xl text-gray-600">
            Have questions? Interested in our pilot program? Looking for partnership opportunities?
            <br />
            Reach out—we&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Airline / Company
                </label>
                <Input 
                  id="company" 
                  value={formData.company}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Select 
                  value={formData.subject} 
                  onValueChange={handleSubjectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'acceptTerms')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="acceptTerms"
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

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'acceptMarketing')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="acceptMarketing"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I would like to receive updates about FlyClim products, services, and events
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full group relative overflow-hidden"
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center gap-2 group-hover:-translate-y-[150%] transition-transform duration-300">
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </span>
                <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </span>
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}