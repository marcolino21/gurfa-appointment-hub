import { useState } from 'react';
import { ViewTypes as SchedulerViewTypes } from 'react-big-scheduler';
import { CalendarEvent } from '../types';

export type AppointmentFilters = {
  view: SchedulerViewTypes;
  date?: Date;
  staffId?: string;
};

export const useAppointments = () => {
  const [filters, setFilters] = useState<AppointmentFilters>({
    view: SchedulerViewTypes.Week,
  });

  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<CalendarEvent[]>([]);

  // Qui implementeremo la logica per filtrare gli appuntamenti
  // basandoci sui filtri impostati

  return {
    filters,
    setFilters,
    appointments,
    filteredAppointments,
  };
}; 