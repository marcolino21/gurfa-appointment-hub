
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ServiceAlertProps {
  hasServices: boolean;
  hasStaff: boolean;
}

export const ServiceAlert = ({ hasServices, hasStaff }: ServiceAlertProps) => {
  if (hasServices && hasStaff) return null;
  
  return (
    <Alert 
      variant="default" 
      className="mb-4 bg-amber-50 border-amber-200 text-amber-700"
    >
      <AlertCircle className="h-4 w-4 text-amber-700" />
      <AlertDescription>
        {!hasServices && "Nessun servizio disponibile. Aggiungi servizi dalla sezione Servizi."}
        {!hasStaff && hasServices && "Nessuno staff visibile. Aggiungi operatori dalla sezione Staff."}
      </AlertDescription>
    </Alert>
  );
};
