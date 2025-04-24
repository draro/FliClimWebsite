import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        // Start ping interval when connected
        pingIntervalRef.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send("ping");
          }
        }, 15000); // Send ping every 15 seconds
      };

      ws.current.onmessage = (event) => {
        if (event.data !== "pong") {
          // Ignore pong responses
          setMessages((prev) => [...prev, event.data]);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Attempt to reconnect after 2 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Close connection on error to trigger reconnect
        ws.current?.close();
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      // Attempt to reconnect after error
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 2000);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      // Clean up on unmount
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url]);

  return { isConnected, messages, setMessages };
}
