
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
  // Create a default service if none are available
  const allServices = services && services.length > 0 ? services : [
    { 
      id: 'default-service-1',
      name: 'Servizio Generico',
      category: 'default',
      description: 'Servizio predefinito',
      duration: 30,
      tempoDiPosa: 0,
      price: 30,
      color: '#9b87f5',
      salonId: 'default',
      assignedServiceIds: []
    }
  ];
  
  // Ensure there's at least one staff member if none are available
  const allStaff = visibleStaff && visibleStaff.length > 0 ? visibleStaff : [
    {
      id: 'default-staff-1',
      firstName: 'Operatore',
      lastName: 'Predefinito',
      email: 'operatore@esempio.it',
      isActive: true,
      showInCalendar: true,
      salonId: 'default'
    }
  ];

  const {
    serviceEntries,
    handleServiceEntryChange,
    addServiceEntry,
    removeServiceEntry
  } = useServiceFieldsState({
    formData,
    handleInputChange,
    services: allServices
  });

  const hasServices = allServices.length > 0;
  const hasStaff = allStaff.length > 0;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="font-medium text-lg text-gray-800 mb-3 border-b pb-2">Servizi e Operatori</div>
      
      {services.length === 0 && (
        <ServiceAlert 
          hasServices={services.length > 0} 
          hasStaff={visibleStaff.length > 0} 
        />
      )}
      
      {serviceEntries.map((entry, index) => (
        <ServiceEntry
          key={index}
          entry={entry}
          index={index}
          services={allServices}
          visibleStaff={allStaff}
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
      >
        <Plus className="w-4 h-4 mr-2 text-blue-600" />
        Aggiungi servizio
      </Button>
    </div>
  );
};
