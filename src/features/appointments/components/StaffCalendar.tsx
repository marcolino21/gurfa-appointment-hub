
import React, { useRef, useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { MonthView } from './calendar/MonthView';
import { TimeGridView } from './calendar/TimeGridView';
import { useCalendarSync } from '../hooks/useCalendarSync';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { useCalendarConfig } from '../hooks/useCalendarConfig';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState(1);

  // Log events and staff per render for debugging
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
  
  // Use custom hooks to enhance functionality
  useCalendarSync(view);
  useAutoScroll(calendarApi, view);

  // Handle date selection from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(new Date(date.getTime()));

      if (calendarApi) {
        try {
          calendarApi.gotoDate(date);
        } catch (error) {
          console.error("Error navigating to date:", error);
        }
      }
      setDatePickerOpen(false);
    }
  };

  // Function to handle zoom changes
  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
    
    // Apply zoom to calendars
    if (calendarRefs.current.length > 0) {
      try {
        const slotHeight = 40 * level;
        
        calendarRefs.current.forEach(calRef => {
          const api = calRef.getApi();
          if (api) {
            const calendarEl = api.el as HTMLElement;
            const slotEls = calendarEl.querySelectorAll('.fc-timegrid-slot');
            
            slotEls.forEach((slotEl) => {
              if (slotEl instanceof HTMLElement) {
                slotEl.style.height = `${slotHeight}px`;
                slotEl.style.minHeight = `${slotHeight}px`;
              }
            });
          }
        });
      } catch (error) {
        console.error("Error applying zoom:", error);
      }
    }
  };

  // Refresh calendar when events change
  useEffect(() => {
    if (calendarApi && events.length >= 0) {
      try {
        console.log("Refreshing calendar with events:", events.length);
        
        setTimeout(() => {
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
        }, 100);
      } catch (error) {
        console.error("Error refreshing calendar events:", error);
      }
    }
  }, [events, calendarApi]);

  // Base calendar style
  const calendarStyle = {
    height: '100%',
    minHeight: '500px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  // Display alert if no staff members
  if (staffMembers.length === 0) {
    return (
      <Alert className="m-6 border-yellow-300 bg-yellow-50">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Nessun operatore visibile</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Vai alla pagina Staff e assicurati che ci siano operatori attivi e con l'opzione 
          "Visibile in agenda" selezionata.
        </AlertDescription>
      </Alert>
    );
  }

  // Render appropriate view based on selected view
  if (view === 'dayGridMonth') {
    return (
      <MonthView
        staffMembers={staffMembers}
        events={events}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        commonConfig={{
          ...commonConfig,
          // Standard FullCalendar month view options
          height: 'auto',
          dayMaxEventRows: true,
          fixedWeekCount: false
        }}
        calendarRefs={calendarRefs}
        setCalendarApi={setCalendarApi}
        datePickerOpen={datePickerOpen}
        setDatePickerOpen={setDatePickerOpen}
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
      />
    );
  }

  return (
    <div style={calendarStyle}>
      <TimeGridView
        staffMembers={staffMembers}
        events={events}
        view={view}
        selectedDate={selectedDate}
        commonConfig={commonConfig}
        calendarRefs={calendarRefs}
        setCalendarApi={setCalendarApi}
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
      />
    </div>
  );
};

export default StaffCalendar;
