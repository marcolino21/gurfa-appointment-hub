
import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import '../../styles/index.css';
import { StaffMember } from '@/types';

interface TimeGridViewProps {
  staffMembers: StaffMember[];
  events: any[];
  view: 'timeGridDay' | 'timeGridWeek';
  selectedDate?: Date;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
}

export const TimeGridView: React.FC<TimeGridViewProps> = ({
  staffMembers,
  events,
  view,
  selectedDate,
  commonConfig,
  calendarRefs,
  setCalendarApi,
}) => {
  // Refs for syncing scrolling
  const timeColRef = useRef<HTMLDivElement>(null);
  const scrollColRef = useRef<HTMLDivElement>(null);

  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? selectedDate
    : new Date();

  // Improved date formatting with robust error handling
  const getFormattedDate = () => {
    try {
      return format(validSelectedDate, 'EEEE d MMMM yyyy', { locale: it });
    } catch (error) {
      console.error('Error formatting date with Italian locale:', error);
      try {
        return format(validSelectedDate, 'EEEE d MMMM yyyy');
      } catch (fallbackError) {
        console.error('Fallback date formatting failed:', fallbackError);
        return validSelectedDate.toLocaleDateString();
      }
    }
  };

  // Make sure we always have valid common config settings with explicit formats
  const safeCommonConfig = {
    ...commonConfig,
    locale: 'it',
    timeZone: 'local',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: { 
      weekday: 'long', 
      day: 'numeric',
      month: 'short'
    }
  };

  // Synchronize vertical scrolling between the time column and staff columns
  useEffect(() => {
    const timeEl = timeColRef.current;
    const scrollEl = scrollColRef.current;
    if (!timeEl || !scrollEl) return;

    let isSyncing = false;

    const onScroll = () => {
      if (isSyncing) return;
      isSyncing = true;
      timeEl.scrollTop = scrollEl.scrollTop;
      setTimeout(() => { isSyncing = false; }, 1);
    };
    
    scrollEl.addEventListener("scroll", onScroll);
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
    };
  }, [staffMembers.length]);

  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-block">
      {/* Date header */}
      <div className="staff-calendar-header">
        {getFormattedDate()}
      </div>
      
      {/* Staff header row */}
      <div className="staff-header-row" style={{
        display: 'grid',
        gridTemplateColumns: `80px repeat(${staffMembers.length}, 1fr)`
      }}>
        <div className="time-col-header"></div>
        {staffMembers.map(staff => (
          <div
            key={staff.id}
            className="staff-header-col"
            style={{ borderLeft: `3px solid ${staff.color || "#9b87f5"}`}}
          >
            <span className="staff-name">
              {staff.firstName} {staff.lastName}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid body with fixed time column and scrollable staff columns */}
      <div className="calendar-grid-body">
        {/* Fixed time column on the left */}
        <div
          className="calendar-time-col"
          ref={timeColRef}
        >
          <div className="calendar-time-inner">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView={view}
              initialDate={validSelectedDate}
              {...safeCommonConfig}
              dayHeaderContent={() => null}
              allDaySlot={false}
              slotLabelClassNames="time-slot-label"
              dayCellContent={() => null}
              events={[]}
              headerToolbar={false}
              height="100%"
            />
          </div>
        </div>
        
        {/* Scrollable staff columns */}
        <div
          className="calendar-staff-cols"
          ref={scrollColRef}
        >
          {staffMembers.map((staff, index) => (
            <div
              key={staff.id}
              className="calendar-staff-col"
            >
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={view}
                initialDate={validSelectedDate}
                {...safeCommonConfig}
                dayHeaderContent={() => null}
                slotLabelContent={() => null}
                events={events.filter(event => event.resourceId === staff.id)}
                headerToolbar={false}
                height="100%"
                ref={el => {
                  if (el) {
                    calendarRefs.current[index] = el;
                    if (index === 0) setCalendarApi(el.getApi());
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
