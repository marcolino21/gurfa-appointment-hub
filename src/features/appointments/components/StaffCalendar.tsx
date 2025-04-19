
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
  const [renderedStaff, setRenderedStaff] = useState<StaffMember[]>([]);

  // Ensure staffMembers are properly loaded
  useEffect(() => {
    console.log("Staff members updated in StaffCalendar:", staffMembers);
    setRenderedStaff(staffMembers);
  }, [staffMembers]);

  // Early return if no staff members are visible
  if (staffMembers.length === 0) {
    return (
      <div className="h-[calc(100vh-320px)] flex items-center justify-center flex-col">
        <p className="text-xl font-medium mb-2">Nessuno staff visibile in agenda</p>
        <p className="text-muted-foreground">
          Vai alla pagina Staff e seleziona "Visibile in agenda" per i membri che vuoi visualizzare.
        </p>
      </div>
    );
  }

  console.log("Rendering calendar with view:", view);
  console.log("Staff members in view:", staffMembers);
  console.log("Events in calendar:", events);

  // Configuration for all calendar views
  const commonConfig = {
    locale: itLocale,
    slotMinTime: '09:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    selectable: true,
    select: onDateSelect,
    eventClick: onEventClick,
    editable: true,
    droppable: true,
    eventDrop: onEventDrop,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    slotDuration: '00:30:00',
  };

  // Special configuration for day view - create separate columns for each staff member
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
    return {
      ...event,
      title: view === 'timeGridWeek' ? 
        `${event.title} (${staffMember ? staffMember.firstName : 'Staff'})` : 
        event.title
    };
  });

  // For week and month views, use the standard plugins
  return (
    <div className="h-[calc(100vh-320px)]">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={view}
        {...commonConfig}
        events={enhancedEvents}
      />
    </div>
  );
};

export default StaffCalendar;
