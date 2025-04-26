
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StaffMember, Service } from '@/types';
import { ServiceAlert } from './service/ServiceAlert';
import { ServiceEntry } from './service/ServiceEntry';
import { useServiceFieldsState } from '../../../hooks/dialog/useServiceFieldsState';

interface ServiceFieldsProps {
  formData: any;
  handleInputChange: (e: any) => void;
  visibleStaff: StaffMember[];
  services: Service[];
}

export const ServiceFields = ({
  formData,
  handleInputChange,
  visibleStaff,
  services
}: ServiceFieldsProps) => {
  const {
    serviceEntries,
    handleServiceEntryChange,
    addServiceEntry,
    removeServiceEntry
  } = useServiceFieldsState({
    formData,
    handleInputChange,
    services
  });

  const hasServices = services && services.length > 0;
  const hasStaff = visibleStaff && visibleStaff.length > 0;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="font-medium text-lg text-gray-800 mb-3 border-b pb-2">Servizi e Operatori</div>
      
      <ServiceAlert hasServices={hasServices} hasStaff={hasStaff} />
      
      {serviceEntries.map((entry, index) => (
        <ServiceEntry
          key={index}
          entry={entry}
          index={index}
          services={services}
          visibleStaff={visibleStaff}
          hasServices={hasServices}
          hasStaff={hasStaff}
          onServiceChange={handleServiceEntryChange}
          onRemove={removeServiceEntry}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full mt-2 flex items-center justify-center border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        onClick={addServiceEntry}
        disabled={!hasServices || !hasStaff}
      >
        <Plus className="w-4 h-4 mr-2 text-blue-600" />
        Aggiungi servizio
      </Button>
    </div>
  );
};
