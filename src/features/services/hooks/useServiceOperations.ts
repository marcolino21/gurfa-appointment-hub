
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types';
import { ServiceFormValues } from '../types';

/**
 * Hook for service CRUD operations
 */
export const useServiceOperations = (
  services: Service[],
  setServices: React.Dispatch<React.SetStateAction<Service[]>>,
  currentSalonId: string | null,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const handleAddService = (data: ServiceFormValues) => {
    if (!currentSalonId) return;

    // Create service with required fields explicitly defined
    const newService: Service = {
      id: `s${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      category: data.category, 
      duration: data.duration,
      tempoDiPosa: data.tempoDiPosa,
      price: data.price,
      color: data.color,
      salonId: currentSalonId,
      assignedStaffIds: data.assignedStaffIds || [],
      // Optional fields
      description: data.description,
    };

    setServices([...services, newService]);
    toast({
      title: 'Servizio aggiunto',
      description: `${newService.name} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditService = (data: ServiceFormValues, selectedService: Service) => {
    if (!selectedService) return;

    const updatedServices = services.map(service => 
      service.id === selectedService.id ? { 
        ...service,
        name: data.name,
        category: data.category,
        duration: data.duration,
        tempoDiPosa: data.tempoDiPosa,
        price: data.price,
        color: data.color,
        description: data.description,
        assignedStaffIds: data.assignedStaffIds,
      } : service
    );

    setServices(updatedServices);
    toast({
      title: 'Servizio modificato',
      description: `${data.name} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    toast({
      title: 'Servizio eliminato',
      description: 'Il servizio è stato eliminato con successo',
    });
  };

  return {
    handleAddService,
    handleEditService,
    handleDeleteService
  };
};
