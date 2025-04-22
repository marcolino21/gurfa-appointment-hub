
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
  const { filteredAppointments, appointments } = useAppointments();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  useEffect(() => {
    // Verifichiamo che ci siano appuntamenti disponibili
    console.log("Appuntamenti disponibili:", appointments.length);
    console.log("Appuntamenti filtrati:", filteredAppointments.length);
    
    // Transform appointments into calendar events
    const calendarEvents = filteredAppointments.map(appointment => {
      console.log("Trasformando appuntamento in evento:", appointment);
      
      return {
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
      };
    });
    
    console.log("Eventi calendario generati:", calendarEvents.length);
    setEvents(calendarEvents);
  }, [filteredAppointments, appointments]);

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
