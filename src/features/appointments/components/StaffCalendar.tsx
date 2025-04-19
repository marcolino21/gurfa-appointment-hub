
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

  // Configuration for all calendar views
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
    stickyHeaderDates: true
  };

  useEffect(() => {
    if (calendarApi) {
      calendarApi.setOption('scrollTimeReset', false);
    }
  }, [calendarApi]);

  // Special handling for day view with staff columns
  if (view === 'timeGridDay') {
    return (
      <div className="h-[calc(100vh-320px)]">
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
          height: '100%',
          gap: '1px',
          backgroundColor: '#e5e7eb'
        }}>
          {staffMembers.map((staff) => (
            <div key={staff.id} className="bg-white h-full">
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
                    if (ref) {
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

  // Handle week view - add staff names to event titles
  const enhancedEvents = events.map(event => {
    const staffMember = staffMembers.find(staff => staff.id === event.resourceId);
    const formattedTitle = staffMember ? 
      `${staffMember.firstName} ${staffMember.lastName} - ${event.title}` :
      event.title;
    return {
      ...event,
      title: formattedTitle
    };
  });

  // For week and month views
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
        events={enhancedEvents}
        dateClick={view === 'dayGridMonth' ? (info) => {
          if (calendarApi) {
            calendarApi.changeView('timeGridDay', info.dateStr);
          }
        } : undefined}
      />
    </div>
  );
};

export default StaffCalendar;
