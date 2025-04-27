
import { useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { StaffMember } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const useAppointmentEvents = () => {
  const { filteredAppointments } = useAppointments();

  // Mappa gli appuntamenti in eventi per FullCalendar
  const events = useMemo(() => {
    console.log("Mapping appointments to calendar events:", filteredAppointments.length);
    
    return filteredAppointments.map(appointment => {
      try {
        // Verifico che appointment.staffId sia definito
        if (!appointment.staffId) {
          console.warn(`Appointment ${appointment.id} has no staffId. It won't be visible in the calendar.`);
        }
        
        // Verifico che start e end siano validi
        const start = new Date(appointment.start);
        const end = new Date(appointment.end);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error(`Invalid date for appointment ${appointment.id}`, { start: appointment.start, end: appointment.end });
        }
        
        // Formatto il titolo dell'evento per il calendario
        let title = appointment.clientName;
        if (appointment.service) {
          title += ` - ${appointment.service}`;
        }
        
        // Fornisco informazioni di debug
        console.log(`Creating calendar event for appointment ${appointment.id} with staffId ${appointment.staffId}`, {
          id: appointment.id,
          title: title,
          start: format(start, 'yyyy-MM-dd HH:mm', { locale: it }),
          end: format(end, 'yyyy-MM-dd HH:mm', { locale: it }),
          resourceId: appointment.staffId
        });
        
        // Creo l'evento del calendario
        return {
          id: appointment.id,
          title: title,
          start: start,
          end: end,
          resourceId: String(appointment.staffId),
          extendedProps: {
            clientName: appointment.clientName,
            service: appointment.service || '',
            status: appointment.status,
            notes: appointment.notes || ''
          },
          classNames: [
            `appointment-status-${appointment.status}`,
            'calendar-appointment'
          ]
        };
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        return null;
      }
    }).filter(Boolean); // Rimuove eventuali eventi null
  }, [filteredAppointments]);

  return { events };
};
