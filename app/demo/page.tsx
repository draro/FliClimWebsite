"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Map,
  PlaneTakeoff,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DemoContactForm } from "@/components/DemoContactForm";
import { AirportRisk } from "@/components/AirportRisk";

const CesiumViewer = dynamic(() => import("@/components/CesiumViewer"), {
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Cesium viewer...</p>
      </div>
    </div>
  ),
  ssr: false,
});

type MenuItem = "map" | "flights" | "airports";

export default function DemoPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>("map");
  const [showContactForm, setShowContactForm] = useState(true);

  useEffect(() => {
    // Check if user has already submitted the form
    const hasSubmittedForm = localStorage.getItem("demoFormSubmitted");
    if (hasSubmittedForm === "true") {
      setShowContactForm(false);
    }
  }, []);

  const menuItems = [
    { id: "map", label: "Interactive Map", icon: Map, href: "/demo" },
    {
      id: "flights",
      label: "Flight Plans",
      icon: PlaneTakeoff,
      href: "/demo/flights",
    },
    {
      id: "airports",
      label: "Airport Risk",
      icon: AlertTriangle,
      href: "/demo/airports",
    },
  ];

  const handleFormSubmit = () => {
    // Store submission state in localStorage
    localStorage.setItem("demoFormSubmitted", "true");
    setShowContactForm(false);
  };

  const handleMenuClick = (menuId: MenuItem, e: React.MouseEvent) => {
    if (menuId === "airports") {
      e.preventDefault();
      setActiveMenuItem(menuId);
    }
  };

  return (
    <div className="relative h-screen flex overlow-hidden">
      {/* Navigation Drawer */}
      <div
        className={cn(
          "h-screen bg-white border-r transition-all duration-300 flex flex-col",
          isDrawerOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1
            className={cn(
              "font-semibold transition-all duration-300",
              isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            FlyClim Demo
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <ArrowLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                !isDrawerOpen && "rotate-180"
              )}
            />
          </Button>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                activeMenuItem === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              )}
              onClick={(e) => handleMenuClick(item.id as MenuItem, e)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "transition-all duration-300",
                  isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4" />
              <span
                className={cn(
                  "ml-2 transition-all duration-300",
                  isDrawerOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                Back to Website
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {activeMenuItem === "map" && <CesiumViewer />}
        {activeMenuItem === "airports" && <AirportRisk />}

        {/* Contact Form Overlay */}
        {showContactForm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="max-w-xl w-full mx-4">
              <DemoContactForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
