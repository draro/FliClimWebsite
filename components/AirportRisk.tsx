'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Wind,
  Thermometer,
  Gauge,
  Eye,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  X,
  Clock3
} from 'lucide-react';
import { format } from 'date-fns';

interface AirportRiskProps {
  onClose?: () => void;
}

interface AirportData {
  icao: string;
  metar: {
    raw: string;
    wind: {
      wind_direction: string;
      wind_speed: string;
      uom: string;
    };
    visibility: {
      uom: string;
      distance: string;
    };
    trend: string;
  };
  risk: {
    wind_risk: number;
    temp_risk: number;
    pressure_risk: number;
    visibility_risk: number;
    total_risk: number;
    risk_classification: string;
  };
  flight_delay: {
    delay_probability: string;
    delay_risk: string;
  };
}

export function AirportRisk({ onClose }: AirportRiskProps) {
  const { toast } = useToast();
  const [airports, setAirports] = useState<{ icao: string; data: AirportData | null }[]>([
    { icao: '', data: null }
  ]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const fetchRiskData = async (airportIcao: string, index: number) => {
    if (!airportIcao) return;

    setLoading(prev => ({ ...prev, [airportIcao]: true }));
    setError(prev => ({ ...prev, [airportIcao]: null }));

    try {
      const response = await fetch(`https://amss.xtreme-weather.com/api/airport_risk/${airportIcao}`);
      if (!response.ok) throw new Error('Failed to fetch risk data');
      const data = await response.json();
      setAirports(prev => prev.map((airport, i) =>
        i === index ? { ...airport, data } : airport
      ));
    } catch (err) {
      setError(prev => ({
        ...prev,
        [airportIcao]: err instanceof Error ? err.message : 'An error occurred'
      }));
      toast({
        title: 'Error',
        description: 'Failed to fetch airport risk data',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, [airportIcao]: false }));
    }
  };

  const addAirport = () => {
    setAirports(prev => [...prev, { icao: '', data: null }]);
  };

  const removeAirport = (index: number) => {
    setAirports(prev => prev.filter((_, i) => i !== index));
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 75) return 'bg-red-600';
    if (risk >= 50) return 'bg-orange-500';
    if (risk >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskClassification = (classification: string) => {
    const colors: Record<string, string> = {
      extreme: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[classification.toLowerCase()] || 'bg-gray-500';
  };

  const renderAirportCard = (airport: { icao: string; data: AirportData | null }, index: number) => (
    <Card key={index} className="p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <Input
          value={airport.icao}
          onChange={(e) => {
            const newIcao = e.target.value.toUpperCase();
            setAirports(prev => prev.map((a, i) =>
              i === index ? { ...a, icao: newIcao } : a
            ));
            if (newIcao.length === 4) {
              fetchRiskData(newIcao, index);
            }
          }}
          placeholder="Enter ICAO code (e.g. KJFK)"
          className="w-48"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => airport.icao && fetchRiskData(airport.icao, index)}
          disabled={loading[airport.icao] || !airport.icao}
        >
          <RefreshCw className={`h-4 w-4 ${loading[airport.icao] ? 'animate-spin' : ''}`} />
        </Button>
        {index > 0 && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeAirport(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {loading[airport.icao] && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error[airport.icao] && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error[airport.icao]}
        </div>
      )}

      {airport.data && !loading[airport.icao] && (
        <>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <pre className="font-mono text-sm whitespace-pre-wrap break-all">
              {airport.data.metar.raw}
            </pre>
          </div>

          {airport.data.flight_delay && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Flight Delay Risk</h3>
                </div>
                <Badge variant="outline" className={getRiskClassification(airport.data.flight_delay.delay_risk)}>
                  {airport.data.flight_delay.delay_risk.toUpperCase()}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-center text-blue-600">
                {airport.data.flight_delay.delay_probability}
              </p>
            </div>
          )}

          {airport.data.risk && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Risk Assessment</h3>
                <Badge variant="outline" className={getRiskClassification(airport.data.risk.risk_classification)}>
                  {airport.data.risk.risk_classification.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Wind className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Wind Risk</span>
                    <span className="ml-auto">{airport.data.risk.wind_risk}%</span>
                  </div>
                  <Progress value={airport.data.risk.wind_risk} className="h-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Thermometer className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Temperature Risk</span>
                    <span className="ml-auto">{airport.data.risk.temp_risk}%</span>
                  </div>
                  <Progress value={airport.data.risk.temp_risk} className="h-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Gauge className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Pressure Risk</span>
                    <span className="ml-auto">{airport.data.risk.pressure_risk}%</span>
                  </div>
                  <Progress value={airport.data.risk.pressure_risk} className="h-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Visibility Risk</span>
                    <span className="ml-auto">{airport.data.risk.visibility_risk}%</span>
                  </div>
                  <Progress value={airport.data.risk.visibility_risk} className="h-2" />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Total Risk</span>
                    <span className="ml-auto">{airport.data.risk.total_risk}%</span>
                  </div>
                  <Progress value={airport.data.risk.total_risk} className="h-2" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Airport Risk Assessment</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addAirport}>
            <Plus className="h-4 w-4 mr-2" />
            Add Airport
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6">
          {airports.map((airport, index) => renderAirportCard(airport, index))}
        </div>
      </ScrollArea>
    </div>
  );
}