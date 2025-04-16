
import { useState, useEffect } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Appointment } from '@/types';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor: string;
  borderColor: string;
  resourceId?: string;
  extendedProps: {
    status: string;
    staffId?: string;
    clientName: string;
    service?: string;
  };
}

export const useAppointmentEvents = () => {
  const { filteredAppointments } = useAppointments();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  useEffect(() => {
    // Transform appointments into calendar events
    const calendarEvents = filteredAppointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.clientName} - ${appointment.service || ''}`,
      start: appointment.start,
      end: appointment.end,
      backgroundColor: getEventColor(appointment.status),
      borderColor: getEventColor(appointment.status),
      resourceId: appointment.staffId,  // This is critical for staff resource mapping
      extendedProps: {
        status: appointment.status,
        staffId: appointment.staffId,
        clientName: appointment.clientName,
        service: appointment.service
      }
    }));
    
    setEvents(calendarEvents);
  }, [filteredAppointments]);

  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2563eb'; // blue
      case 'completed': return '#16a34a'; // green
      case 'pending': return '#ea580c';   // orange
      case 'cancelled': return '#dc2626'; // red
      default: return '#2563eb';          // default blue
    }
  };
  
  return { events };
};
