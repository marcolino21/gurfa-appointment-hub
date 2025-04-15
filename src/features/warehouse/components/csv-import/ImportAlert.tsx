
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ImportAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Assicurati che il file CSV sia nel formato corretto. Scarica il{' '}
        <a href="#" className="text-blue-500 underline">
          template
        </a>
        .
      </AlertDescription>
    </Alert>
  );
};
