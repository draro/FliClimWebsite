'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketStatus } from '@/components/WebSocketStatus';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FlightPlanList } from '@/components/FlightPlanList';
import type { LineString } from 'geojson';

declare global {
  interface Window {
    Cesium: any;
  }
}

interface RouteResponse {
  type: string;
  features: any[];
  original_route?: {
    type: "Feature";
    geometry: LineString;
  };
  properties?: {
    storm_detected: boolean;
    extra_time_minutes: number;
    risk_score: number;
    risk_level: string;
    risk_factors: string[];
    fpl_string: string;
  };
}

interface AirportRisk {
  icao: string;
  airport: {
    lat: number;
    lon: number;
    elevation: number;
  };
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
    humidity_risk: number;
    visibility_risk: number;
    total_risk: number;
    risk_classification: string;
  };
  flight_delay: {
    delay_probability: string;
    delay_risk: string;
  };
}

type Coordinate = [number, number];

interface SafePoint {
  coordinates: number[];
  time: Date;
  style: Record<string, any>;
  properties: Record<string, any>;
}

export default function CesiumViewer() {
  const viewerRef = useRef<any>(null);
  const stormCache = useRef<Record<string, any>>({});
  const currentStormLayer = useRef<any[]>([]);
  const lastTimeBucket = useRef<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFlightList, setShowFlightList] = useState(true);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [showAirportRisk, setShowAirportRisk] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<AirportRisk | null>(null);
  const [isLoadingAirport, setIsLoadingAirport] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const viewer = new window.Cesium.Viewer('cesiumContainer', {
      timeline: true,
      animation: true,
      baseLayerPicker: false,
      baseLayer: window.Cesium.ImageryLayer.fromProviderAsync(
        window.Cesium.ArcGisMapServerImageryProvider.fromBasemapType(
          window.Cesium.ArcGisBaseMapType.SATELLITE
        )
      ),
    });

    viewer.clock.clockRange = window.Cesium.ClockRange.CLAMPED;
    viewer.clock.clockStep = window.Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    viewer.clock.multiplier = 30;

    window.Cesium.Model.fromGltfAsync({
      url: '/models/Cesium_Air.glb',
      scale: 1.0
    }).catch((error: any) => {
      console.warn('Failed to preload aircraft model:', error);
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  const fetchAirportRisk = async (icao: string) => {
    try {
      setIsLoadingAirport(true);
      const response = await fetch(`https://demo.flyclim.com/api/airport_risk/${icao}`);
      if (!response.ok) throw new Error('Failed to fetch airport risk data');
      const data = await response.json();
      setSelectedAirport(data);
      setShowAirportRisk(true);
    } catch (error) {
      console.error('Error fetching airport risk:', error);
    } finally {
      setIsLoadingAirport(false);
    }
  };

  const safeFromDegrees = (lon: number, lat: number, alt = 0) => {
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
      console.warn('❌ Invalid coord:', lon, lat);
      return null;
    }
    return window.Cesium.Cartesian3.fromDegrees(lon, lat, alt);
  };

  const roundTo5Minutes = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('❌ Invalid date provided to roundTo5Minutes:', date);
      return new Date().toISOString();
    }

    const roundedTime = Math.floor(date.getTime() / (5 * 60 * 1000)) * 5 * 60 * 1000;
    return new Date(roundedTime).toISOString();
  };

  const clearStormCache = () => {
    stormCache.current = {};
    lastTimeBucket.current = '';
    if (currentStormLayer.current.length > 0 && viewerRef.current) {
      currentStormLayer.current.forEach(entity => {
        viewerRef.current.entities.remove(entity);
      });
      currentStormLayer.current = [];
    }
  };

  const fetchStormGeoJSON = async (isoTime: string) => {
    if (stormCache.current[isoTime]) return stormCache.current[isoTime];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      const res = await fetch(`https://demo.flyclim.com/api/storms?from_time=${isoTime}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const geojson = await res.json();
      if (!geojson.features || geojson.features.length === 0) return null;
      stormCache.current[isoTime] = geojson;
      return geojson;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn('Storm fetch timed out after 3 minutes');
      } else {
        console.warn('Storm fetch failed:', err);
      }
      return null;
    }
  };

  const updateStormLayer = useCallback(async (currentTime: Date) => {
    const bucket = roundTo5Minutes(currentTime);
    if (bucket === lastTimeBucket.current) return;
    lastTimeBucket.current = bucket;

    const geojson = await fetchStormGeoJSON(bucket);
    if (!geojson) return;

    if (currentStormLayer.current.length > 0) {
      currentStormLayer.current.forEach(entity => {
        viewerRef.current.entities.remove(entity);
      });
      currentStormLayer.current = [];
    }

    for (const feature of geojson.features) {
      if (feature.geometry.type === 'Polygon') {
        const coordinates = feature.geometry.coordinates[0] as Coordinate[];
        const baseHeight = 600;
        const topHeight = Math.random() * (12000 - 9500) + 9500;

        for (let i = 0; i < coordinates.length - 1; i++) {
          const [lon1, lat1] = coordinates[i];
          const [lon2, lat2] = coordinates[i + 1];

          const wall = viewerRef.current.entities.add({
            wall: {
              positions: window.Cesium.Cartesian3.fromDegreesArrayHeights([
                lon1, lat1, baseHeight,
                lon2, lat2, baseHeight,
                lon2, lat2, topHeight,
                lon1, lat1, topHeight,
                lon1, lat1, baseHeight
              ]),
              material: window.Cesium.Color.RED.withAlpha(0.3),
              outline: true,
              outlineColor: window.Cesium.Color.RED,
              outlineWidth: 1
            }
          });
          currentStormLayer.current.push(wall);
        }

        const positions = coordinates.map(([lon, lat]: Coordinate) =>
          window.Cesium.Cartesian3.fromDegrees(lon, lat, topHeight)
        );
        const bottomPositions = coordinates.map(([lon, lat]: Coordinate) =>
          window.Cesium.Cartesian3.fromDegrees(lon, lat, baseHeight)
        );

        const topPolygon = viewerRef.current.entities.add({
          polygon: {
            hierarchy: new window.Cesium.PolygonHierarchy(positions),
            material: window.Cesium.Color.RED.withAlpha(0.3),
            outline: true,
            outlineColor: window.Cesium.Color.RED,
            outlineWidth: 1
          }
        });
        currentStormLayer.current.push(topPolygon);

        const bottomPolygon = viewerRef.current.entities.add({
          polygon: {
            hierarchy: new window.Cesium.PolygonHierarchy(bottomPositions),
            material: window.Cesium.Color.RED.withAlpha(0.3),
            outline: true,
            outlineColor: window.Cesium.Color.RED,
            outlineWidth: 1
          }
        });
        currentStormLayer.current.push(bottomPolygon);
      }
    }
  }, []);

  const parseFPLTime = (fpl: string): Date | null => {
    try {
      const dofMatch = fpl.match(/DOF\/(\d{6})/);
      const timeMatch = fpl.match(/-([A-Z]{4})(\d{4})/);

      if (!timeMatch) return null;

      const time = timeMatch[2];
      const hours = parseInt(time.slice(0, 2));
      const minutes = parseInt(time.slice(2));

      let departureDate: Date;

      if (dofMatch) {
        const dof = dofMatch[1];
        const year = 2000 + parseInt(dof.slice(0, 2));
        const month = parseInt(dof.slice(2, 4)) - 1;
        const day = parseInt(dof.slice(4, 6));

        departureDate = new Date(Date.UTC(year, month, day, hours, minutes));
      } else {
        departureDate = new Date();
        departureDate.setUTCHours(hours, minutes, 0, 0);

        if (departureDate < new Date()) {
          departureDate.setUTCDate(departureDate.getUTCDate() + 1);
        }
      }

      return departureDate;
    } catch (err) {
      console.warn('Failed to parse FPL time:', err);
      return null;
    }
  };

  const createBillboard = (position: any, style: any, properties: any) => {
    const viewer = viewerRef.current;

    const fallbackPoint = {
      position,
      label: {
        text: properties.popup || '',
        font: '14px sans-serif',
        style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new window.Cesium.Cartesian2(0, -10)
      }
    };

    if (!style.iconUrl) {
      return viewer.entities.add(fallbackPoint);
    }

    const img = new Image();
    img.onerror = () => {
      console.warn(`Failed to load billboard image: ${style.iconUrl}`);
      viewer.entities.add(fallbackPoint);
    };
    img.onload = () => {
      viewer.entities.add({
        position,
        billboard: {
          image: style.iconUrl,
          width: style.iconSize?.[0] || 28,
          height: style.iconSize?.[1] || 28,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM
        },
        label: {
          text: properties.popup || '',
          font: '14px sans-serif',
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -40)
        }
      });
    };
    img.src = style.iconUrl;
  };

  const handleViewFlight = async (fpl: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://demo.flyclim.com/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fpl })
      });

      if (!response.ok) {
        throw new Error('Failed to visualize route');
      }

      const data = await response.json();
      visualizeRoute(data, fpl);
      setShowFlightList(false);
    } catch (error) {
      console.error('Failed to visualize flight:', error);
    } finally {
      setIsLoading(false);
    }
  };
  function isLineString(type: any): type is LineString {
    return type === "LineString";
  }
  const visualizeRoute = async (data: RouteResponse, fpl: string) => {
    try {
      if (!data || data.type !== 'FeatureCollection' || !data.features.length) {
        alert('⚠️ Invalid GeoJSON route received.');
        return;
      }

      setRouteData(data);
      clearStormCache();

      const viewer = viewerRef.current;
      viewer.dataSources.removeAll();
      viewer.entities.removeAll();

      // If original route exists, display it first
      if (isLineString(data.original_route?.geometry.type)) {
        const originalPositions = data.original_route.geometry.coordinates
          .map(([lon, lat]) => safeFromDegrees(lon, lat, 10600))
          .filter(p => p);

        viewer.entities.add({
          polyline: {
            positions: originalPositions,
            width: 3,
            material: window.Cesium.Color.ORANGE.withAlpha(0.5),
            clampToGround: true
          }
        });
      }

      const departureTime = parseFPLTime(fpl) || new Date();
      const startJulian = window.Cesium.JulianDate.fromDate(departureTime);

      const safePoints = data.features
        .filter(f => f.geometry.type === 'Point')
        .map(f => ({
          coordinates: f.geometry.coordinates,
          time: f.properties.time ? new Date(f.properties.time) : null,
          style: f.properties.style || {},
          properties: f.properties
        }))
        .filter((p): p is SafePoint => p.time !== null)
        .sort((a, b) => a.time.getTime() - b.time.getTime());

      // Extract ADEP and ADES from FPL
      const adepMatch = fpl.match(/-([A-Z]{4})\d{4}/);
      const adesMatch = fpl.match(/-([A-Z]{4})\d{4}$/);

      if (adepMatch && adesMatch) {
        const adep = adepMatch[1];
        const ades = adesMatch[1];

        // Create clickable entities for airports
        safePoints.forEach((point, index) => {
          if (index === 0 || index === safePoints.length - 1) {
            const icao = index === 0 ? adep : ades;
            const position = safeFromDegrees(point.coordinates[0], point.coordinates[1], 0);
            if (position) {
              viewer.entities.add({
                position,
                billboard: {
                  image: '/airport-icon.png',
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  scale: 0.5
                },
                label: {
                  text: icao,
                  font: '14px sans-serif',
                  style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new window.Cesium.Cartesian2(0, -40)
                }
              });

              // Add click handler
              viewer.screenSpaceEventHandler.setInputAction(async (click: any) => {
                const pickedObject = viewer.scene.pick(click.position);
                if (window.Cesium.defined(pickedObject)) {
                  const entity = pickedObject.id;
                  if (entity.label && entity.label.text._value === icao) {
                    await fetchAirportRisk(icao);
                  }
                }
              }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
          }
        });
      }

      const property = new window.Cesium.SampledPositionProperty();

      safePoints.forEach((point, index) => {
        const [lon, lat] = point.coordinates;
        const position = safeFromDegrees(lon, lat, 10600);

        if (position) {
          if (index !== 0 && index !== safePoints.length - 1) {
            createBillboard(position, point.style, point.properties);
          }
          const julianDate = window.Cesium.JulianDate.fromDate(point.time);
          property.addSample(julianDate, position);
        }
      });

      const stopJulian = window.Cesium.JulianDate.fromDate(safePoints[safePoints.length - 1].time);

      viewer.clock.startTime = startJulian.clone();
      viewer.clock.currentTime = startJulian.clone();
      viewer.clock.stopTime = stopJulian.clone();
      viewer.clock.clockRange = window.Cesium.ClockRange.LOOP_STOP;
      viewer.clock.clockStep = window.Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      viewer.clock.multiplier = 30;

      const positions = safePoints
        .map(p => safeFromDegrees(p.coordinates[0], p.coordinates[1], 10600))
        .filter(p => p);

      viewer.entities.add({
        polyline: {
          positions,
          width: 3,
          material: window.Cesium.Color.CYAN
        }
      });

      try {
        const aircraft = viewer.entities.add({
          availability: new window.Cesium.TimeIntervalCollection([
            new window.Cesium.TimeInterval({ start: startJulian, stop: stopJulian })
          ]),
          position: property,
          orientation: new window.Cesium.VelocityOrientationProperty(property),
          model: {
            uri: '/models/Cesium_Air.glb',
            minimumPixelSize: 64,
            maximumScale: 10000
          },
          path: {
            resolution: 1,
            material: window.Cesium.Color.YELLOW,
            width: 2
          }
        });

        viewer.trackedEntity = aircraft;
      } catch (modelError) {
        console.error('Failed to load aircraft model:', modelError);
        const aircraft = viewer.entities.add({
          availability: new window.Cesium.TimeIntervalCollection([
            new window.Cesium.TimeInterval({ start: startJulian, stop: stopJulian })
          ]),
          position: property,
          point: {
            pixelSize: 10,
            color: window.Cesium.Color.YELLOW
          },
          path: {
            resolution: 1,
            material: window.Cesium.Color.YELLOW,
            width: 2
          }
        });

        viewer.trackedEntity = aircraft;
      }

      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(
          safePoints[0].coordinates[0],
          safePoints[0].coordinates[1],
          50000
        ),
        orientation: {
          heading: window.Cesium.Math.toRadians(0),
          pitch: window.Cesium.Math.toRadians(-45),
          roll: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!viewerRef.current) return;

    viewerRef.current.clock.onTick.addEventListener(() => {
      const now = window.Cesium.JulianDate.toDate(viewerRef.current.clock.currentTime);
      updateStormLayer(now);
    });
  }, [updateStormLayer]);

  return (
    <div className="relative w-full h-screen">
      <div id="cesiumContainer" className="absolute inset-0" />

      {/* Flight List Panel */}
      <div className={`absolute top-4 left-20 transition-transform duration-300 `}>
        <div className={`w-[400px] bg-white/95 backdrop-blur-sm shadow-lg rounded-lg ${!showFlightList && 'hidden m-20'}`}>
          <FlightPlanList
            onViewFlight={handleViewFlight}
            onAddFlight={null}
            risk_factors={routeData?.properties}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute -right-10 top-0 bg-white/95"
          onClick={() => setShowFlightList(!showFlightList)}
        >
          {showFlightList ? <ChevronLeft className="h-4 w-4" /> : "Flight Plans"}
        </Button>
      </div>

      <WebSocketStatus />
      <LoadingSpinner isVisible={isLoading || isLoadingAirport} />

      {/* Risk Analysis Sheet */}
      {routeData?.properties?.risk_factors && (
        <Sheet>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Flight Risk Analysis
              </SheetTitle>
              <SheetDescription>
                <div className="mt-4 space-y-4">
                  {routeData.properties.risk_factors?.map((risk: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-left"
                    >
                      <span className="text-red-500">{risk}</span>
                    </div>
                  ))}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}