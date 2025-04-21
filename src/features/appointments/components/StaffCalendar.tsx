
import React, { useRef, useState, useEffect } from 'react';
import itLocale from '@fullcalendar/core/locales/it';
import { StaffMember } from '@/types';
import { MonthView } from './calendar/MonthView';
import { TimeGridView } from './calendar/TimeGridView';
import { useCalendarSync } from '../hooks/useCalendarSync';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { supabase } from '@/integrations/supabase/client';
import '../styles/index.css';

interface BusinessHoursByDay {
  monday?: { openTime: string; closeTime: string };
  tuesday?: { openTime: string; closeTime: string };
  wednesday?: { openTime: string; closeTime: string };
  thursday?: { openTime: string; closeTime: string };
  friday?: { openTime: string; closeTime: string };
  saturday?: { openTime: string; closeTime: string };
  sunday?: { openTime: string; closeTime: string };
}

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
  const [businessHours, setBusinessHours] = useState<BusinessHoursByDay>({});
  const [hiddenDays, setHiddenDays] = useState<number[]>([]);
  const [slotMinTime, setSlotMinTime] = useState('08:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('20:00:00');

  // Always ensure we have a valid date object
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime()) // Create a new date object to avoid reference issues
    : new Date();

  useCalendarSync(view);
  useAutoScroll(calendarApi, view);

  // Fetch business hours for the current salon
  useEffect(() => {
    async function fetchBusinessHours() {
      const salonId = localStorage.getItem('currentSalonId');
      if (!salonId) return;
      
      try {
        const { data, error } = await supabase
          .from('salon_profiles')
          .select('business_hours')
          .eq('salon_id', salonId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching business hours:", error);
          return;
        }
        
        if (data && data.business_hours) {
          const hoursData = data.business_hours as BusinessHoursByDay;
          setBusinessHours(hoursData);

          // Setup hiddenDays and min/max slots
          const dayMap = [
            'sunday',    // 0
            'monday',    // 1
            'tuesday',   // 2
            'wednesday', // 3
            'thursday',  // 4
            'friday',    // 5
            'saturday'   // 6
          ];
          
          const hidden = dayMap
            .map((key, idx) => (hoursData[key as keyof BusinessHoursByDay] ? null : idx))
            .filter((v) => v !== null) as number[];
          setHiddenDays(hidden);

          // For week/day view, set min/max time based on current day or first enabled day
          let currentDate = new Date();
          // Always use a safe date object
          if (validSelectedDate instanceof Date && !isNaN(validSelectedDate.getTime())) {
            currentDate = validSelectedDate;
          }
          const dayOfWeek = currentDate.getDay();
          
          const todayKey = dayMap[dayOfWeek] as keyof BusinessHoursByDay;
          const todayHours = hoursData[todayKey];
          
          if (todayHours) {
            setSlotMinTime(todayHours.openTime + ':00');
            setSlotMaxTime(todayHours.closeTime + ':00');
          } else {
            // Find first available day if today is closed
            const firstOpenDayKey = Object.keys(hoursData)[0] as keyof BusinessHoursByDay;
            if (firstOpenDayKey && hoursData[firstOpenDayKey]) {
              setSlotMinTime(hoursData[firstOpenDayKey].openTime + ':00');
              setSlotMaxTime(hoursData[firstOpenDayKey].closeTime + ':00');
            } else {
              // Default fallback
              setSlotMinTime('08:00:00');
              setSlotMaxTime('20:00:00');
            }
          }
        } else {
          setBusinessHours({});
          setHiddenDays([]);
          setSlotMinTime('08:00:00');
          setSlotMaxTime('20:00:00');
        }
      } catch (fetchError) {
        console.error("Failed to fetch business hours:", fetchError);
        // Set defaults in case of error
        setBusinessHours({});
        setHiddenDays([]);
        setSlotMinTime('08:00:00');
        setSlotMaxTime('20:00:00');
      }
    }
    
    fetchBusinessHours();
    // re-fetch when date or view changes to update available slots for each day
  }, [validSelectedDate, view]);

  // Handle date selection from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(new Date(date.getTime())); // Create a new instance

      if (calendarApi) {
        try {
          calendarApi.gotoDate(date);

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

  // Create a safer version of common config with explicit locale handling
  const commonConfig = {
    locale: 'it',
    locales: [itLocale],
    slotMinTime,
    slotMaxTime,
    allDaySlot: false,
    selectMirror: true,
    dayMaxEvents: true,
    selectable: true,
    select: onDateSelect,
    eventClick: onEventClick,
    editable: true,
    droppable: true,
    eventDrop: onEventDrop,
    headerToolbar: false,
    slotDuration: '00:30:00',
    height: '100%',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false,
    hiddenDays,
    timeZone: 'local',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric'
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    views: {
      timeGridDay: {
        dayHeaderFormat: { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric'
        }
      },
      timeGridWeek: {
        dayHeaderFormat: { 
          weekday: 'short', 
          month: 'numeric', 
          day: 'numeric'
        }
      },
      dayGridMonth: {
        dayHeaderFormat: { 
          weekday: 'short'
        }
      }
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
      view={view === 'timeGridWeek' ? 'timeGridDay' : view}
      selectedDate={selectedDate}
      commonConfig={commonConfig}
      calendarRefs={calendarRefs}
      setCalendarApi={setCalendarApi}
    />
  );
};

export default StaffCalendar;
