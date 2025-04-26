
import { useEffect } from 'react';
import { Service } from '@/types';

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
  // Garantisci che serviceEntries sia sempre un array con almeno un elemento
  const serviceEntries: ServiceEntry[] = 
    formData.serviceEntries && formData.serviceEntries.length > 0 
      ? formData.serviceEntries 
      : [{ serviceId: '', staffId: '' }];

  useEffect(() => {
    console.log("Current service entries:", serviceEntries);
    console.log("Available services:", services);
    
    // Imposta il servizio predefinito se non è stato selezionato nulla
    if (serviceEntries.length > 0 && 
        services.length > 0 && 
        (!serviceEntries[0].serviceId || serviceEntries[0].serviceId === '')) {
      
      // Solo se abbiamo servizi disponibili
      const defaultService = services[0];
      if (defaultService) {
        console.log("Setting default service:", defaultService.name);
        handleServiceEntryChange(0, 'serviceId', defaultService.id);
      }
    }
  }, [serviceEntries, services]);

  const handleServiceEntryChange = (index: number, field: 'serviceId' | 'staffId', value: string) => {
    const newEntries = [...serviceEntries];
    
    // Assicurati che l'elemento all'indice specificato esista
    if (!newEntries[index]) {
      newEntries[index] = { serviceId: '', staffId: '' };
    }
    
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    console.log(`Updating ${field} at index ${index} with value:`, value);
    
    // Aggiorna il formData principale
    const entriesEvent = {
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(entriesEvent);
    
    // Se questo è il primo servizio e stiamo cambiando serviceId, aggiorna anche il campo legacy service
    if (index === 0 && field === 'serviceId') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        const serviceEvent = {
          target: { name: 'service', value: selectedService.name }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(serviceEvent);
        
        // Se il servizio ha una durata, imposta anche quella
        if (selectedService.duration) {
          const durationEvent = {
            target: { name: 'duration', value: selectedService.duration }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          
          handleInputChange(durationEvent);
        }
      }
    }
    
    // Se questo è il primo staff e stiamo cambiando staffId, aggiorna anche il campo legacy staffId
    if (index === 0 && field === 'staffId') {
      const staffEvent = {
        target: { name: 'staffId', value }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(staffEvent);
    }
  };

  const addServiceEntry = () => {
    // Aggiungi una nuova voce vuota
    const addEvent = {
      target: { 
        name: 'serviceEntries', 
        value: [...serviceEntries, { serviceId: '', staffId: '' }]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(addEvent);
  };

  const removeServiceEntry = (index: number) => {
    // Rimuovi la voce all'indice specificato
    const newEntries = serviceEntries.filter((_, i) => i !== index);
    
    // Assicurati che ci sia sempre almeno una voce
    if (newEntries.length === 0) {
      newEntries.push({ serviceId: '', staffId: '' });
    }
    
    const removeEvent = {
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(removeEvent);
  };

  return {
    serviceEntries,
    handleServiceEntryChange,
    addServiceEntry,
    removeServiceEntry
  };
};
