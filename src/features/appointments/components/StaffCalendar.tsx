
import React, { useRef, useState } from 'react';
import itLocale from '@fullcalendar/core/locales/it';
import { StaffMember } from '@/types';
import { MonthView } from './calendar/MonthView';
import { TimeGridView } from './calendar/TimeGridView';
import { useCalendarSync } from '../hooks/useCalendarSync';
import { useAutoScroll } from '../hooks/useAutoScroll';
import '../styles/calendar.css';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Use custom hooks
  useCalendarSync(view);
  useAutoScroll(calendarApi, view);

  // Common configuration for all calendar views
  const commonConfig = {
    locale: itLocale,
    slotMinTime: '09:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    selectMirror: true,
    dayMaxEvents: true,
    selectable: true,
    select: onDateSelect,
    eventClick: onEventClick,
    editable: true,
    droppable: true,
    eventDrop: onEventDrop,
    headerToolbar: false as const,
    slotDuration: '00:30:00',
    height: 'calc(100vh - 350px)',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false
  };

  // Handle date selection from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      if (calendarApi) {
        calendarApi.gotoDate(date);
        
        if (view === 'timeGridWeek') {
          const tabsTrigger = document.querySelector('[value="day"]') as HTMLElement;
          if (tabsTrigger) {
            setTimeout(() => tabsTrigger.click(), 100);
          }
        }
      }
      
      setDatePickerOpen(false);
    }
  };

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

  return (
    <TimeGridView
      staffMembers={staffMembers}
      events={events}
      view={view}
      selectedDate={selectedDate}
      commonConfig={commonConfig}
      calendarRefs={calendarRefs}
      setCalendarApi={setCalendarApi}
    />
  );
};

export default StaffCalendar;
