
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  valueClassName?: string;
  bgColor?: string;
  iconClassName?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  valueClassName = '',
  bgColor = 'bg-white',
  iconClassName = 'bg-primary-50',
}) => {
  return (
    <Card className={bgColor}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className={`text-2xl font-bold ${valueClassName}`}>{value}</h3>
          </div>
          <div className={`h-12 w-12 rounded-lg ${iconClassName} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
