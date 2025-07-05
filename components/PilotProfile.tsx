'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Briefcase, 
  Calendar,
  Mail,
  Clock,
  Award,
  Plane,
  ArrowLeft,
  Linkedin,
  Twitter,
  Globe,
  Instagram,
  Building,
  Timer,
  Target,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface PilotData {
  _id: string;
  firstName: string;
  lastName: string;
  airline: string;
  location: string;
  bio: string;
  profileImage?: string;
  email?: string;
  publicProfile: {
    username: string;
    enabled: boolean;
    showCertificates: boolean;
    showEmployment: boolean;
    showFlightHours: boolean;
    showContactInfo: boolean;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  employers?: Array<{
    id: string;
    name: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  certificates?: Array<{
    id: string;
    type: string;
    name: string;
    number?: string;
    issueDate: string;
    expiryDate?: string;
    authority: string;
    notes?: string;
  }>;
  experience?: {
    totalFlightTime: string;
    picTime: string;
    sicTime?: string;
    dualTime?: string;
    soloTime?: string;
    crossCountryTime?: string;
    nightTime?: string;
    instrumentTime?: string;
    simulatorTime?: string;
    dualGivenTime?: string;
    dualReceivedTime?: string;
    last30Days: number;
    totalFlights: number;
    dayLandings?: number;
    nightLandings?: number;
    visitedAirports?: string[];
    aircraftTypes?: string[];
  };
  createdAt: string;
}

interface PilotProfileProps {
  username: string;
}

export function PilotProfile({ username }: PilotProfileProps) {
  const [pilot, setPilot] = useState<PilotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPilot();
  }, [username]);

  const fetchPilot = async () => {
    try {
      const response = await fetch(`/api/pilots/${username}`);
      if (response.status === 404) {
        setNotFound(true);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPilot(data);
    } catch (error) {
      console.error('Failed to fetch pilot:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pilot profile. Please try again later.',
        variant: 'destructive',
      });
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'website':
        return <Globe className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) <= new Date();
  };

  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-48 mx-auto mb-2" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !pilot) {
    return (
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pilot Not Found</h1>
          <p className="text-gray-600 mb-8">
            The pilot profile you're looking for doesn't exist or is not publicly available.
          </p>
          <Link href="/pilot" passHref>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/pilot" passHref>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-24">
              <div className="text-center">
                {pilot.profileImage ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4">
                    <Image
                      src={pilot.profileImage}
                      alt={`${pilot.firstName} ${pilot.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                    {pilot.firstName[0]}{pilot.lastName[0]}
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {pilot.firstName} {pilot.lastName}
                </h1>
                
                <Badge variant="secondary" className="mb-4">
                  {pilot.airline}
                </Badge>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pilot.location}</span>
                  </div>
                  
                  {pilot.publicProfile.showFlightHours && pilot.experience && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{pilot.experience.totalFlightTime} total hours</span>
                    </div>
                  )}

                  {pilot.publicProfile.showContactInfo && pilot.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${pilot.email}`} className="text-sm hover:text-blue-600">
                        {pilot.email}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {format(new Date(pilot.createdAt), 'MMMM yyyy')}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {pilot.socialLinks && (
                  <div className="flex justify-center gap-3 mt-6 pt-6 border-t">
                    {Object.entries(pilot.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          {getSocialIcon(platform)}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Mobile App Link */}
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      if (isMobile) {
                        const deepLinkUrl = `flyclim://pilot/${pilot.publicProfile.username}`;
                        window.location.href = deepLinkUrl;
                      } else {
                        // Show download options for desktop users
                        window.open('https://apps.apple.com/app/flyclim/id123456789', '_blank');
                      }
                    }}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    View in FlyClim App
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Bio */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{pilot.bio}</p>
            </Card>

            {/* Flight Experience */}
            {pilot.publicProfile.showFlightHours && pilot.experience && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Flight Experience
                </h2>
                <div className="space-y-8">
                  {/* Primary Flight Time Stats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Flight Time Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Flight Time</span>
                      <span className="text-blue-600 font-bold text-lg">{pilot.experience.totalFlightTime}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">PIC Time</span>
                      <span className="text-green-600 font-bold">{pilot.experience.picTime}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Flights</span>
                      <span className="text-purple-600 font-bold">{pilot.experience.totalFlights.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Last 30 Days</span>
                      <span className="text-orange-600 font-bold">{pilot.experience.last30Days} hours</span>
                    </div>
                    </div>
                  </div>

                  {/* Detailed Flight Time Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Detailed Flight Time</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                    {pilot.experience.sicTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">SIC Time:</span>
                        <span className="font-medium">{pilot.experience.sicTime}</span>
                      </div>
                    )}
                    {pilot.experience.dualTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dual Time:</span>
                        <span className="font-medium">{pilot.experience.dualTime}</span>
                      </div>
                    )}
                    {pilot.experience.soloTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Solo Time:</span>
                        <span className="font-medium">{pilot.experience.soloTime}</span>
                      </div>
                    )}
                    {pilot.experience.crossCountryTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cross Country:</span>
                        <span className="font-medium">{pilot.experience.crossCountryTime}</span>
                      </div>
                    )}
                    {pilot.experience.nightTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Night Time:</span>
                        <span className="font-medium">{pilot.experience.nightTime}</span>
                      </div>
                    )}
                    {pilot.experience.instrumentTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instrument Time:</span>
                        <span className="font-medium">{pilot.experience.instrumentTime}</span>
                      </div>
                    )}
                    {pilot.experience.simulatorTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Simulator Time:</span>
                        <span className="font-medium">{pilot.experience.simulatorTime}</span>
                      </div>
                    )}
                    {pilot.experience.dualGivenTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dual Given:</span>
                        <span className="font-medium">{pilot.experience.dualGivenTime}</span>
                      </div>
                    )}
                    {pilot.experience.dualReceivedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dual Received:</span>
                        <span className="font-medium">{pilot.experience.dualReceivedTime}</span>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* Landings */}
                  {(pilot.experience.dayLandings !== undefined || pilot.experience.nightLandings !== undefined) && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Landings</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {pilot.experience.dayLandings !== undefined && (
                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <span className="text-gray-700 font-medium">Day Landings</span>
                            <span className="text-yellow-600 font-bold">{pilot.experience.dayLandings.toLocaleString()}</span>
                          </div>
                        )}
                        {pilot.experience.nightLandings !== undefined && (
                          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                            <span className="text-gray-700 font-medium">Night Landings</span>
                            <span className="text-indigo-600 font-bold">{pilot.experience.nightLandings.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Aircraft Types */}
                  {pilot.experience.aircraftTypes && pilot.experience.aircraftTypes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Aircraft Types Flown</h3>
                      <div className="flex flex-wrap gap-2">
                        {pilot.experience.aircraftTypes.map((aircraft, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {aircraft}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visited Airports */}
                  {pilot.experience.visitedAirports && pilot.experience.visitedAirports.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Airports Visited ({pilot.experience.visitedAirports.length})
                      </h3>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {pilot.experience.visitedAirports.map((airport, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {airport}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Employment History */}
            {pilot.publicProfile.showEmployment && pilot.employers && pilot.employers.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Employment History
                </h2>
                <div className="space-y-4">
                  {pilot.employers.map((employer) => (
                    <div key={employer.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">{employer.name}</h3>
                        {employer.current && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1 font-medium">{employer.position}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(employer.startDate)} - {employer.endDate ? formatDate(employer.endDate) : 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certificates */}
            {pilot.publicProfile.showCertificates && pilot.certificates && pilot.certificates.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificates & Licenses
                </h2>
                <div className="grid gap-4">
                  {pilot.certificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {cert.type}
                            </Badge>
                            {cert.expiryDate && (
                              <Badge 
                                variant={isExpired(cert.expiryDate) ? "destructive" : "default"}
                                className={isExpired(cert.expiryDate) ? "" : "bg-green-100 text-green-800"}
                              >
                                {isExpired(cert.expiryDate) ? 'Expired' : 'Valid'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Authority:</span>
                          <span className="font-medium">{cert.authority}</span>
                        </div>
                        
                        {cert.number && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Certificate #:</span>
                            <span className="font-medium font-mono">{cert.number}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issued:</span>
                          <span className="font-medium">{formatFullDate(cert.issueDate)}</span>
                        </div>
                        
                        {cert.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expires:</span>
                            <span className={`font-medium ${isExpired(cert.expiryDate) ? 'text-red-600' : ''}`}>
                              {formatFullDate(cert.expiryDate)}
                            </span>
                          </div>
                        )}
                        
                        {cert.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-gray-600 text-xs">Notes:</span>
                            <p className="text-gray-700 text-xs mt-1">{cert.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}