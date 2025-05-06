import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale/it';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndContext } from '@dnd-kit/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AppointmentModal } from './AppointmentModal';
import { DraggableEvent } from './DraggableEvent';
import { Appointment } from '@/types/calendar';
import { useServicesAndStaff } from '@/features/appointments/hooks/useServicesAndStaff';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { it },
});

interface CalendarViewProps {
  view?: 'day' | 'week' | 'month';
  selectedDate?: Date;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  view = 'week',
  selectedDate = new Date(),
}) => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>(view);
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
    resource?: any;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { staff } = useServicesAndStaff();
  const visibleStaff = Array.isArray(staff) ? staff.filter((s: any) => s.showInCalendar) : [];

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', currentDate],
    queryFn: async () => {
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients:client_id (name, email, phone),
          services:service_id (name, duration, price),
          staff:staff_id (name, color_code)
        `)
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString());

      if (error) throw error;
      return data as Appointment[];
    },
  });

  // Handle slot selection
  const handleSelectSlot = useCallback((slotInfo: any) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
      resource: slotInfo.resource,
    });
    setIsModalOpen(true);
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: Appointment) => {
    setSelectedSlot({
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      resource: event.staff_id,
    });
    setIsModalOpen(true);
  }, []);

  // Subscribe to real-time updates
  React.useEffect(() => {
    const channel = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Correggo la gestione della view per React Big Calendar
  const handleViewChange = (view: any) => {
    setCurrentView(view);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndContext>
      <div className="h-[calc(100vh-4rem)]">
        <Calendar
          localizer={localizer}
          events={appointments.map((appointment) => ({
            ...appointment,
            start: new Date(appointment.start_time),
            end: new Date(appointment.end_time),
            title: `${appointment.clients.name} - ${appointment.services.name}`,
            resourceId: appointment.staff_id,
          }))}
          startAccessor={(event) => new Date(event.start_time)}
          endAccessor={(event) => new Date(event.end_time)}
          style={{ height: '100%' }}
          view={currentView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={setCurrentDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          resources={visibleStaff}
          resourceIdAccessor="id"
          resourceTitleAccessor="name"
          messages={{
            next: 'Prossimo',
            previous: 'Precedente',
            today: 'Oggi',
            month: 'Mese',
            week: 'Settimana',
            day: 'Giorno',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Ora',
            event: 'Evento',
          }}
        />
      </div>

      {isModalOpen && selectedSlot && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          selectedSlot={selectedSlot}
        />
      )}
    </DndContext>
  );
}; 