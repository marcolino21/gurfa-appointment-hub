
import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useAppointmentSubmit = (
  onClose: () => void,
  setError: (error: string | null) => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  const { currentSalonId } = useAuth();
  const { addAppointment, updateAppointment, setCurrentAppointment, isSlotAvailable } = useAppointments();
  const { toast } = useToast();

  const validateForm = (formData: Partial<Appointment>): string | null => {
    if (!formData.clientName || formData.clientName.trim() === '') {
      return 'Il nome del cliente è obbligatorio';
    }
    
    if (!formData.start || !formData.end) {
      return 'Data e orario sono obbligatori';
    }
    
    return null;
  };

  const handleSubmit = async (formData: Partial<Appointment>) => {
    console.log("Submitting appointment form data:", formData);
    
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (!currentSalonId) {
      setError('Nessun salone selezionato');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Se non c'è un titolo, utilizziamo il nome del servizio o un default
      const title = formData.title || formData.service || 'Appuntamento';
      
      // Assicuriamoci che staffId sia una stringa semplice
      let staffId = formData.staffId;
      if (typeof staffId === 'object' && staffId !== null && 'value' in staffId) {
        staffId = staffId.value;
      }
      
      // Creiamo i serviceEntries se non esistono
      let serviceEntries = formData.serviceEntries || [];
      if (serviceEntries.length === 0 && formData.staffId && formData.service) {
        serviceEntries = [{ staffId: String(formData.staffId), serviceId: formData.service }];
      }
      
      const isAvailable = isSlotAvailable(
        new Date(formData.start as string), 
        new Date(formData.end as string), 
        currentSalonId, 
        formData.id
      );
      
      if (!isAvailable) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      const appointmentData: Partial<Appointment> = {
        ...formData,
        title,
        staffId,
        serviceEntries,
        salonId: currentSalonId,
      };
      
      console.log("Final appointment data to save:", appointmentData);
      
      if (formData.id) {
        await updateAppointment(appointmentData as Appointment);
        toast({
          title: "Appuntamento aggiornato",
          description: "L'appuntamento è stato aggiornato con successo"
        });
      } else {
        await addAppointment(appointmentData as Omit<Appointment, 'id'>);
        toast({
          title: "Appuntamento creato",
          description: "L'appuntamento è stato creato con successo"
        });
      }
      
      onClose();
      setCurrentAppointment(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit
  };
};
