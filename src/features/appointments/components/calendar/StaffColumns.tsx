
import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';

interface StaffColumnsProps {
  staffMembers: StaffMember[];
  events: any[];
  selectedDate: Date;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
}

export const StaffColumns: React.FC<StaffColumnsProps> = ({
  staffMembers,
  events,
  selectedDate,
  commonConfig,
  calendarRefs,
  setCalendarApi
}) => {
  const { applyBlockedTimeStyles } = useCalendarBlockTime();
  
  // Apply block time styles after calendar rendering is complete and when events change
  useEffect(() => {
    const timers = [
      setTimeout(applyBlockedTimeStyles, 100),
      setTimeout(applyBlockedTimeStyles, 300),
      setTimeout(applyBlockedTimeStyles, 600)
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [events, applyBlockedTimeStyles]);

  // Also apply styles when the component mounts to ensure they're applied
  useEffect(() => {
    applyBlockedTimeStyles();
  }, [applyBlockedTimeStyles]);

  if (staffMembers.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 h-full text-gray-500">
        Nessun operatore visibile nel calendario. 
        Aggiungi operatori e imposta "Visibile in agenda" nelle impostazioni staff.
      </div>
    );
  }

  return (
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
          data-staff-id={staff.id}
        >
          <FullCalendar
            key={`staff-calendar-${staff.id}`}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            initialDate={selectedDate}
            {...commonConfig}
            dayHeaderContent={() => null}
            slotLabelContent={() => null}
            events={events.filter(event => event.resourceId === staff.id)}
            headerToolbar={false}
            height="100%"
            eventClassNames={(arg) => {
              // Add extra class for blocked time events
              if (arg.event.extendedProps?.isBlockedTime || 
                  arg.event.classNames?.includes('blocked-time-event') ||
                  arg.event.display === 'background') {
                return ['blocked-time-event', 'fc-non-interactive'];
              }
              return [];
            }}
            eventDidMount={(info) => {
              // Add special handling for blocked time events
              if (info.event.extendedProps?.isBlockedTime || 
                  info.event.classNames?.includes('blocked-time-event') ||
                  info.event.display === 'background') {
                info.el.classList.add('blocked-time-event');
                info.el.classList.add('fc-non-interactive');
                
                // Create tooltip for blocked time
                const tooltip = document.createElement('div');
                tooltip.className = 'calendar-tooltip';
                
                let tooltipContent = 'Operatore non disponibile';
                if (info.event.extendedProps?.reason) {
                  tooltipContent += `: ${info.event.extendedProps.reason}`;
                }
                
                tooltip.innerText = tooltipContent;
                info.el.appendChild(tooltip);
              }
              
              // Call the original eventDidMount if provided
              if (commonConfig.eventDidMount) {
                commonConfig.eventDidMount(info);
              }
            }}
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
  );
};
