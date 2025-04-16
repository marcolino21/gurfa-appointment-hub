
import { useState, useEffect } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';

export const useAppointmentEvents = () => {
  const { filteredAppointments } = useAppointments();
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    // Transform appointments into calendar events
    const calendarEvents = filteredAppointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.clientName} - ${appointment.service || ''}`,
      start: appointment.start,
      end: appointment.end,
      backgroundColor: getEventColor(appointment.status),
      borderColor: getEventColor(appointment.status),
      resourceId: appointment.staffId,
      extendedProps: {
        status: appointment.status,
        staffId: appointment.staffId
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
