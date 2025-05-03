import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types/appointment';

export const useAppointmentEvents = (businessId: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API call to fetch appointments
        const mockEvents: CalendarEvent[] = [
          {
            id: '1',
            title: 'Appuntamento 1',
            start: new Date(),
            end: new Date(Date.now() + 3600000),
            staffId: '1',
            status: 'confirmed',
            customerName: 'Cliente 1',
            serviceName: 'Servizio 1'
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [businessId]);

  return { events, isLoading };
};
