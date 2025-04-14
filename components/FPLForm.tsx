'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  FolderOpen,
  Save,
  Share2,
  Plane,
  Calendar,
  X,
  ChevronDown,
  Search
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FPLFormProps {
  onVisualize?: (data: any, fpl: string) => void;
  onLoad?: () => void;
  initialFPL?: string | null;
  onClose?: () => void;
}

interface Route {
  route: string;
  distance: number;
  time: string;
  fuelBurn: number;
  isEfficient?: boolean;
  clearanceAge?: number;
}

interface AircraftType {
  icao_code: string;
  manufacturer: string;
  model: string;
  description: string;
  speeds: {
    cruise: {
      tas: number;
    };
  };
  typical_altitude: number;
  performance_levels: {
    cruise: number;
  };
}
interface Airport {
  _id: any;
  icao: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  country: string;
  elevation: number;
  timezone: string;
  location: {
    type: string;
    coordinates: number[]
  };
}

export function FPLForm({ onVisualize, onLoad, initialFPL, onClose }: FPLFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    flightNumber: '',
    aircraft: '',
    speed: '',
    altitude: '',
    fuel: '',
    departure: '',
    destination: '',
    etd: '',
    date: '',
    localTime: '',
    localDate: '',
  });

  const [routes, setRoutes] = useState<Route[]>([]);
  const [aircraftTypes, setAircraftTypes] = useState<AircraftType[]>([]);
  const [openAircraftSelect, setOpenAircraftSelect] = useState(false);
  const [airports, setAirprots] = useState<Airport[]>([]);
  const [openAirportSelect, setOpenAirportSelect] = useState(false)
  const [openAirportSelect1, setOpenAirportSelect1] = useState(false)

  useEffect(() => {
    fetchAircraftTypes();
    fetchAirports()
  }, []);
  const fetchAirports = async () => {
    try {
      const response = await fetch('/api/airports');
      if (!response.ok) throw new Error('Failed to fetch aircraft types');
      const data = await response.json();
      setAirprots(data);
    } catch (error) {
      console.error('Failed to fetch Airports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Airports',
        variant: 'destructive'
      });
    }

  }
  const fetchAircraftTypes = async () => {
    try {
      const response = await fetch('/api/aircraft_types');
      if (!response.ok) throw new Error('Failed to fetch aircraft types');
      const data = await response.json();
      setAircraftTypes(data);
    } catch (error) {
      console.error('Failed to fetch aircraft types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load aircraft types',
        variant: 'destructive'
      });
    }
  };

  // Extract route information from FPL string
  const extractRouteFromFPL = (fpl: string) => {
    try {
      // Match everything between the departure and destination airports
      const routeMatch = fpl.match(/-([A-Z]{4})\d{4}\s+(.*?)\s+-([A-Z]{4})/);
      if (!routeMatch) return null;

      const [, departure, route, destination] = routeMatch;

      // Extract departure time
      const timeMatch = fpl.match(/-([A-Z]{4})(\d{4})/);
      const time = timeMatch ? timeMatch[2] : '';

      // Extract date if available
      const dateMatch = fpl.match(/DOF\/(\d{6})/);
      const date = dateMatch ? dateMatch[1] : '';

      // Extract flight number
      const flightNumberMatch = fpl.match(/\((FPL-([A-Z0-9]+))/);
      if (flightNumberMatch) {
        setFormData(prev => ({
          ...prev,
          flightNumber: flightNumberMatch[2]
        }));
      }

      // Update form data
      setFormData(prev => ({
        ...prev,
        departure,
        destination,
        etd: `${time.substring(0, 2)}:${time.substring(2, 4)}`,
        date: date ? `20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)}` : '',
      }));

      // Extract aircraft type
      const aircraftMatch = fpl.match(/-([A-Z0-9]{4})\//);
      if (aircraftMatch) {
        setFormData(prev => ({
          ...prev,
          aircraft: aircraftMatch[1]
        }));
      }

      // Add route to routes list
      setRoutes([{
        route: route.trim(),
        distance: 0,
        time: "0:00",
        fuelBurn: 0,
        isEfficient: true
      }]);

      return route.trim();
    } catch (error) {
      console.error('Error parsing FPL:', error);
      return null;
    }
  };

  // Handle initial FPL if provided
  useEffect(() => {
    if (initialFPL) {
      extractRouteFromFPL(initialFPL);
    }
  }, [initialFPL]);

  const handleAircraftSelect = (aircraft: AircraftType) => {
    console.log("aircraft", aircraft);
    setFormData(prev => ({
      ...prev,
      aircraft: aircraft.icao_code,
      speed: aircraft?.speeds?.cruise?.tas?.toString(),
      altitude: Math.floor(aircraft.typical_altitude / 100).toString().padStart(3, '0')
    }));
    setOpenAircraftSelect(false);
  };
  const handleAirportSelect = (type: 'departure' | 'destination', airport: Airport) => {
    setFormData(prev => ({
      ...prev,
      [type]: airport.icao
    }))
    if (type === 'departure') {
      setOpenAirportSelect1(false)
    } else {
      setOpenAirportSelect(false)
    };
  }
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // try {
  //   //         const response = await fetch('/api/flights', {
  //   //           method:"Post"
  //   //         });
  //   //         if (!response.ok) throw new Error('Failed to fetch flights');
  //   //         const data = await response.json();
  //   //         setFlights(data.flights);
  //   //     } catch (error) {
  //   //         console.error('Failed to fetch flights:', error);
  //   //         toast({
  //   //             title: 'Error',
  //   //             description: 'Failed to fetch flights',
  //   //             variant: 'destructive'
  //   //         });
  //   //     } finally {
  //   //         setIsLoading(false);
  //   //     }
  //   // setIsSubmitting(true);
  //   // onLoad();

  //   try {
  //     // Format the date and time
  //     const dateTime = new Date(`${formData.date}T${formData.etd}`);

  //     // Generate flight plan
  //     const response = await fetch('https://demo.flyclim.com/api/create-fpl', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         flightNumber: formData.flightNumber,
  //         aircraft: formData.aircraft,
  //         speed: parseInt(formData.speed),
  //         altitude: parseInt(formData.altitude),
  //         fuel: parseFloat(formData.fuel),
  //         adep: formData.departure,
  //         ades: formData.destination,
  //         dep_time: dateTime.toISOString()
  //       })
  //     });

  //     if (!response.ok) throw new Error('Failed to generate flight plan');
  //     const data = await response.json();

  //     // Extract route from generated FPL
  //     const route = extractRouteFromFPL(data.fpl);
  //     if (!route) throw new Error('Failed to parse flight plan');

  //     // Get route visualization
  //     const routeResponse = await fetch('https://demo.flyclim.com/api/route', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ fpl: data.fpl })
  //     });

  //     if (!routeResponse.ok) throw new Error('Failed to visualize route');
  //     const routeData = await routeResponse.json();

  //     onVisualize?.(routeData, data.fpl);
  //     setShowRoutes(true);
  //   } catch (error) {
  //     console.error('FPL submission error:', error);
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to generate flight plan. Please try again.',
  //       variant: 'destructive'
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // onLoad();

    try {
      const dateTime = new Date(`${formData.date}T${formData.etd}`);

      const response = await fetch('https://demo.flyclim.com/api/create-fpl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightNumber: formData.flightNumber,
          aircraft: formData.aircraft,
          speed: parseInt(formData.speed),
          altitude: parseInt(formData.altitude),
          fuel: parseFloat(formData.fuel),
          adep: formData.departure,
          ades: formData.destination,
          dep_time: dateTime.toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to generate flight plan');
      const data = await response.json();

      const routeResponse = await fetch('https://demo.flyclim.com/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fpl: data.fpl })
      });

      if (!routeResponse.ok) throw new Error('Failed to visualize route');
      const routeData = await routeResponse.json();

      const storeResponse = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fpl: data.fpl,
          routeData
        })
      });

      if (!storeResponse.ok) {
        console.error('Failed to store flight data');
      }

      onVisualize?.(routeData, data.fpl);
      setShowRoutes(true);
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
    <Card className="w-full  bg-white shadow-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Flight Plan</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="New Plan" className="hidden sm:inline-flex">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Open Plan" className="hidden sm:inline-flex">
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Save Plan" className="hidden sm:inline-flex">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Share Plan" className="hidden sm:inline-flex">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onClose?.()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Flight Number</label>
          <Input
            value={formData.flightNumber}
            onChange={e => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
            placeholder="ABC123"
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Aircraft</label>
            <div className="flex items-center gap-2">
              <Popover open={openAircraftSelect} onOpenChange={setOpenAircraftSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAircraftSelect}
                    className="w-full justify-between font-mono"
                  >
                    {formData.aircraft || "Select aircraft..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search aircraft..." />
                    <CommandEmpty>No aircraft found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {aircraftTypes.map((aircraft) => (
                        <CommandItem
                          key={aircraft.icao_code}
                          value={aircraft.icao_code}
                          onSelect={() => handleAircraftSelect(aircraft)}
                        >
                          <Plane className="mr-2 h-4 w-4" />
                          <span>{aircraft.icao_code}</span>
                          <span className="ml-2 text-gray-500">
                            {aircraft.manufacturer} {aircraft.model}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" title="Edit Aircraft Profile">
                <Plane className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Speed</label>
            <Input
              value={formData.speed}
              onChange={e => setFormData(prev => ({ ...prev, speed: e.target.value }))}
              placeholder="110"
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Alt</label>
            <Input
              value={formData.altitude}
              onChange={e => setFormData(prev => ({ ...prev, altitude: e.target.value }))}
              placeholder="080"
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Fuel</label>
            <Input
              value={formData.fuel}
              onChange={e => setFormData(prev => ({ ...prev, fuel: e.target.value }))}
              placeholder="0"
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-sm text-gray-600">Departure</label>
            <Popover open={openAirportSelect1} onOpenChange={setOpenAirportSelect1}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAirportSelect}
                  className="w-full justify-between font-mono"
                >
                  {formData.departure || "Select a US airport..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search airports..." />
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {airports.map((airport) => (
                      <CommandItem
                        key={airport._id}
                        value={airport.icao}
                        onSelect={() => handleAirportSelect("departure", airport)}
                      >
                        <span>{airport.icao}</span>
                        <span className="ml-2 text-gray-500">
                          {airport.name}, {airport.city}, {airport.state}, {airport.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {/* <Input
              value={formData.departure}
              onChange={e => setFormData(prev => ({ ...prev, departure: e.target.value }))}
              placeholder="KJFK"
              className="font-mono"
            /> */}
          </div>
          <div>
            <label className="text-sm text-gray-600">Destination</label>
            <Popover open={openAirportSelect} onOpenChange={setOpenAirportSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAirportSelect}
                  className="w-full justify-between font-mono"
                >
                  {formData.destination || "Select a US airport..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search US airports..." />
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {airports.map((airport) => (
                      <CommandItem
                        key={airport._id}
                        value={airport.icao}
                        onSelect={() => handleAirportSelect("destination", airport)}
                      >
                        <span>{airport.icao}</span>
                        <span className="ml-2 text-gray-500">
                          {airport.name}, {airport.city}, {airport.state}, {airport.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {/* <Input
              value={formData.destination}
              onChange={e => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="KLAX"
              className="font-mono"
            /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">ETD (Zulu)</label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={formData.etd}
                onChange={e => setFormData(prev => ({ ...prev, etd: e.target.value }))}
                className="font-mono flex-1"
              />
              <Input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="font-mono flex-1"
              />
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">ETD (Local)</label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={formData.localTime}
                onChange={e => setFormData(prev => ({ ...prev, localTime: e.target.value }))}
                className="font-mono flex-1"
              />
              <Input
                type="date"
                value={formData.localDate}
                onChange={e => setFormData(prev => ({ ...prev, localDate: e.target.value }))}
                className="font-mono flex-1"
              />
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 border-t pt-4 gap-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-medium">Dist:</span>
              <span className="ml-2">2489.8</span>
            </div>
            <div>
              <span className="font-medium">ETE:</span>
              <span className="ml-2">6:57</span>
            </div>
            <div>
              <span className="font-medium">Burn:</span>
              <span className="ml-2">0.0</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => setShowRoutes(!showRoutes)}
          >
            Routes
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showRoutes ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {showRoutes && (
          <div className="border-t pt-4 space-y-2">
            {routes.map((route, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
              >
                <div className="font-mono text-xs mb-2 break-all">
                  {route.route}
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                  <div className="flex items-center gap-1">
                    {route.isEfficient && (
                      <span className="text-green-600">★ Most Efficient</span>
                    )}
                    {route.clearanceAge && (
                      <span>• Cleared {route.clearanceAge} days ago</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      <span className="font-medium">Dist:</span> {route.distance}
                    </span>
                    <span>
                      <span className="font-medium">ETE:</span> {route.time}
                    </span>
                    <span>
                      <span className="font-medium">Burn:</span> {route.fuelBurn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Processing...' : 'Submit Flight Plan'}
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            View Nav Log
          </Button>
        </div>
      </form>
    </Card>
  );
}