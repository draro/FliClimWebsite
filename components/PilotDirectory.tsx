'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  Plane,
  Linkedin,
  Twitter,
  Globe,
  Instagram,
  Clock,
  Award
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Pilot {
  _id: string;
  firstName: string;
  lastName: string;
  airline: string;
  location: string;
  bio: string;
  profileImage?: string;
  publicProfile: {
    username: string;
    enabled: boolean;
    showFlightHours: boolean;
    showCertificates: boolean;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  employers?: Array<{
    name: string;
    position: string;
    current: boolean;
  }>;
  experience?: {
    totalFlightTime: string;
    totalFlights: number;
  };
  certificateCount?: number;
  createdAt: string;
}

export function PilotDirectory() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [filteredPilots, setFilteredPilots] = useState<Pilot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPilots();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pilots.filter(pilot =>
        pilot.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pilot.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pilot.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pilot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pilot.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPilots(filtered);
    } else {
      setFilteredPilots(pilots);
    }
  }, [searchTerm, pilots]);

  const fetchPilots = async () => {
    try {
      const response = await fetch('/api/pilots');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPilots(data.pilots);
      setFilteredPilots(data.pilots);
    } catch (error) {
      console.error('Failed to fetch pilots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pilot directory. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Pilot Directory</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover professional pilots in the FlyClim community. Connect with experienced aviators 
            and explore their expertise across different airlines and aircraft types.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search pilots by name, airline, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{filteredPilots.length}</div>
            <div className="text-gray-600">Active Pilots</div>
          </Card>
          <Card className="p-6 text-center">
            <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {new Set(filteredPilots.map(p => p.airline)).size}
            </div>
            <div className="text-gray-600">Airlines Represented</div>
          </Card>
          <Card className="p-6 text-center">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {new Set(filteredPilots.map(p => p.location.split(',')[1]?.trim() || p.location)).size}
            </div>
            <div className="text-gray-600">Countries</div>
          </Card>
        </motion.div>

        {/* Pilot Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPilots.map((pilot, index) => (
            <motion.div
              key={pilot._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + (index * 0.1) }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      {pilot.profileImage ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={pilot.profileImage}
                            alt={`${pilot.firstName} ${pilot.lastName}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                          {pilot.firstName[0]}{pilot.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {pilot.firstName} {pilot.lastName}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {pilot.airline}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{pilot.location}</span>
                    </div>
                    
                    {pilot.employers && pilot.employers.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">{pilot.employers[0].position}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Member since {format(new Date(pilot.createdAt), 'yyyy')}
                      </span>
                    </div>

                    {/* Flight Experience Summary */}
                    {pilot.experience && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Plane className="h-4 w-4" />
                        <span className="text-sm">
                          {pilot.experience.totalFlightTime} total • {pilot.experience.totalFlights} flights
                        </span>
                      </div>
                    )}

                    {/* Certificate Count */}
                    {pilot.certificateCount !== undefined && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-4 w-4" />
                        <span className="text-sm">
                          {pilot.certificateCount} certificate{pilot.certificateCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {pilot.bio}
                  </p>

                  {/* Social Links */}
                  {pilot.socialLinks && (
                    <div className="flex gap-2 mb-4">
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

                  <Link href={`/pilot/${pilot.publicProfile.username}`} passHref>
                    <Button 
                      className="w-full group-hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        // Check if on mobile and try deep link first
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                        if (isMobile) {
                          e.preventDefault();
                          const deepLinkUrl = `flyclim://pilot/${pilot.publicProfile.username}`;
                          window.location.href = deepLinkUrl;
                          
                          // Fallback to web after delay
                          setTimeout(() => {
                            window.location.href = `/pilot/${pilot.publicProfile.username}`;
                          }, 1000);
                        }
                      }}
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPilots.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pilots found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No pilots match your search for "${searchTerm}"`
                : "No public pilot profiles are currently available."
              }
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}