
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';

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
