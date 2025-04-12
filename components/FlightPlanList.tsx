'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { FPLForm } from './FPLForm';
import { Dialog, DialogContent } from './ui/dialog';

interface Flight {
    _id: string;
    fpl: string;
    adep: string;
    ades: string;
    dep_time: string;
    arr_time: string;
    eet_minutes: number;
    fuel_burn_kg: number;
    aircraft_type: string;
    status?: 'active' | 'completed' | 'scheduled';
    risk_level?: 'low' | 'medium' | 'high';
}

export interface FlightPlanListProps {
    onViewFlight: (fpl: string) => void;
    onAddFlight: (() => void) | null;
    risk_factors: any;
}

export function FlightPlanList({ onViewFlight, onAddFlight, risk_factors }: FlightPlanListProps) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFPLForm, setShowFPLForm] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await fetch('/api/flights');
            if (!response.ok) throw new Error('Failed to fetch flights');
            const data = await response.json();
            setFlights(data.flights);
        } catch (error) {
            console.error('Failed to fetch flights:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch flights',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'scheduled':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRiskBadge = (risk?: string) => {
        switch (risk) {
            case 'high':
                return (
                    <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-medium">High Risk</span>
                    </div>
                );
            case 'medium':
                return (
                    <div className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-medium">Medium Risk</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Flight Plans</h2>
                <Button onClick={onAddFlight ? onAddFlight : () => { setShowFPLForm(true) }} variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Flight Plan
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {flights.map((flight) => (
                        <Card key={flight._id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">
                                                {flight.adep} → {flight.ades}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(flight.status)}`}>
                                                {flight.status || 'Pending'}
                                            </span>
                                        </div>
                                        {getRiskBadge(risk_factors?.risk_level ? risk_factors?.risk_level : null)}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div>
                                            <p className="font-medium">Departure</p>
                                            <p>{flight.dep_time}</p>
                                            {/* <p>{format(new Date(flight.dep_time), 'HH:mm UTC')}</p> */}
                                        </div>
                                        <div>
                                            <p className="font-medium">Arrival</p>
                                            {/* <p>{format(new Date(flight.arr_time), 'HH:mm UTC')}</p> */}
                                            <p>{flight.arr_time}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Flight Time</p>
                                            <p>{Math.floor(flight.eet_minutes / 60)}h {flight.eet_minutes % 60}m</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Aircraft</p>
                                            <p>{flight.aircraft_type}</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => onViewFlight(flight.fpl)}
                                    className="ml-4"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Route
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {flights.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No flight plans found. Click &quot;Add Flight Plan&quot; to create one.
                        </div>
                    )}
                </div>
            )}
            {showFPLForm &&
                <Dialog open={showFPLForm} onOpenChange={setShowFPLForm}>
                    <DialogContent className='max-w-3xl'>
                        <FPLForm onClose={() => setShowFPLForm(false)} onVisualize={fetchFlights} />
                    </DialogContent>
                </Dialog>
            }
        </div>
    );
}