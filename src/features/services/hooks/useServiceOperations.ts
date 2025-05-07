
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

    console.log('Adding service with data:', data);

    // Per la categoria personalizzata, usa il valore di customCategory
    const categoryValue = data.customCategory && data.customCategory.trim() !== '' 
      ? data.customCategory 
      : data.category;

    // Crea servizio con tutti i campi richiesti
    const newService = {
      name: data.name,
      category: categoryValue, 
      duration: data.duration,
      tempo_di_posa: data.tempoDiPosa, // Field name adjusted for database column
      price: data.price,
      color: data.color,
      salon_id: currentSalonId, // Field name adjusted for database column
      assigned_staff_ids: data.assignedStaffIds || [], // Field name adjusted for database column
      assigned_service_ids: [], // Field name adjusted for database column
      description: data.description || '',
    };

    console.log('Sending to Supabase:', newService);

    try {
      const { data: insertedService, error } = await supabase
        .from('services')
        .insert(newService)
        .select()
        .single();

      if (error) {
        console.error('Supabase error response:', error);
        throw error;
      }

      console.log('Received from Supabase:', insertedService);

      // Transform the database format back to app format
      const formattedService: Service = {
        id: insertedService.id,
        name: insertedService.name,
        category: insertedService.category,
        description: insertedService.description,
        duration: insertedService.duration,
        tempoDiPosa: insertedService.tempo_di_posa,
        price: insertedService.price,
        color: insertedService.color,
        salonId: insertedService.salon_id,
        assignedStaffIds: insertedService.assigned_staff_ids,
        assignedServiceIds: insertedService.assigned_service_ids,
      };

      setServices(prevServices => [...prevServices, formattedService]);
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

    console.log('Editing service with data:', data);

    // Per la categoria personalizzata, usa il valore di customCategory
    const categoryValue = data.customCategory && data.customCategory.trim() !== '' 
      ? data.customCategory 
      : data.category;

    const updatedServiceDb = { 
      name: data.name,
      category: categoryValue,
      duration: data.duration,
      tempo_di_posa: data.tempoDiPosa, // Field name adjusted for database column
      price: data.price,
      color: data.color,
      description: data.description || '',
      assigned_staff_ids: data.assignedStaffIds || [], // Field name adjusted for database column
    };

    console.log('Sending to Supabase update:', updatedServiceDb);

    try {
      const { error } = await supabase
        .from('services')
        .update(updatedServiceDb)
        .eq('id', selectedService.id)
        .eq('salon_id', currentSalonId);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update the local state with transformed data
      const updatedService = { 
        ...selectedService,
        name: data.name,
        category: categoryValue,
        duration: data.duration,
        tempoDiPosa: data.tempoDiPosa,
        price: data.price,
        color: data.color,
        description: data.description,
        assignedStaffIds: data.assignedStaffIds,
      };

      setServices(prevServices => 
        prevServices.map(service => 
          service.id === selectedService.id ? updatedService : service
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

    console.log('Deleting service with ID:', serviceId);

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('salon_id', currentSalonId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

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
