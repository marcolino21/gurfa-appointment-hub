
import { useState, useEffect, useMemo } from 'react';
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
  
  // Utilizziamo useMemo per ottimizzare la trasformazione degli appuntamenti in eventi
  const transformedEvents = useMemo(() => {
    // Log dettagliati per debug
    console.log("=== DEBUG EVENTI CALENDARIO ===");
    console.log("Appuntamenti totali:", appointments.length);
    console.log("Appuntamenti filtrati:", filteredAppointments.length);
    
    // Transform appointments into calendar events
    return filteredAppointments.map(appointment => {
      console.log("Trasformando appuntamento in evento:", appointment);
      
      // Log per debugging
      if (!appointment.staffId) {
        console.warn("Appuntamento senza staffId:", appointment);
      }
      
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
  }, [filteredAppointments, appointments]);
  
  // Aggiorniamo gli eventi quando cambiano gli appuntamenti trasformati
  useEffect(() => {
    console.log("Eventi calendario generati:", transformedEvents.length);
    setEvents(transformedEvents);
  }, [transformedEvents]);

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
