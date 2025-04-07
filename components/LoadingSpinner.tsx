'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  isVisible: boolean;
}

export function LoadingSpinner({ isVisible }: LoadingSpinnerProps) {
  const [messages] = useState<string[]>([
    'Analysing your FPL',
    'Detected storms mid-flight',
    'Recalculating the possible route'
  ]);
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isVisibleRef = useRef(isVisible);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket('wss://demo.flyclim.com/ws/status');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    ws.onmessage = (event) => {
      if (isVisibleRef.current) {
        setWsMessages(prev => [...prev, event.data]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      if (isVisibleRef.current) {
        setWsMessages(prev => [...prev, '🔌 Connection lost, reconnecting...']);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isVisibleRef.current && wsRef.current?.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (isVisibleRef.current) {
        setWsMessages(prev => [...prev, '❌ Connection error']);
      }
    };
  }, []);

  useEffect(() => {
    isVisibleRef.current = isVisible;

    if (isVisible) {
      setWsMessages([]); // Clear previous messages when loading starts
      connectWebSocket();
    } else {
      // Clean up WebSocket when loader is hidden
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }
  }, [isVisible, connectWebSocket]);

  useEffect(() => {
    // Set up ping interval when component mounts
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 25000);

    // Clean up on component unmount
    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md mx-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
            <div className="w-full space-y-4">
              <AnimatePresence mode="wait">
                {messages.map((message, index) => (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 2 }
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium text-gray-800 text-center"
                  >
                    {message}
                  </motion.p>
                ))}
              </AnimatePresence>

              {wsMessages.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    <AnimatePresence>
                      {wsMessages.map((message, index) => (
                        <motion.div
                          key={`${message}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="text-sm text-gray-600"
                        >
                          {message}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}