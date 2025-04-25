'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

export function WebSocketStatus() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://demo.flyclim.com/ws/status');

    ws.onopen = () => {
      setMessage('🟢 Connected to server.');
    };

    ws.onmessage = (event) => {
     if( !event.data.startsWith('{')){
        setMessage(event.data);
      } 
    };

    ws.onclose = () => {
      setMessage('🔌 Disconnected from server.');
    };

    ws.onerror = () => {
      setMessage('❌ WebSocket error.');
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-[300px] bg-black/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="text-sm">{message}</div>
    </Card>
  );
}