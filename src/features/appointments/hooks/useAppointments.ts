import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types';

export type AppointmentFilters = {
  view: string;
  date?: Date;
  staffId?: string;
};

export function useAppointments() {
  const [filters, setFilters] = useState<AppointmentFilters>({ view: 'day' });
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  
  const filteredAppointments = useCallback(() => {
    return appointments.filter(appointment => {
      if (filters.staffId && appointment.staffId !== filters.staffId) return false;
      if (filters.date) {
        const appointmentDate = new Date(appointment.start);
        const filterDate = new Date(filters.date);
        return appointmentDate.toDateString() === filterDate.toDateString();
      }
      return true;
    });
  }, [appointments, filters]);

  return {
    filters,
    setFilters,
    appointments,
    setAppointments,
    filteredAppointments: filteredAppointments()
  };
}

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