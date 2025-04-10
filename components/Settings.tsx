'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Settings {
  linkedinAccessToken?: string;
  linkedinPageId?: string;
  linkedinOrganizationId?: string;
  linkedinTokenExpiry?: string;
}

export function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchSettings();

    // Handle OAuth callback responses
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      const errorMessages: Record<string, string> = {
        linkedin_auth_failed: 'LinkedIn authentication failed',
        invalid_state: 'Invalid state parameter',
        no_code: 'No authorization code received',
        token_exchange_failed: 'Failed to exchange code for access token',
        server_error: 'Server error occurred'
      };

      toast({
        title: 'Error',
        description: errorMessages[error] || 'Failed to connect to LinkedIn',
        variant: 'destructive'
      });
    }

    if (success) {
      toast({
        title: 'Success',
        description: 'LinkedIn connected successfully'
      });
    }
  }, [searchParams, toast]);

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

  const handleConnectLinkedIn = async () => {
    try {
      window.location.href = '/api/linkedin/auth';
    } catch (error) {
      console.error('Failed to initiate LinkedIn auth:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to LinkedIn',
        variant: 'destructive'
      });
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
                <label className="block text-sm font-medium mb-1">Connection Status</label>
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${settings.linkedinAccessToken ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{settings.linkedinAccessToken ? 'Connected' : 'Not Connected'}</span>
                  {settings.linkedinTokenExpiry && (
                    <span className="text-sm text-gray-500">
                      (Expires: {new Date(settings.linkedinTokenExpiry).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleConnectLinkedIn}
                className="w-full"
              >
                {settings.linkedinAccessToken ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
              </Button>

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