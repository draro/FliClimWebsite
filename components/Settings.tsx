'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';

interface Settings {
    linkedinAccessToken?: string;
    linkedinPageId?: string;
    linkedinOrganizationId?: string;
}

export function Settings() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<Settings>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch settings',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to update settings');

            toast({
                title: 'Success',
                description: 'Settings updated successfully'
            });
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to update settings',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Linkedin className="h-5 w-5" />
                            LinkedIn Integration
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Access Token</label>
                                <Input
                                    type="password"
                                    value={settings.linkedinAccessToken}
                                    onChange={e => setSettings(prev => ({ ...prev, linkedinAccessToken: e.target.value }))}
                                    placeholder="LinkedIn Access Token"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Page ID</label>
                                <Input
                                    value={settings.linkedinPageId}
                                    onChange={e => setSettings(prev => ({ ...prev, linkedinPageId: e.target.value }))}
                                    placeholder="LinkedIn Page ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Organization ID</label>
                                <Input
                                    value={settings.linkedinOrganizationId}
                                    onChange={e => setSettings(prev => ({ ...prev, linkedinOrganizationId: e.target.value }))}
                                    placeholder="LinkedIn Organization ID"
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Save Settings
                    </Button>
                </form>
            </Card>
        </div>
    );
}