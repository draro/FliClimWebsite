'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

interface DemoContactFormProps {
    onSubmit: () => void;
}
declare global {
    interface Window {
        hbspt?: {
            forms: {
                submit: (formId: string, data: any) => void;
            };
        };
    }
}
export function DemoContactForm({ onSubmit }: DemoContactFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        role: '',
        phone: '',
        acceptTerms: false,
        acceptMarketing: false
    });

    const roles = [
        'Flight Operations Manager',
        'Dispatch Manager',
        'Chief Pilot',
        'Flight Planner',
        'Operations Director',
        'Other'
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

        try {
            // Send notification email via EmailJS
            await emailjs.send(
                'service_c2sgsml',
                'template_oboeia9',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    company: formData.company,
                    role: formData.role,
                    phone: formData.phone || 'Not provided',
                    subject: 'Demo Access Request',
                    message: `New demo access request from ${formData.company}`,
                    to_email: 'davide@flyclim.com'
                },
                'M6qeI5v5CtMA9WGRb'
            );

            // Create lead in CRM
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    role: formData.role,
                    phone: formData.phone,
                    source: 'demo',
                    status: 'new',
                    acceptMarketing: formData.acceptMarketing,
                    activities: [{
                        type: 'demo_request',
                        note: 'Requested demo access',
                        timestamp: new Date()
                    }]
                })
            });

            // if (!response.ok) {
            //     throw new Error('Failed to create lead');
            // }

            // Submit to HubSpot
            if (window.hbspt) {
                const hubspotData = {
                    fields: [
                        { name: "firstname", value: formData.name.split(' ')[0] },
                        { name: "lastname", value: formData.name.split(' ').slice(1).join(' ') },
                        { name: "email", value: formData.email },
                        { name: "company", value: formData.company },
                        { name: "jobtitle", value: formData.role },
                        { name: "phone", value: formData.phone },
                        { name: "demo_requested", value: "true" }
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
                description: "Thank you for your interest. You can now explore the demo.",
            });

            onSubmit();
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-lg">
            <form id="demo-form" onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Try FlyClim Demo
                </h2>

                <p className="text-gray-600 text-center mb-6">
                    Enter your details to access our interactive demo and explore FlyClim&apos;s capabilities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            placeholder="work@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <Input
                        value={formData.company}
                        onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        required
                        placeholder="Company Name"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <Select
                            value={formData.role}
                            onValueChange={value => setFormData(prev => ({ ...prev, role: value }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                            }
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
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, acceptMarketing: checked as boolean }))
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="acceptMarketing"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I would like to receive updates about FlyClim products and services
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Start Demo'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting this form, you agree to receive communications about FlyClim&apos;s products and services.
                    You can unsubscribe at any time.
                </p>
            </form>
        </Card>
    );
}