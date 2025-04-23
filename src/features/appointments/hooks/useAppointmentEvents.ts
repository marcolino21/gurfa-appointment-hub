
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
  
  // Function to get event color based on status
  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2563eb'; // blue
      case 'completed': return '#16a34a'; // green
      case 'pending': return '#ea580c';   // orange
      case 'cancelled': return '#dc2626'; // red
      default: return '#2563eb';          // default blue
    }
  };
  
  // Normalize staffId to ensure it's always a proper string or undefined
  const normalizeStaffId = (staffId: any): string | undefined => {
    // If it's null or undefined, return undefined
    if (staffId === null || staffId === undefined) {
      return undefined;
    }
    
    // If it's an object with a value property
    if (typeof staffId === 'object' && staffId !== null && 'value' in staffId) {
      // Check if the value is 'undefined' as a string
      return staffId.value === 'undefined' ? undefined : String(staffId.value);
    } 
    
    // If it's already a string or other value, convert to string
    return String(staffId);
  };
  
  // Transform appointments into calendar events
  const transformedEvents = useMemo(() => {
    console.log("=== EVENTI CALENDARIO ===");
    console.log("Appuntamenti totali:", appointments.length);
    console.log("Appuntamenti filtrati:", filteredAppointments.length);
    
    // Mappa degli ID degli appuntamenti trasformati per debug
    const transformedIds = new Set<string>();
    
    const events = filteredAppointments.map(appointment => {
      // Normalize the staffId
      const staffId = normalizeStaffId(appointment.staffId);
      
      // Aggiungi all'insieme per debug
      transformedIds.add(appointment.id);
      
      // Debug log
      console.log(`Transforming appointment ${appointment.id}, staffId original:`, appointment.staffId, "normalized:", staffId);
      
      const event = {
        id: appointment.id,
        title: `${appointment.clientName} - ${appointment.service || ''}`,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: getEventColor(appointment.status),
        borderColor: getEventColor(appointment.status),
        resourceId: staffId,
        extendedProps: {
          status: appointment.status,
          staffId: staffId,
          clientName: appointment.clientName,
          service: appointment.service
        }
      };
      
      return event;
    });
    
    // Verifica se ci sono appuntamenti che non sono stati trasformati
    const missingIds = appointments
      .filter(app => !transformedIds.has(app.id))
      .map(app => app.id);
    
    if (missingIds.length > 0) {
      console.warn("Appuntamenti non trasformati in eventi:", missingIds);
      console.warn("Possibili filtri attivi che li escludono:", JSON.stringify(missingIds));
    }
    
    return events;
  }, [filteredAppointments, appointments]);
  
  // Update events when transformed events change
  useEffect(() => {
    console.log("Events generated:", transformedEvents.length);
    console.log("Events with valid resourceId:", transformedEvents.filter(e => e.resourceId !== undefined).length);
    setEvents(transformedEvents);
  }, [transformedEvents]);
  
  return { events };
};
