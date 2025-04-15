
import React from 'react';
import { cn } from '@/lib/utils';

interface StockIndicatorProps {
  quantity: number;
  threshold: number | undefined;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ quantity, threshold }) => {
  return (
    <div className="text-right">
      <span className={cn(
        "inline-block px-2 py-1 text-xs font-medium rounded-full",
        quantity <= 0 ? "bg-red-100 text-red-800" :
        quantity <= (threshold || 1) ? "bg-yellow-100 text-yellow-800" :
        "bg-green-100 text-green-800"
      )}>
        {quantity} pz.
      </span>
    </div>
  );
};
