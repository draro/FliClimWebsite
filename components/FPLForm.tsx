"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  FolderOpen,
  Save,
  Share2,
  Plane,
  Calendar,
  X,
  ChevronDown,
  Search,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FPLFormProps {
  onVisualize: (data: any, fpl: string) => void;
  onLoad: () => void;
  initialFPL?: string | null;
}

const FPL_TEMPLATES = {
  "KJFK-KLAX": {
    title: "New York (JFK) to Los Angeles (LAX)",
    fpl: `(FPL-N123AB-IS
-B738/M-SDFGHIRWY/S
-KJFK1200
-N0450F350 DCT GREKI J80 AIR J80 ABE J80 APE J80 EWC J80 ROD J80 GRB DCT
-KLAX0415 KLAS
-PBN/A1B1C1D1L1O1S2 NAV/RNVD1E2A1 DOF/230401 REG/N123AB
-E/0745 P/180 R/UVE S/M J/L D/C 8/YELLOW A/WHITE N/REMARKS
-C/SMITH)`,
  },
  "EGLL-EHAM": {
    title: "London (LHR) to Amsterdam (AMS)",
    fpl: `(FPL-BAW123-IS
-A320/M-SDFGHIRWY/S
-EGLL0900
-N0420F280 DVR UL9 KONAN UL607 RIVER
-EHAM0100 EHRD
-PBN/A1B1C1D1L1O1S2 NAV/RNVD1E2A1 DOF/230401 REG/GEUUU
-E/0200 P/150 R/UVE S/M J/L D/C 8/YELLOW A/WHITE N/REMARKS
-C/JONES)`,
  },
  "RJTT-RKSI": {
    title: "Tokyo (HND) to Seoul (ICN)",
    fpl: `(FPL-JL123-IS
-B773/H-SDFGHIRWY/S
-RJTT1100
-N0480F350 RULLE Y71 SAPRA Y51 AMORI Y51 ANYON
-RKSI0235 RKSS
-PBN/A1B1C1D1L1O1S2 NAV/RNVD1E2A1 DOF/230401 REG/JA123A
-E/0330 P/320 R/UVE S/M J/L D/C 8/YELLOW A/WHITE N/REMARKS
-C/TANAKA)`,
  },
};

export function FPLForm({ onVisualize, onLoad, initialFPL }: FPLFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fplString, setFplString] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("wss://demo.flyclim.com/ws/status");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (initialFPL) {
      setFplString(initialFPL);
    }
  }, [initialFPL]);

  const handleTemplateChange = (value: keyof typeof FPL_TEMPLATES) => {
    setSelectedTemplate(value);
    if (value && FPL_TEMPLATES[value]) {
      setFplString(FPL_TEMPLATES[value]?.fpl || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onLoad();

    try {
      // Submit FPL to backend
      const response = await fetch("https://demo.flyclim.com/api/store-fpl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fpl: fplString }),
      });

      if (!response.ok) throw new Error("Failed to submit flight plan");
      const data = await response.json();

      toast({
        title: "Success",
        description: "Flight plan submitted successfully",
      });

      // Fetch route data for visualization
      const routeResponse = await fetch("https://demo.flyclim.com/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fpl: fplString }),
      });

      if (!routeResponse.ok) throw new Error("Failed to fetch route data");
      const routeData = await routeResponse.json();

      onVisualize(routeData, fplString);
    } catch (error) {
      console.error("FPL submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit flight plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-[380px] md:w-[380px] bg-white shadow-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Flight Plan</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="New Plan">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Open Plan">
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Save Plan">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Share Plan">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Flight Plan Templates
            </div>
          </label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FPL_TEMPLATES).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            ICAO Flight Plan
          </label>
          <textarea
            value={fplString}
            onChange={(e) => setFplString(e.target.value)}
            className="w-full h-48 font-mono text-sm p-2 border rounded"
            placeholder="Enter ICAO format flight plan..."
            required
          />
        </div>

        {messages.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Status Updates</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {messages.map((msg, i) => (
                <div key={i} className="text-sm text-gray-600">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Processing..." : "Submit Flight Plan"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
