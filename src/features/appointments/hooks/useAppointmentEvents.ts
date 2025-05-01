import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import moment from 'moment';

export const useAppointmentEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/appointments');
        const data = await response.json();

        const transformedEvents = data.map((appointment: any) => {
          // Converti le date in stringhe formattate per react-big-scheduler
          const start = moment(appointment.start).format('YYYY-MM-DD HH:mm');
          const end = moment(appointment.end).format('YYYY-MM-DD HH:mm');

          // Crea l'evento nel formato richiesto da react-big-scheduler
          const event: CalendarEvent = {
            id: appointment.id,
            title: appointment.title || 'Appuntamento',
            start,
            end,
            resourceId: appointment.staffId,
            bgColor: appointment.color || '#3b82f6',
            status: appointment.status || 'pending',
            staffId: appointment.staffId,
            customerId: appointment.customerId,
            serviceId: appointment.serviceId,
            notes: appointment.notes,
            clientName: appointment.clientName,
            service: appointment.service,
            color: appointment.color,
            isDraggable: true,
            isResizable: true,
            isAllDay: false
          };

          return event;
        });

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Errore nel caricamento degli appuntamenti'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { events, isLoading, error };
};
