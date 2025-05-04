
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFormData } from '@/types/appointments';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAppointments = (salonId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!salonId && !user) return [];

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients(first_name, last_name),
          services(name, duration, price),
          staff(first_name, last_name, color)
        `)
        .eq('salon_id', salonId || user?.salon_id);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      // Transform data for React Big Calendar
      return data.map((appointment: any): Appointment => ({
        ...appointment,
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time),
        title: `${appointment.clients?.first_name} ${appointment.clients?.last_name} - ${appointment.services?.name}`,
        clientName: `${appointment.clients?.first_name} ${appointment.clients?.last_name}`,
        serviceName: appointment.services?.name,
        staffName: `${appointment.staff?.first_name} ${appointment.staff?.last_name}`,
      }));
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      return [];
    }
  }, [salonId, user]);

  // Use React Query to fetch and cache appointments
  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['appointments', salonId, user?.salon_id],
    queryFn: fetchAppointments,
    enabled: !!salonId || !!user?.salon_id
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!salonId && !user?.salon_id) return;

    const channel = supabase
      .channel('appointment_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => {
          queryClient.invalidateQueries(['appointments', salonId, user?.salon_id]);
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [salonId, user?.salon_id, queryClient]);

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          salon_id: salonId || user?.salon_id,
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
      queryClient.invalidateQueries(['appointments', salonId, user?.salon_id]);
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
      queryClient.invalidateQueries(['appointments', salonId, user?.salon_id]);
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
      queryClient.invalidateQueries(['appointments', salonId, user?.salon_id]);
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
