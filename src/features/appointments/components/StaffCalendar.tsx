
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
  const [zoomLevel, setZoomLevel] = useState(1); // Nuovo stato per lo zoom

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
        } catch (error) {
          console.error("Error navigating to date:", error);
        }
      }
      setDatePickerOpen(false);
    }
  };

  // Nuova funzione per gestire lo zoom
  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
    
    // Applica lo zoom ai calendari
    if (calendarRefs.current.length > 0) {
      try {
        // Modifica l'altezza degli slot in base al livello di zoom
        const slotHeight = 40 * level; // Altezza slot di base * livello zoom
        
        calendarRefs.current.forEach(calRef => {
          const api = calRef.getApi();
          if (api) {
            // Trova tutti gli slot nel calendario e modifica l'altezza
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

  // Improved refresh of calendars after events update
  useEffect(() => {
    if (calendarApi && events.length >= 0) {
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

  // Se non ci sono staffMembers visibili, mostra un messaggio
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
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
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
      zoomLevel={zoomLevel}
      onZoomChange={handleZoomChange}
    />
  );
};

export default StaffCalendar;
