
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types/services';
import { ServiceFormValues } from '../types';
import { supabase } from '@/integrations/supabase/client';

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

  const handleAddService = async (data: ServiceFormValues) => {
    if (!currentSalonId) {
      toast({
        title: 'Errore',
        description: 'Nessun salone selezionato',
        variant: 'destructive',
      });
      return;
    }

    // Per la categoria personalizzata, usa il valore di customCategory
    const categoryValue = data.customCategory && data.customCategory.trim() !== '' 
      ? data.customCategory 
      : data.category;

    // Crea servizio con tutti i campi richiesti
    const newService: Omit<Service, 'id'> = {
      name: data.name,
      category: categoryValue, 
      duration: data.duration,
      tempoDiPosa: data.tempoDiPosa,
      price: data.price,
      color: data.color,
      salonId: currentSalonId,
      assignedStaffIds: data.assignedStaffIds || [],
      assignedServiceIds: [],
      // Campi opzionali
      description: data.description,
    };

    try {
      const { data: insertedService, error } = await supabase
        .from('services')
        .insert(newService)
        .select()
        .single();

      if (error) throw error;

      setServices(prevServices => [...prevServices, insertedService]);
      toast({
        title: 'Servizio aggiunto',
        description: `${newService.name} è stato aggiunto con successo`,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Errore durante l\'aggiunta del servizio:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere il servizio.',
        variant: 'destructive',
      });
    }
  };

  const handleEditService = async (data: ServiceFormValues, selectedService: Service) => {
    if (!selectedService || !currentSalonId) return;

    // Per la categoria personalizzata, usa il valore di customCategory
    const categoryValue = data.customCategory && data.customCategory.trim() !== '' 
      ? data.customCategory 
      : data.category;

    const updatedService = { 
      name: data.name,
      category: categoryValue,
      duration: data.duration,
      tempoDiPosa: data.tempoDiPosa,
      price: data.price,
      color: data.color,
      description: data.description,
      assignedStaffIds: data.assignedStaffIds,
      // Mantieni gli assignedServiceIds esistenti
      assignedServiceIds: selectedService.assignedServiceIds,
    };

    try {
      const { error } = await supabase
        .from('services')
        .update(updatedService)
        .eq('id', selectedService.id)
        .eq('salon_id', currentSalonId);

      if (error) throw error;

      setServices(prevServices => 
        prevServices.map(service => 
          service.id === selectedService.id ? { ...service, ...updatedService } : service
        )
      );
      
      toast({
        title: 'Servizio modificato',
        description: `${data.name} è stato modificato con successo`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Errore durante la modifica del servizio:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile modificare il servizio.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!currentSalonId) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('salon_id', currentSalonId);

      if (error) throw error;

      setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
      toast({
        title: 'Servizio eliminato',
        description: 'Il servizio è stato eliminato con successo',
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione del servizio:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il servizio.',
        variant: 'destructive',
      });
    }
  };

  return {
    handleAddService,
    handleEditService,
    handleDeleteService
  };
};
