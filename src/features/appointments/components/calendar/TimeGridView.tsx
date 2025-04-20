
import React from 'react';
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
  const getFormattedDate = () => {
    if (!selectedDate) return format(new Date(), 'EEEE d MMMM yyyy', { locale: it });
    return format(selectedDate, 'EEEE d MMMM yyyy', { locale: it });
  };

  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-container">
      <div className="staff-calendar-header">
        {getFormattedDate()}
      </div>
      
      <div className="grid sync-scroll-container" style={{ 
        gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
        height: 'calc(100% - 50px)',
        gap: '1px',
        backgroundColor: '#e5e7eb'
      }}>
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="bg-white h-full staff-column">
            <div 
              className="staff-column-header"
              style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
            >
              {staff.firstName} {staff.lastName}
            </div>
            
            <div className="h-[calc(100%-42px)]">
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={view}
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
