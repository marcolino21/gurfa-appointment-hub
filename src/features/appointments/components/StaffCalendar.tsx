
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [businessHours, setBusinessHours] = useState<BusinessHoursByDay>({});
  const [hiddenDays, setHiddenDays] = useState<number[]>([]);
  const [slotMinTime, setSlotMinTime] = useState('09:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('20:00:00');

  useCalendarSync(view);
  useAutoScroll(calendarApi, view);

  // Fetch business hours for the current salon
  useEffect(() => {
    async function fetchBusinessHours() {
      const salonId = localStorage.getItem('currentSalonId');
      if (!salonId) return;
      
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
        const todayKey = dayMap[(selectedDate?.getDay() ?? new Date().getDay())] as keyof BusinessHoursByDay;
        const todayHours = hoursData[todayKey];
        
        if (todayHours) {
          setSlotMinTime(todayHours.openTime + ':00');
          setSlotMaxTime(todayHours.closeTime + ':00');
        } else {
          // Find first available day if today is closed
          const firstOpenDay = Object.keys(hoursData)[0] as keyof BusinessHoursByDay;
          if (firstOpenDay && hoursData[firstOpenDay]) {
            setSlotMinTime(hoursData[firstOpenDay].openTime + ':00');
            setSlotMaxTime(hoursData[firstOpenDay].closeTime + ':00');
          } else {
            // Default fallback
            setSlotMinTime('09:00:00');
            setSlotMaxTime('20:00:00');
          }
        }
      } else {
        setBusinessHours({});
        setHiddenDays([]);
        setSlotMinTime('09:00:00');
        setSlotMaxTime('20:00:00');
      }
    }
    
    fetchBusinessHours();
    // re-fetch when date or view changes to update available slots for each day
  }, [selectedDate, view]);

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

  // Create a safer version of common config with explicit locale handling
  const commonConfig = {
    locale: itLocale ? 'it' : undefined, // Use string identifier instead of object
    locales: itLocale ? [itLocale] : undefined, // Properly register the locale
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
    headerToolbar: false as const,
    slotDuration: '00:30:00',
    height: 'calc(100vh - 350px)',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false,
    hiddenDays,
    timeZone: 'local', // Ensure explicit timezone setting
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
