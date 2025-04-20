
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
  const calendarRefs = useRef<any[]>([]);
  const { toast } = useToast();
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Initialize calendar refs array
  useEffect(() => {
    calendarRefs.current = calendarRefs.current.slice(0, staffMembers.length);
  }, [staffMembers]);

  // Ensure synchronized scrolling for all calendars
  useEffect(() => {
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute');
      
      if (scrollContainers.length <= 1) return;
      
      const handleScroll = (event: Event) => {
        const scrollingElement = event.target as HTMLElement;
        const scrollTop = scrollingElement.scrollTop;
        
        scrollContainers.forEach((container) => {
          const element = container as HTMLElement;
          if (element !== scrollingElement) {
            element.scrollTop = scrollTop;
          }
        });
      };
      
      scrollContainers.forEach((container) => {
        container.addEventListener('scroll', handleScroll);
      });
      
      return () => {
        scrollContainers.forEach((container) => {
          container.removeEventListener('scroll', handleScroll);
        });
      };
    };
    
    // Apply scroll synchronization after components have rendered
    const timer = setTimeout(synchronizeScrolling, 200);
    
    return () => {
      clearTimeout(timer);
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
    headerToolbar: false as const, // Fixed: Use "as const" to properly type this
    slotDuration: '00:30:00',
    height: 'calc(100vh - 350px)',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false
  };

  // Auto-scroll to current time
  useEffect(() => {
    if (calendarApi && (view === 'timeGridDay' || view === 'timeGridWeek')) {
      const now = new Date();
      const hours = now.getHours();
      
      if (hours >= 9 && hours < 20) {
        const scrollPosition = (hours - 9) * 40 * 2 - 200;
        
        setTimeout(() => {
          const scrollers = document.querySelectorAll('.fc-scroller-liquid-absolute');
          scrollers.forEach((scroller) => {
            (scroller as HTMLElement).scrollTop = scrollPosition;
          });
        }, 200);
      }
    }
  }, [calendarApi, view]);

  // Handle date selection from popover calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      if (calendarApi) {
        calendarApi.gotoDate(date);
        
        // If selecting date in week view, may want to switch to day view
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

  // Format date display
  const getFormattedDate = () => {
    if (!selectedDate) return format(new Date(), 'EEEE d MMMM yyyy', { locale: it });
    return format(selectedDate, 'EEEE d MMMM yyyy', { locale: it });
  };

  // Month view with staff columns
  if (view === 'dayGridMonth') {
    return (
      <div className="h-[calc(100vh-320px)] staff-calendar-container">
        {/* Centralized date header */}
        <div className="month-view-date-header">
          {format(selectedDate || new Date(), 'MMMM yyyy', { locale: it })}
        </div>
        
        {/* Date picker */}
        <div className="mb-2 flex justify-center">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button className="bg-white border border-gray-300 rounded px-4 py-1 text-sm font-medium hover:bg-gray-50">
                {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: it }) : 'Seleziona data'}
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
        
        {/* Staff columns */}
        <div className="grid sync-scroll-container" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 80px)',
          gap: '1px',
          backgroundColor: '#e5e7eb'
        }}>
          {staffMembers.map((staff, index) => (
            <div key={staff.id} className="bg-white h-full staff-column">
              {/* Staff header */}
              <div 
                className="staff-column-header"
                style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
              >
                {staff.firstName} {staff.lastName}
              </div>
              
              {/* Staff calendar */}
              <div className="h-[calc(100%-42px)] custom-month-view">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  initialDate={selectedDate}
                  {...commonConfig}
                  events={events.filter(event => event.resourceId === staff.id)}
                  ref={(el) => {
                    if (el) {
                      calendarRefs.current[index] = el;
                      if (index === 0) setCalendarApi(el.getApi());
                    }
                  }}
                  eventContent={(arg) => (
                    <div className="text-xs overflow-hidden whitespace-nowrap">
                      {arg.event.title}
                    </div>
                  )}
                  dayCellDidMount={(info) => {
                    // Display only the day number for better clarity
                    const dateNum = document.createElement('div');
                    dateNum.className = 'text-xs font-medium text-gray-500';
                    dateNum.textContent = info.date.getDate().toString();
                    
                    const cellContent = info.el.querySelector('.fc-daygrid-day-top');
                    if (cellContent) {
                      cellContent.innerHTML = '';
                      cellContent.appendChild(dateNum);
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

  // Week view with staff columns
  if (view === 'timeGridWeek') {
    return (
      <div className="h-[calc(100vh-320px)] staff-calendar-container">
        {/* Centralized date header for week view */}
        <div className="week-view-date-header">
          {format(selectedDate || new Date(), 'MMMM yyyy', { locale: it })}
        </div>
        
        {/* Date picker */}
        <div className="mb-2 flex justify-center">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button className="bg-white border border-gray-300 rounded px-4 py-1 text-sm font-medium hover:bg-gray-50">
                {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: it }) : 'Seleziona data'}
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
        
        {/* Staff columns */}
        <div className="grid sync-scroll-container" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 80px)',
          gap: '1px',
          backgroundColor: '#e5e7eb'
        }}>
          {staffMembers.map((staff, index) => (
            <div key={staff.id} className="bg-white h-full staff-column">
              {/* Staff header */}
              <div 
                className="staff-column-header"
                style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
              >
                {staff.firstName} {staff.lastName}
              </div>
              
              {/* Staff calendar */}
              <div className="h-[calc(100%-42px)]">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  initialDate={selectedDate}
                  {...commonConfig}
                  events={events.filter(event => event.resourceId === staff.id)}
                  ref={(el) => {
                    if (el) {
                      calendarRefs.current[index] = el;
                      if (index === 0) setCalendarApi(el.getApi());
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

  // Day view with staff columns
  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-container">
      {/* Centralized date header */}
      <div className="staff-calendar-header">
        {getFormattedDate()}
      </div>
      
      {/* Staff columns */}
      <div className="grid sync-scroll-container" style={{ 
        gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
        height: 'calc(100% - 50px)',
        gap: '1px',
        backgroundColor: '#e5e7eb'
      }}>
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="bg-white h-full staff-column">
            {/* Staff header */}
            <div 
              className="staff-column-header"
              style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
            >
              {staff.firstName} {staff.lastName}
            </div>
            
            {/* Staff calendar */}
            <div className="h-[calc(100%-42px)]">
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                initialDate={selectedDate}
                {...commonConfig}
                events={events.filter(event => event.resourceId === staff.id)}
                ref={(el) => {
                  if (el) {
                    calendarRefs.current[index] = el;
                    if (index === 0) setCalendarApi(el.getApi());
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffCalendar;
