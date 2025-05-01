import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import moment from 'moment';

const mockAppointments = [
  {
    id: '1',
    title: 'Taglio di capelli',
    start: moment().add(1, 'day').set({ hour: 10, minute: 0 }).toISOString(),
    end: moment().add(1, 'day').set({ hour: 11, minute: 0 }).toISOString(),
    staffId: '1',
    customerId: '1',
    serviceId: '1',
    status: 'confirmed' as const,
    clientName: 'Mario Rossi',
    service: 'Taglio di capelli',
    color: '#3b82f6',
    notes: 'Cliente abituale'
  },
  {
    id: '2',
    title: 'Colore',
    start: moment().add(1, 'day').set({ hour: 14, minute: 0 }).toISOString(),
    end: moment().add(1, 'day').set({ hour: 16, minute: 0 }).toISOString(),
    staffId: '2',
    customerId: '2',
    serviceId: '2',
    status: 'pending' as const,
    clientName: 'Luigi Bianchi',
    service: 'Colore',
    color: '#f59e0b',
    notes: 'Prima visita'
  }
];

export const useAppointmentEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const transformedEvents = mockAppointments.map((appointment) => {
        const start = moment(appointment.start).format('YYYY-MM-DD HH:mm');
        const end = moment(appointment.end).format('YYYY-MM-DD HH:mm');

        const event: CalendarEvent = {
          id: appointment.id,
          title: appointment.title,
          start,
          end,
          resourceId: appointment.staffId,
          bgColor: appointment.color,
          status: appointment.status,
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
  }, []);

  return { events, isLoading, error };
};
