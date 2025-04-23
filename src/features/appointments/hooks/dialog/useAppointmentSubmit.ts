
import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';

export const useAppointmentSubmit = (
  onClose: () => void,
  setError: (error: string | null) => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  const { currentSalonId } = useAuth();
  const { addAppointment, updateAppointment, setCurrentAppointment, isSlotAvailable } = useAppointments();

  const handleSubmit = async (formData: Partial<Appointment>) => {
    if (!formData.clientName || !formData.start || !formData.end || !currentSalonId) {
      setError('Compila tutti i campi richiesti');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const isAvailable = isSlotAvailable(
        new Date(formData.start), 
        new Date(formData.end), 
        currentSalonId, 
        formData.id
      );
      
      if (!isAvailable) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      const appointmentData: Partial<Appointment> = {
        ...formData,
        title: formData.title || formData.service || 'Appuntamento',
        salonId: currentSalonId,
      };
      
      if (formData.id) {
        await updateAppointment(appointmentData as Appointment);
      } else {
        await addAppointment(appointmentData as Omit<Appointment, 'id'>);
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
