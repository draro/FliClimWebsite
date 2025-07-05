'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smartphone, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PilotDeepLinkProps {
  username: string;
}

export function PilotDeepLink({ username }: PilotDeepLinkProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      setIsMobile(isMobileDevice);
      
      // Only show banner on mobile devices
      if (isMobileDevice) {
        // Check if user has dismissed the banner before
        const dismissed = localStorage.getItem('pilot-app-banner-dismissed');
        if (!dismissed) {
          setShowBanner(true);
        }
      }
    };

    checkMobile();
  }, []);

  const handleOpenInApp = () => {
    const deepLinkUrl = `flyclim://pilot/${username}`;
    const fallbackUrl = 'https://apps.apple.com/app/flyclim/id123456789'; // Replace with actual App Store URL
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.flyclim.app'; // Replace with actual Play Store URL
    
    // Try to open the app
    window.location.href = deepLinkUrl;
    
    // Fallback to app store after a delay if app doesn't open
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        window.location.href = fallbackUrl;
      } else if (isAndroid) {
        window.location.href = playStoreUrl;
      }
    }, 2000);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pilot-app-banner-dismissed', 'true');
  };

  if (!isMobile || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-40 p-4"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-white/20 rounded-full">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Better experience in our app</h3>
                  <p className="text-xs text-blue-100">View pilot profiles with enhanced features</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleOpenInApp}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}