
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import itLocale from '@fullcalendar/core/locales/it';
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
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
  const calendarRef = useRef<any>(null);
  const { toast } = useToast();
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Ensure all staff columns scroll together in all views
  useEffect(() => {
    // Unified scrolling function that works across all views
    const syncScroll = () => {
      const containers = document.querySelectorAll('.fc-scroller-liquid-absolute');
      
      if (containers.length <= 1) return;
      
      containers.forEach((container) => {
        container.removeEventListener('scroll', handleScroll);
        container.addEventListener('scroll', handleScroll);
      });
    };
    
    // Handle scroll event
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollLeft = target.scrollLeft;
      
      document.querySelectorAll('.fc-scroller-liquid-absolute').forEach((el) => {
        if (el !== target) {
          (el as HTMLElement).scrollTop = scrollTop;
          (el as HTMLElement).scrollLeft = scrollLeft;
        }
      });
    };
    
    // Apply synchronized scrolling
    setTimeout(syncScroll, 200);
    
    // Clean up event listeners
    return () => {
      document.querySelectorAll('.fc-scroller-liquid-absolute').forEach((el) => {
        el.removeEventListener('scroll', handleScroll);
      });
    };
  }, [view, staffMembers]);

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
    headerToolbar: {
      left: 'prev,next',
      center: 'title today',
      right: ''
    },
    slotDuration: '00:30:00',
    height: 'calc(100vh - 320px)',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false
  };

  useEffect(() => {
    if (calendarApi) {
      calendarApi.setOption('scrollTimeReset', false);
      
      // Center the current time in view by scrolling to a calculated position
      if (view === 'timeGridDay' || view === 'timeGridWeek') {
        const now = new Date();
        const hours = now.getHours();
        
        // If within business hours, scroll to center the current time
        if (hours >= 9 && hours < 20) {
          // Calculate position: each hour is 40px high (from CSS)
          // Subtract some pixels to center in viewport
          const scrollPosition = (hours - 9) * 40 * 2 - 200;
          setTimeout(() => {
            const scrollers = document.querySelectorAll('.fc-scroller-liquid-absolute');
            scrollers.forEach(scroller => {
              (scroller as HTMLElement).scrollTop = scrollPosition;
            });
          }, 200);
        }
      }
    }
  }, [calendarApi, view]);

  // Handle date selection from the popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      if (calendarApi) {
        calendarApi.gotoDate(date);
        
        // Switch to day view when a date is selected
        if (view === 'timeGridWeek') {
          // If we have a parent component handling view changes, notify it
          const tabsTrigger = document.querySelector('[value="day"]') as HTMLElement;
          if (tabsTrigger) {
            setTimeout(() => tabsTrigger.click(), 100);
          }
        }
      }
      
      setDatePickerOpen(false);
    }
  };

  // Special handling for week view with date picker
  if (view === 'timeGridWeek') {
    return (
      <div className="h-[calc(100vh-320px)]">
        <div className="mb-2 flex justify-center">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button className="bg-white border border-gray-300 rounded px-4 py-1 text-sm font-medium hover:bg-gray-50">
                {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: it }) : 'Seleziona data'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid sync-scroll-container" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 40px)',
          gap: '1px',
          backgroundColor: '#e5e7eb'
        }}>
          {staffMembers.map((staff) => (
            <div key={staff.id} className="bg-white h-full staff-column">
              <div 
                className="text-center font-medium p-2 border-b"
                style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
              >
                {staff.firstName} {staff.lastName}
              </div>
              <div className="h-[calc(100%-42px)]">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGrid"
                  {...commonConfig}
                  events={events.filter(event => event.resourceId === staff.id)}
                  headerToolbar={false}
                  ref={(ref) => {
                    if (ref && !calendarApi) {
                      setCalendarApi(ref.getApi());
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Special handling for day view with staff columns
  if (view === 'timeGridDay') {
    return (
      <div className="h-[calc(100vh-320px)]">
        <div className="mb-2 flex justify-center">
          <div className="text-center font-medium py-1">
            {selectedDate ? format(selectedDate || new Date(), 'EEEE d MMMM yyyy', { locale: it }) : format(new Date(), 'EEEE d MMMM yyyy', { locale: it })}
          </div>
        </div>
        
        <div className="grid sync-scroll-container" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 40px)',
          gap: '1px',
          backgroundColor: '#e5e7eb'
        }}>
          {staffMembers.map((staff) => (
            <div key={staff.id} className="bg-white h-full staff-column">
              <div 
                className="text-center font-medium p-2 border-b"
                style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
              >
                {staff.firstName} {staff.lastName}
              </div>
              <div className="h-[calc(100%-42px)]">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGrid"
                  {...commonConfig}
                  events={events.filter(event => event.resourceId === staff.id)}
                  headerToolbar={false}
                  ref={(ref) => {
                    if (ref && !calendarApi) {
                      setCalendarApi(ref.getApi());
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Month view with date click functionality to open day view
  return (
    <div className="h-[calc(100vh-320px)]">
      <FullCalendar
        ref={(ref) => {
          if (ref) {
            setCalendarApi(ref.getApi());
          }
        }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={view}
        {...commonConfig}
        events={events}
        dateClick={(info) => {
          if (calendarApi) {
            // On date click in month view, switch to day view for that date
            calendarApi.changeView('timeGridDay', info.dateStr);
            
            // Set selected date
            setSelectedDate(new Date(info.dateStr));
            
            // If we have a parent component handling view changes, notify it
            const tabsTrigger = document.querySelector('[value="day"]') as HTMLElement;
            if (tabsTrigger) {
              tabsTrigger.click();
            }
          }
        }}
        eventContent={(arg) => {
          // Add staff name to month view events
          if (view === 'dayGridMonth' && arg.event.extendedProps?.staffName) {
            const staffName = arg.event.extendedProps.staffName;
            return (
              <div>
                <div className="text-xs font-medium">{staffName}</div>
                <div className="text-xs">{arg.event.title}</div>
              </div>
            );
          }
          return arg.event.title;
        }}
      />
    </div>
  );
};

export default StaffCalendar;
