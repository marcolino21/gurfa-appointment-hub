
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
  // Refs per il sync scroll
  const timeColRef = useRef<HTMLDivElement>(null);
  const scrollColRef = useRef<HTMLDivElement>(null);

  // Create a safer version of the common config by explicitly setting locale
  const safeCommonConfig = {
    ...commonConfig,
    locale: 'it', // Use string-based locale identifier instead of object
    timeZone: 'local', // Ensure explicit timezone setting
  };

  // In alto: la data (ad es. "Lunedì 22 Aprile 2024") con improved error handling
  const getFormattedDate = () => {
    try {
      // Ensure we always have a valid date object
      const dateToFormat = selectedDate || new Date();
      
      // Use a safer way to format the date that doesn't rely on locale objects
      try {
        // First try with Italian locale if available
        return format(dateToFormat, 'EEEE d MMMM yyyy', { locale: it });
      } catch (localeError) {
        console.warn('Error using Italian locale, falling back to default:', localeError);
        // Fallback to default locale if Italian isn't available
        return format(dateToFormat, 'EEEE d MMMM yyyy');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      // Return a simple date string as fallback
      return selectedDate?.toLocaleDateString() || new Date().toLocaleDateString();
    }
  };

  // Sincronizza lo scroll verticale delle colonne staff con la colonna orari
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
      {/* Data in alto */}
      <div className="staff-calendar-header">
        {getFormattedDate()}
      </div>
      
      {/* Header staff: una sola riga, ogni nome centrato sopra la propria colonna */}
      <div className="staff-header-row" style={{
        display: 'grid',
        gridTemplateColumns: `50px repeat(${staffMembers.length}, 1fr)`
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
      
      {/* Corpo agenda: una sola colonna orari fissa + colonne staff scrollabili assieme */}
      <div className="calendar-grid-body" style={{ display: "flex", height: "100%", minHeight: 0, flex: 1 }}>
        {/* Colonna orari sulla sinistra (sticky) */}
        <div
          className="calendar-time-col"
          ref={timeColRef}
          style={{
            minWidth: 50, maxWidth: 50, flex: "0 0 50px", overflow: "hidden", position: "relative", zIndex: 5,
            height: "100%"
          }}
        >
          <div className="calendar-time-inner">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView={view}
              initialDate={selectedDate || new Date()}
              {...safeCommonConfig}
              dayHeaderContent="" // niente header giorno
              allDaySlot={false}
              slotLabelClassNames="time-slot-label"
              slotLabelContent={undefined}
              slotLabelFormat={undefined}
              dayCellContent={() => null}
              events={[]}
              headerToolbar={false}
              height="100%"
            />
          </div>
        </div>
        
        {/* Colonne staff scrollabili orizzontalmente */}
        <div
          className="calendar-staff-cols"
          ref={scrollColRef}
          style={{
            display: "flex",
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
            height: "100%"
          }}
        >
          {staffMembers.map((staff, index) => (
            <div
              key={staff.id}
              className="calendar-staff-col"
              style={{
                minWidth: 200, flex: "1 1 0", background: "#fff",
                borderLeft: "1px solid #e5e7eb"
              }}
            >
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={view}
                initialDate={selectedDate || new Date()} 
                {...safeCommonConfig}
                dayHeaderContent="" // no header giorno
                slotLabelFormat={[]} // nascondi etichette orarie nelle colonne staff
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
