
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubscriptionCardProps {
  type: 'primary' | 'secondary';
  title: string;
  subtitle: string;
  activationDate: string;
  available?: string;
  className?: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  type, 
  title, 
  subtitle,
  activationDate,
  available,
  className 
}) => {
  if (type === 'primary') {
    return (
      <Card className={`bg-blue-500 text-white ${className}`}>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium opacity-80">{subtitle}</p>
            <h4 className="text-2xl font-bold mt-1">{title}</h4>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium opacity-80">ATTIVAZIONE</p>
            <p className="text-lg font-semibold">{activationDate}</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-green-400 hover:bg-green-500 text-white border-none rounded-full">
            ATTIVO
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#E5DEFF"/>
              <path d="M6 12L10 16L18 8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <h4 className="text-lg font-semibold">{title}</h4>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">ATTIVAZIONE</p>
          <p className="font-medium">{activationDate}</p>
        </div>
        {available && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">DISPONIBILI</p>
            <p className="font-medium">{available}</p>
          </div>
        )}
        <Button variant="secondary" size="sm" className="bg-green-400 hover:bg-green-500 text-white border-none rounded-full">
          ATTIVO
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
