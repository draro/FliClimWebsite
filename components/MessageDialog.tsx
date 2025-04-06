'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface MessageDialogProps {
  messages: string[];
}

export function MessageDialog({ messages }: MessageDialogProps) {
  return (
    <Card className="fixed bottom-4 right-4 w-[300px] max-h-[300px] bg-black text-white p-4 rounded-lg">
      <ScrollArea className="h-full">
        {messages.map((message, index) => (
          <div key={index} className="text-sm mb-1">
            {message}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}