'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
declare global {
    interface Window {
        _hsp?: {
            push: (args: any[]) => void;
        };
    }
}
export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
        // Initialize HubSpot tracking
        if (window._hsp) {
            window._hsp.push(['showBanner']);
        }
    };

    const declineCookies = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setShowBanner(false);
        // Disable HubSpot tracking
        if (window._hsp) {
            window._hsp.push(['hideBanner']);
        }
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                >
                    <div className="flex items-start gap-4">
                        <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={declineCookies}
                                >
                                    Decline
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={acceptCookies}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}