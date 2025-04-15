
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { CreditPackage } from '../types';

interface CreditPackageCardProps {
  package: CreditPackage;
  isSelected: boolean;
  onSelect: () => void;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({
  package: pkg,
  isSelected,
  onSelect
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all overflow-hidden relative",
        isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      {pkg.discount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{pkg.discount}%
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{pkg.description}</p>
            <div className="text-lg font-semibold mt-2">
              € {pkg.price.toFixed(2)}
              {pkg.discount && (
                <span className="text-sm line-through text-muted-foreground ml-2">
                  € {((pkg.price * 100) / (100 - pkg.discount)).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {isSelected && (
            <CheckCircle className="h-6 w-6 text-primary" />
          )}
        </div>
        
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <span>{pkg.credits} {pkg.type === 'email' ? 'email' : pkg.type === 'sms' ? 'SMS' : 'messaggi'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <span>Tracciamento avanzato</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <span>Validi per 12 mesi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditPackageCard;
