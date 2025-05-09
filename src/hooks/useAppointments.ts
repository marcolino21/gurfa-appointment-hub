
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
      console.log("Fetching appointments for salon:", activeSalonId);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services:service_id (name),
          staff:staff_id (first_name, last_name)
        `)
        .eq('salon_id', activeSalonId);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      console.log("Raw appointments data:", data);

      // Transform data for React Big Calendar - ensure title is a string, not a function
      const transformedAppointments = data.map((appointment: any): Appointment => {
        // Make sure title is a primitive string value
        const titleString = appointment.client_name ? String(appointment.client_name) : 'Appuntamento';
        
        // Extract service name if available
        const serviceName = appointment.services ? appointment.services.name : appointment.service || '';
        
        return {
          ...appointment,
          title: titleString, // Force string type
          service: serviceName,
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
          // Include staff info with proper naming
          staff_name: appointment.staff ? 
            `${appointment.staff.first_name} ${appointment.staff.last_name}` : ''
        };
      });

      console.log("Transformed appointments:", transformedAppointments);
      return transformedAppointments;
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
      console.log("Creating appointment with data:", appointmentData);
      
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
      console.log("Updating appointment with data:", appointmentData);
      
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

