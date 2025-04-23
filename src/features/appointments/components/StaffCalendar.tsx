
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

  // Log events and staff per render per debugging
  useEffect(() => {
    console.log("StaffCalendar rendering with:", {
      staffMembersCount: staffMembers.length,
      eventsCount: events.length,
      view,
      staffIds: staffMembers.map(s => s.id),
      firstFewEvents: events.slice(0, 3)
    });
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

  // Improved refresh of calendars after events update
  useEffect(() => {
    if (calendarApi && events.length >= 0) { // Changed from > 0 to >= 0 to refresh even when no events
      try {
        console.log("Refreshing calendar with events:", events.length);
        
        // Forza un aggiornamento più aggressivo
        setTimeout(() => {
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
          calendarApi.refetchEvents();
          calendarApi.render(); // Force complete re-render
        }, 100);
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
