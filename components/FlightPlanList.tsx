"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/lib/websocket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  status?: "active" | "completed" | "scheduled";
  storm_detected?: boolean;
  collisions?: Array<{
    segment_index: number;
    segment_label: string;
    from_coord: [number, number];
    to_coord: [number, number];
    timestamp: string;
    distance_km: number;
  }>;
}

interface FlightPlanListProps {
  onViewFlight: (fpl: string) => void;
  onAddFlight: () => void;
  risk_factors?: {
    storm_detected: boolean;
    extra_time_minutes: number;
    risk_score: number;
    risk_level: string;
    risk_factors: string[];
    fpl_string: string;
  };
}

export function FlightPlanList({
  onViewFlight,
  onAddFlight,
}: FlightPlanListProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCollisionDialog, setShowCollisionDialog] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const { messages } = useWebSocket("wss://demo.flyclim.com/ws/status");
  const { toast } = useToast();

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    // Update flights when receiving WebSocket messages
    if (messages.length > 0) {
      try {
        const latestMessage = messages[messages.length - 1];
        // Try to parse the message as JSON
        const data = JSON.parse(latestMessage);
        if (data._id) {
          // Update the specific flight in the list
          setFlights((prev) =>
            prev.map((flight) =>
              flight._id === data._id ? { ...flight, ...data } : flight
            )
          );

          // Show toast for storm detection
          if (data.storm_detected) {
            toast({
              title: "Storm Warning",
              description: "Storm detected along flight path",
              variant: "destructive",
            });
          }
        }
      } catch (e) {
        console.log("WebSocket message:", messages[messages.length - 1]);
      }
    }
  }, [messages, toast]);

  const fetchFlights = async () => {
    try {
      const response = await fetch("/api/flights");
      if (!response.ok) throw new Error("Failed to fetch flights");
      const data = await response.json();
      setFlights(data.flights);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      toast({
        title: "Error",
        description: "Failed to fetch flights",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCollisions = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowCollisionDialog(true);
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy HH:mm");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Flight Plans</h2>
        <Button onClick={onAddFlight}>
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
            <Card
              key={flight._id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">
                      {flight.adep} → {flight.ades}
                    </h3>
                    {flight.storm_detected && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleShowCollisions(flight)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Storm Warning
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Departure</p>
                      <p>{formatDateTime(flight.dep_time)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Arrival</p>
                      <p>{formatDateTime(flight.arr_time)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Flight Time</p>
                      <p>
                        {Math.floor(flight.eet_minutes / 60)}h{" "}
                        {flight.eet_minutes % 60}m
                      </p>
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
              No flight plans found. Click &quot;Add Flight Plan&quot; to create
              one.
            </div>
          )}
        </div>
      )}

      <Dialog open={showCollisionDialog} onOpenChange={setShowCollisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Storm Collision Details</DialogTitle>
            <DialogDescription>
              The following route segments have potential storm collisions:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedFlight?.collisions?.map((collision, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg">
                <div className="font-medium text-red-700 mb-2">
                  Segment: {collision.segment_label}
                </div>
                <div className="text-sm text-red-600 space-y-1">
                  <p>Time: {format(new Date(collision.timestamp), "PPp")}</p>
                  <p>Distance: {collision.distance_km.toFixed(1)} km</p>
                  <p>
                    Coordinates: [{collision.from_coord.join(", ")}] → [
                    {collision.to_coord.join(", ")}]
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
