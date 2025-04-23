
import React, { useRef, useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { MonthView } from './calendar/MonthView';
import { TimeGridView } from './calendar/TimeGridView';
import { useCalendarSync } from '../hooks/useCalendarSync';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { useCalendarConfig } from '../hooks/useCalendarConfig';
import '../styles/index.css';

interface StaffCalendarProps {
  staffMembers: StaffMember[];
  events: any[];
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';
  onEventClick: (info: any) => void;
  onEventDrop: (info: any) => void;
  onDateSelect: (info: any) => void;
}

const StaffCalendar: React.FC<StaffCalendarProps> = ({
  staffMembers,
  events,
  view,
  onEventClick,
  onEventDrop,
  onDateSelect
}) => {
  const calendarRefs = useRef<any[]>([]);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Log events and staff per render for debugging
  useEffect(() => {
    console.log("StaffCalendar rendering with:", {
      staffMembersCount: staffMembers.length,
      eventsCount: events.length,
      view,
      staffIds: staffMembers.map(s => s.id),
      firstFewEvents: events.slice(0, 3)
    });
    
    // Debug eventi e interattività
    console.log("Eventi con resourceId:", events.filter(e => e.resourceId).length);
    console.log("Eventi senza resourceId:", events.filter(e => !e.resourceId).length);
    
    // Log per verificare corrispondenza tra eventi e staff
    const staffEventsMapping = staffMembers.map(staff => ({
      staffId: staff.id,
      staffName: `${staff.firstName} ${staff.lastName}`,
      events: events.filter(event => event.resourceId === staff.id).length
    }));
    console.log("Mappatura staff-eventi:", staffEventsMapping);
  }, [staffMembers, events, view]);

  // Always ensure we have a valid date object
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();

  // Custom hooks
  const { hiddenDays, slotMinTime, slotMaxTime } = useBusinessHours(validSelectedDate);
  const commonConfig = useCalendarConfig(
    slotMinTime,
    slotMaxTime,
    hiddenDays,
    onDateSelect,
    onEventClick,
    onEventDrop
  );
  
  // Enhanced scroll synchronization - now applies to all calendar views
  useCalendarSync(view);
  useAutoScroll(calendarApi, view);

  // Handle date selection from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(new Date(date.getTime()));

      if (calendarApi) {
        try {
          calendarApi.gotoDate(date);

          // Always ensure we're in day view for consistency
          if (view === 'timeGridWeek') {
            const tabsTrigger = document.querySelector('[value="timeGridDay"]') as HTMLElement;
            if (tabsTrigger) {
              setTimeout(() => tabsTrigger.click(), 100);
            }
          }
        } catch (error) {
          console.error("Error navigating to date:", error);
        }
      }
      setDatePickerOpen(false);
    }
  };

  // Assicura che gli eventi siano interattivi dopo l'aggiornamento
  useEffect(() => {
    if (calendarApi && events.length >= 0) {
      try {
        console.log("Refreshing calendar with events:", events.length);
        
        // Forza un aggiornamento più aggressivo
        const refreshCalendar = () => {
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
          calendarApi.refetchEvents();
          calendarApi.render(); // Force complete re-render
          
          // Ritardo breve per assicurare che gli eventi siano renderizzati
          setTimeout(() => {
            document.querySelectorAll('.fc-event').forEach(el => {
              (el as HTMLElement).style.pointerEvents = 'auto';
              (el as HTMLElement).style.cursor = 'pointer';
              el.classList.add('fc-event-interactive');
            });
          }, 200);
        };
        
        // Eseguiamo immediatamente e poi dopo un breve ritardo
        refreshCalendar();
        setTimeout(refreshCalendar, 300);
      } catch (error) {
        console.error("Error refreshing calendar events:", error);
      }
    }
  }, [events, calendarApi]);

  if (view === 'dayGridMonth') {
    return (
      <MonthView
        staffMembers={staffMembers}
        events={events}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        commonConfig={commonConfig}
        calendarRefs={calendarRefs}
        setCalendarApi={setCalendarApi}
        datePickerOpen={datePickerOpen}
        setDatePickerOpen={setDatePickerOpen}
      />
    );
  }

  // Always use timeGridDay view for consistency between day and week views
  return (
    <TimeGridView
      staffMembers={staffMembers}
      events={events}
      view={view === 'timeGridWeek' ? 'timeGridDay' : view}
      selectedDate={selectedDate}
      commonConfig={commonConfig}
      calendarRefs={calendarRefs}
      setCalendarApi={setCalendarApi}
    />
  );
};

export default StaffCalendar;
