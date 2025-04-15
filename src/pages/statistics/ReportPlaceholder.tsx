
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartIcon } from 'lucide-react';

interface ReportPlaceholderProps {
  title: string;
  description: string;
}

const ReportPlaceholder: React.FC<ReportPlaceholderProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <Card className="h-80">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-60">
          <div className="mb-4 p-4 rounded-full bg-gray-100">
            <ChartIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-center text-muted-foreground">
            Questa sezione è in fase di sviluppo.<br />
            Presto saranno disponibili i report dettagliati.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPlaceholder;
