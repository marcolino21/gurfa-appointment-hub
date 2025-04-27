
import { useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const useAppointmentEvents = () => {
  const { filteredAppointments, calendarUpdateTimestamp } = useAppointments();

  // Mappa gli appuntamenti in eventi per FullCalendar
  // Aggiunto calendarUpdateTimestamp come dipendenza per forzare il ricalcolo
  const events = useMemo(() => {
    console.log("Mapping appointments to calendar events:", filteredAppointments.length, "at timestamp", calendarUpdateTimestamp);
    
    return filteredAppointments.map(appointment => {
      try {
        // Normalizza lo staffId sempre a una stringa valida
        const staffId = appointment.staffId ? String(appointment.staffId) : undefined;
        
        // Verifico che appointment.staffId sia definito
        if (!staffId) {
          console.warn(`Appointment ${appointment.id} has no staffId. It won't be visible in a specific staff column.`);
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
        console.log(`Creating calendar event for appointment ${appointment.id} with staffId "${staffId}"`, {
          id: appointment.id,
          title: title,
          start: format(start, 'yyyy-MM-dd HH:mm', { locale: it }),
          end: format(end, 'yyyy-MM-dd HH:mm', { locale: it }),
          resourceId: staffId
        });
        
        // Determina il colore in base allo stato
        const statusColor = getStatusColor(appointment.status);
        
        // Creo l'evento del calendario con proprietà migliorate
        return {
          id: appointment.id,
          title: title,
          start: start,
          end: end,
          resourceId: staffId, // Assicura che sia sempre una stringa o undefined
          display: 'block', // Forza la visualizzazione come blocco
          allDay: false,
          editable: true,
          backgroundColor: statusColor.background,
          borderColor: statusColor.border,
          textColor: '#333333',
          extendedProps: {
            clientName: appointment.clientName,
            service: appointment.service || '',
            status: appointment.status || 'default',
            notes: appointment.notes || '',
            staffId: staffId, // Salva anche qui lo staffId normalizzato
            source: 'appointment' // Utile per distinguere da altri tipi di eventi
          },
          classNames: [
            `appointment-status-${appointment.status || 'default'}`,
            'calendar-appointment'
          ]
        };
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        return null;
      }
    }).filter(Boolean); // Rimuove eventuali eventi null
  }, [filteredAppointments, calendarUpdateTimestamp]);

  return { events };
};

// Funzione per determinare il colore in base allo stato
function getStatusColor(status?: string): { background: string; border: string } {
  switch (status) {
    case 'confirmed':
      return {
        background: 'rgba(16, 185, 129, 0.1)', // verde chiaro
        border: 'rgba(16, 185, 129, 0.8)' // verde più forte
      };
    case 'pending':
      return {
        background: 'rgba(245, 158, 11, 0.1)', // giallo chiaro
        border: 'rgba(245, 158, 11, 0.8)' // giallo più forte
      };
    case 'cancelled':
      return {
        background: 'rgba(239, 68, 68, 0.1)', // rosso chiaro
        border: 'rgba(239, 68, 68, 0.8)' // rosso più forte
      };
    default:
      return {
        background: 'rgba(59, 130, 246, 0.1)', // blu chiaro
        border: 'rgba(59, 130, 246, 0.8)' // blu più forte
      };
  }
}
