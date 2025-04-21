
import React, { useRef, useEffect, useState } from 'react';
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
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();
    
  // State to track grid initialization
  const [gridInitialized, setGridInitialized] = useState(false);

  // Improved date formatting with robust error handling
  const getFormattedDate = () => {
    try {
      // Explicit check again before formatting
      if (!(validSelectedDate instanceof Date) || isNaN(validSelectedDate.getTime())) {
        console.error('Invalid date detected before formatting:', validSelectedDate);
        return new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      
      return format(validSelectedDate, 'EEEE d MMMM yyyy', { locale: it });
    } catch (error) {
      console.error('Error formatting date with Italian locale:', error);
      try {
        return format(new Date(), 'EEEE d MMMM yyyy');
      } catch (fallbackError) {
        console.error('Fallback date formatting failed:', fallbackError);
        return new Date().toLocaleDateString();
      }
    }
  };

  // Setup calendar API for the first render
  useEffect(() => {
    if (calendarRefs.current && calendarRefs.current[0]) {
      const api = calendarRefs.current[0].getApi();
      if (api) {
        setCalendarApi(api);
      }
    }
  }, [staffMembers, calendarRefs, setCalendarApi]);
  
  // Set up synchronized grid columns after render
  useEffect(() => {
    if (staffMembers.length > 0 && !gridInitialized) {
      setGridInitialized(true);
      
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Force a layout recalculation to ensure proper alignment
          const calendarGridBody = document.querySelector('.calendar-grid-body');
          if (calendarGridBody) {
            calendarGridBody.classList.add('unified-calendar-grid');
          }
        } catch (error) {
          console.error("Error initializing grid layout:", error);
        }
      }, 50);
    }
  }, [staffMembers, gridInitialized]);

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
      
      {/* Calendar grid body with unified scrolling containers */}
      <div className="calendar-grid-body sync-scroll-container">
        {/* Fixed time column on the left */}
        <div className="calendar-time-col">
          <div className="calendar-time-inner">
            <FullCalendar
              key="time-col-calendar"
              plugins={[timeGridPlugin]}
              initialView="timeGridDay"
              initialDate={validSelectedDate}
              {...commonConfig}
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
        <div className="calendar-staff-cols unified-calendar-content">
          {staffMembers.length > 0 ? (
            <div className="staff-columns-wrapper" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
              height: '100%',
              width: '100%'
            }}>
              {staffMembers.map((staff, index) => (
                <div
                  key={staff.id}
                  className="calendar-staff-col"
                >
                  <FullCalendar
                    key={`staff-calendar-${staff.id}`}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    initialDate={validSelectedDate}
                    {...commonConfig}
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
          ) : (
            <div className="flex items-center justify-center flex-1 h-full text-gray-500">
              Nessun operatore visibile nel calendario. 
              Aggiungi operatori e imposta "Visibile in agenda" nelle impostazioni staff.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
