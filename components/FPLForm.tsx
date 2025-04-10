'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FPLFormProps {
  onVisualize: (data: any, fpl: string) => void;
  onLoad: () => void;
}

export function FPLForm({ onVisualize, onLoad }: FPLFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    adep: '',
    ades: '',
    aircraft_type: '',
    dep_time: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      onLoad();

      // Format the date for the API
      const depTime = new Date(formData.dep_time).toISOString();

      // Generate flight plan
      const response = await fetch('https://demo.flyclim.com/api/create-fpl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adep: formData.adep.toUpperCase(),
          ades: formData.ades.toUpperCase(),
          aircraft_type: formData.aircraft_type.toUpperCase(),
          dep_time: depTime
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate flight plan');
      }

      const data = await response.json();

      // Get route visualization
      const routeResponse = await fetch('https://demo.flyclim.com/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fpl: data.fpl })
      });

      if (!routeResponse.ok) {
        throw new Error('Failed to visualize route');
      }

      const routeData = await routeResponse.json();
      onVisualize(routeData, data.fpl);
    } catch (error) {
      console.error('FPL submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate flight plan. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Departure Airport (ICAO)
            </label>
            <Input
              value={formData.adep}
              onChange={(e) => setFormData(prev => ({ ...prev, adep: e.target.value }))}
              placeholder="KJFK"
              maxLength={4}
              required
              pattern="[A-Za-z]{4}"
              title="Please enter a valid 4-letter ICAO code"
              className="uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Arrival Airport (ICAO)
            </label>
            <Input
              value={formData.ades}
              onChange={(e) => setFormData(prev => ({ ...prev, ades: e.target.value }))}
              placeholder="KLAX"
              maxLength={4}
              required
              pattern="[A-Za-z]{4}"
              title="Please enter a valid 4-letter ICAO code"
              className="uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Aircraft Type
            </label>
            <Input
              value={formData.aircraft_type}
              onChange={(e) => setFormData(prev => ({ ...prev, aircraft_type: e.target.value }))}
              placeholder="B738"
              maxLength={4}
              required
              className="uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Departure Time (UTC)
            </label>
            <Input
              type="datetime-local"
              value={formData.dep_time}
              onChange={(e) => setFormData(prev => ({ ...prev, dep_time: e.target.value }))}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generating Flight Plan...' : 'Generate Flight Plan'}
        </Button>
      </form>
    </Card>
  );
}