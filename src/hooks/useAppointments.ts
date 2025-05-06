
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFormData } from '@/types/appointments';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAppointments = (salonId?: string) => {
  const { user, currentSalonId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!salonId && !currentSalonId) return [];

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`*`)
        .eq('salon_id', salonId || currentSalonId);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      // Transform data for React Big Calendar
      return data.map((appointment: any): Appointment => ({
        id: appointment.id,
        client_id: appointment.client_id || '',
        service_id: appointment.service_id || '',
        staff_id: appointment.staff_id || '',
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: appointment.status || 'pending',
        notes: appointment.notes,
        price: appointment.price || 0,
        payment_status: appointment.payment_status || 'pending',
        created_at: appointment.created_at,
        
        // Derived properties
        title: appointment.title || appointment.client_name || 'Appuntamento',
        clientName: appointment.client_name || '',
        serviceName: appointment.service || '',
        staffName: '',
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time),
      }));
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      return [];
    }
  }, [salonId, currentSalonId]);

  // Use React Query to fetch and cache appointments
  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['appointments', salonId, currentSalonId],
    queryFn: fetchAppointments,
    enabled: !!salonId || !!currentSalonId
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!salonId && !currentSalonId) return;

    const channel = supabase
      .channel('appointment_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['appointments', salonId, currentSalonId] });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [salonId, currentSalonId, queryClient]);

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          salon_id: salonId || currentSalonId,
          status: appointmentData.status || 'pending',
          payment_status: 'pending'
        }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Appuntamento creato',
        description: 'L\'appuntamento è stato creato con successo',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, currentSalonId] });
    },
    onError: (error) => {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore nella creazione dell\'appuntamento',
        variant: 'destructive'
      });
    }
  });

  // Update appointment mutation
  const updateAppointment = useMutation({
    mutationFn: async ({ id, ...appointmentData }: AppointmentFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Appuntamento aggiornato',
        description: 'L\'appuntamento è stato aggiornato con successo',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, currentSalonId] });
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore nell\'aggiornamento dell\'appuntamento',
        variant: 'destructive'
      });
    }
  });

  // Delete appointment mutation
  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: 'Appuntamento eliminato',
        description: 'L\'appuntamento è stato eliminato con successo',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, currentSalonId] });
    },
    onError: (error) => {
      console.error('Error deleting appointment:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore nell\'eliminazione dell\'appuntamento',
        variant: 'destructive'
      });
    }
  });

  return {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
};
