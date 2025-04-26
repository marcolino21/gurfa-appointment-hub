
import { useEffect } from 'react';
import { StaffMember, Service } from '@/types';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

interface UseServiceFieldsStateProps {
  formData: any;
  handleInputChange: (e: any) => void;
  services: Service[];
}

export const useServiceFieldsState = ({
  formData,
  handleInputChange,
  services
}: UseServiceFieldsStateProps) => {
  const serviceEntries: ServiceEntry[] = formData.serviceEntries || [{ serviceId: '', staffId: '' }];

  useEffect(() => {
    console.log("Current service entries:", serviceEntries);
    console.log("Available services:", services);
  }, [serviceEntries, services]);

  const handleServiceEntryChange = (index: number, field: 'serviceId' | 'staffId', value: string) => {
    const newEntries = [...serviceEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    console.log(`Updating ${field} at index ${index} with value:`, value);
    
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    if (index === 0 && field === 'serviceId') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        handleInputChange({
          target: { name: 'service', value: selectedService.name }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
    
    if (index === 0 && field === 'staffId') {
      handleInputChange({
        target: { name: 'staffId', value }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const addServiceEntry = () => {
    handleInputChange({
      target: { 
        name: 'serviceEntries', 
        value: [...serviceEntries, { serviceId: '', staffId: '' }]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const removeServiceEntry = (index: number) => {
    const newEntries = serviceEntries.filter((_, i) => i !== index);
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return {
    serviceEntries,
    handleServiceEntryChange,
    addServiceEntry,
    removeServiceEntry
  };
};
