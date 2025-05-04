
import React, { useCallback, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/contexts/AuthContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

// Setup the localizer for date-fns
const locales = { 'it': it };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: it }),
  getDay,
  locales,
});

const Calendar = () => {
  const { 
    selectedDate, 
    view, 
    setSelectedDate, 
    setView, 
    openModal, 
    setSelectedAppointment 
  } = useAppointmentStore();
  
  const { user, currentSalonId } = useAuth();
  const { appointments, isLoading } = useAppointments(currentSalonId);

  // Event handlers
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    openModal({ start, end });
  }, [openModal]);

  const handleSelectEvent = useCallback((event: any) => {
    setSelectedAppointment(event);
    openModal();
  }, [setSelectedAppointment, openModal]);

  const handleNavigate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [setSelectedDate]);

  const handleViewChange = useCallback((newView: string) => {
    setView(newView as 'day' | 'week' | 'month');
  }, [setView]);

  return (
    <div className="h-[calc(100vh-180px)]">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          date={selectedDate}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          messages={{
            today: 'Oggi',
            previous: 'Indietro',
            next: 'Avanti',
            month: 'Mese',
            week: 'Settimana',
            day: 'Giorno',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Ora',
            event: 'Evento',
            noEventsInRange: 'Nessun appuntamento in questo periodo',
            allDay: 'Tutto il giorno',
            work_week: 'Settimana lavorativa',
            yesterday: 'Ieri',
            tomorrow: 'Domani',
            showMore: (total) => `+ ${total} altri`
          }}
          eventPropGetter={(event) => {
            const style: React.CSSProperties = {
              backgroundColor: event.color || '#3174ad',
              borderRadius: '4px',
            };
            
            // Status-based styling
            if (event.status === 'completed') {
              style.backgroundColor = '#10b981';
            } else if (event.status === 'cancelled') {
              style.backgroundColor = '#ef4444';
              style.textDecoration = 'line-through';
            } else if (event.status === 'pending') {
              style.backgroundColor = '#f59e0b';
            }
            
            return { style };
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
