
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
  const activeSalonId = salonId || currentSalonId || 'sa1'; // Default to sa1 for testing

  // Function to fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`*`)
        .eq('salon_id', activeSalonId);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      // Transform data for React Big Calendar - ensure title is a string, not a function
      return data.map((appointment: any): Appointment => {
        // Make sure title is a string value
        const clientName = typeof appointment.client_name === 'string' 
          ? appointment.client_name 
          : 'Appuntamento';
        
        return {
          ...appointment,
          title: clientName, // Always ensure title is a string
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
        };
      });
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      return [];
    }
  }, [activeSalonId]);

  // Use React Query to fetch and cache appointments
  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['appointments', activeSalonId],
    queryFn: fetchAppointments,
    enabled: !!activeSalonId
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('appointment_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['appointments', activeSalonId] });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSalonId, queryClient]);

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          salon_id: activeSalonId,
          status: appointmentData.status || 'pending'
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
      queryClient.invalidateQueries({ queryKey: ['appointments', activeSalonId] });
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
      queryClient.invalidateQueries({ queryKey: ['appointments', activeSalonId] });
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
      queryClient.invalidateQueries({ queryKey: ['appointments', activeSalonId] });
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
