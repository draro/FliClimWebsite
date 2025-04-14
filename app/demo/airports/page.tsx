'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home, Map, PlaneTakeoff, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AirportRisk } from '@/components/AirportRisk';
import { cn } from '@/lib/utils';

export default function AirportsPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const menuItems = [
        { id: 'map', label: 'Interactive Map', icon: Map, href: '/demo' },
        { id: 'flights', label: 'Flight Plans', icon: PlaneTakeoff, href: '/demo/flights' },
        { id: 'airports', label: 'Airport Risk', icon: AlertTriangle, href: '/demo/airports' }
    ];

    return (
        <div className="relative h-screen flex">
            {/* Navigation Drawer */}
            <div className={cn(
                "h-screen bg-white border-r transition-all duration-300 flex flex-col",
                isDrawerOpen ? "w-64" : "w-16"
            )}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className={cn(
                        "font-semibold transition-all duration-300",
                        isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
                    )}>
                        FlyClim Demo
                    </h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    >
                        <ArrowLeft className={cn(
                            "h-4 w-4 transition-transform duration-300",
                            !isDrawerOpen && "rotate-180"
                        )} />
                    </Button>
                </div>

                <nav className="p-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                item.id === 'airports'
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className={cn(
                                "transition-all duration-300",
                                isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto p-4">
                    <Link href="/" className="block">
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            <Home className="h-4 w-4" />
                            <span className={cn(
                                "ml-2 transition-all duration-300",
                                isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
                            )}>
                                Back to Website
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50">
                <AirportRisk />
            </div>
        </div>
    );
}