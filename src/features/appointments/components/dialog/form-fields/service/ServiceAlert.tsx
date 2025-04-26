
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
        {!hasServices && "Nessun servizio disponibile. Per una migliore esperienza, aggiungi servizi dalla sezione Servizi. Per ora puoi usare un servizio dimostrativo."}
        {!hasStaff && hasServices && "Nessuno staff visibile. Per una migliore esperienza, aggiungi operatori dalla sezione Staff. Per ora puoi usare un operatore dimostrativo."}
      </AlertDescription>
    </Alert>
  );
};
