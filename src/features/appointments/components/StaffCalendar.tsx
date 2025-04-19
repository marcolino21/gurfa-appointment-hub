
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import itLocale from '@fullcalendar/core/locales/it';
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
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
  
  // Ensure all staff columns scroll together in day view
  useEffect(() => {
    if (view === 'timeGridDay' || view === 'timeGridWeek') {
      const staffColumns = document.querySelectorAll('.staff-column .fc-scroller');
      
      if (staffColumns.length > 1) {
        const handleScroll = (event: Event) => {
          const scrollTop = (event.target as HTMLElement).scrollTop;
          
          staffColumns.forEach((column) => {
            if (column !== event.target) {
              (column as HTMLElement).scrollTop = scrollTop;
            }
          });
        };
        
        staffColumns.forEach((column) => {
          column.addEventListener('scroll', handleScroll);
        });
        
        return () => {
          staffColumns.forEach((column) => {
            column.removeEventListener('scroll', handleScroll);
          });
        };
      }
    }
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
      
      // Center the current date in day view by scrolling to a calculated position
      if (view === 'timeGridDay') {
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

  // Special handling for day view and week view with staff columns
  if (view === 'timeGridDay' || view === 'timeGridWeek') {
    return (
      <div className="h-[calc(100vh-320px)]">
        <div className="grid sync-scroll-container" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: '100%',
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
            
            // If we have a parent component handling view changes, notify it
            // This would typically be handled by AppointmentCalendarView
            const tabsTrigger = document.querySelector('[value="day"]') as HTMLElement;
            if (tabsTrigger) {
              tabsTrigger.click();
            }
          }
        }}
      />
    </div>
  );
};

export default StaffCalendar;
