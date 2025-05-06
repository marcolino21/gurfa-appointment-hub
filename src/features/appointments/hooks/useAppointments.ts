import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '../types/appointment';
import { useUser } from '@/hooks/useUser';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          staff:staff_id (name),
          service:service_id (name, duration, price)
        `)
        .eq('salon_id', user?.currentSalonId)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const transformedAppointments = data?.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.client_name} - ${appointment.service?.name || 'Servizio'}`,
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time),
        clientName: appointment.client_name,
        clientPhone: appointment.client_phone,
        staffName: appointment.staff?.name || 'Staff',
        serviceName: appointment.service?.name || 'Servizio',
        status: appointment.status,
        notes: appointment.notes,
      })) || [];

      setAppointments(transformedAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento degli appuntamenti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.currentSalonId) {
      fetchAppointments();
    }
  }, [user?.currentSalonId]);

  const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          salon_id: user?.currentSalonId,
          client_name: appointment.clientName,
          client_phone: appointment.clientPhone,
          start_time: appointment.start.toISOString(),
          end_time: appointment.end.toISOString(),
          staff_id: appointment.staffId,
          service_id: appointment.serviceId,
          status: appointment.status,
          notes: appointment.notes,
        })
        .select()
        .single();

      if (error) throw error;

      const newAppointment = {
        ...appointment,
        id: data.id,
      };

      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella creazione dell\'appuntamento');
      throw err;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          client_name: updates.clientName,
          client_phone: updates.clientPhone,
          start_time: updates.start?.toISOString(),
          end_time: updates.end?.toISOString(),
          staff_id: updates.staffId,
          service_id: updates.serviceId,
          status: updates.status,
          notes: updates.notes,
        })
        .eq('id', id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nell\'aggiornamento dell\'appuntamento');
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);

      if (error) throw error;

      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nell\'eliminazione dell\'appuntamento');
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: fetchAppointments,
  };
};

// Qui puoi aggiungere altre funzioni o hook utili per la gestione degli appuntamenti

export function useAppointmentEvents() {
  // ... implementazione mock o reale ...
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  return { events, setEvents, isLoading: false, error: null };
}

export function useStaffResources(salonId: string | null) {
  // ... implementazione mock o reale ...
  const [resources, setResources] = useState<any[]>([]);
  return { resources, setResources, isLoading: false, error: null };
} 