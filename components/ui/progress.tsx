'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    // Ensure value is between 0 and max
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const percentage = (normalizedValue / max) * 100;

    // Get color based on value
    const getValueColor = (val: number) => {
      if (val >= 75) return '#dc2626'; // red-600
      if (val >= 50) return '#f97316'; // orange-500
      if (val >= 25) return '#eab308'; // yellow-500
      return '#22c55e'; // green-500
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-gray-100',
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(-${100 - percentage}%)`,
            backgroundColor: getValueColor(percentage)
          }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };