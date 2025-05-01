import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import moment from 'moment';

export const useAppointmentEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentEvents = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/appointments');
        const appointments = await response.json();
        
        const transformedEvents = appointments.map((appointment: any) => ({
          id: appointment.id,
          title: `${appointment.clientName || 'Cliente non specificato'} - ${appointment.service || 'Servizio non specificato'}`,
          start: moment(appointment.start).format('YYYY-MM-DD HH:mm'),
          end: moment(appointment.end).format('YYYY-MM-DD HH:mm'),
          resourceId: appointment.staffId,
          bgColor: appointment.color || '#3b82f6',
          status: appointment.status,
          staffId: appointment.staffId,
          customerId: appointment.customerId,
          serviceId: appointment.serviceId,
          notes: appointment.notes,
          clientName: appointment.clientName,
          service: appointment.service,
          color: appointment.color
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching appointment events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentEvents();
  }, []);

  return { events, isLoading };
};
