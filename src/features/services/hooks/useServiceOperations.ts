
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types/services';
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
    if (!currentSalonId) {
      toast({
        title: 'Errore',
        description: 'Nessun salone selezionato',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Verifica se la categoria è valida
      if (!data.category) {
        toast({
          title: 'Errore',
          description: 'La categoria è obbligatoria',
          variant: 'destructive',
        });
        return;
      }

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
        assignedServiceIds: [],
        // Optional fields
        description: data.description,
      };

      console.log('Aggiungendo nuovo servizio:', newService);
      setServices(prev => [...prev, newService]);
      
      toast({
        title: 'Servizio aggiunto',
        description: `${newService.name} è stato aggiunto con successo`,
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Errore durante l\'aggiunta del servizio:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'aggiunta del servizio',
        variant: 'destructive',
      });
    }
  };

  const handleEditService = (data: ServiceFormValues, selectedService: Service) => {
    if (!selectedService) return;

    try {
      // Verifica se la categoria è valida
      if (!data.category) {
        toast({
          title: 'Errore',
          description: 'La categoria è obbligatoria',
          variant: 'destructive',
        });
        return;
      }

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
          // Keep the existing assignedServiceIds
          assignedServiceIds: service.assignedServiceIds,
        } : service
      );

      setServices(updatedServices);
      toast({
        title: 'Servizio modificato',
        description: `${data.name} è stato modificato con successo`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Errore durante la modifica del servizio:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante la modifica del servizio',
        variant: 'destructive',
      });
    }
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
