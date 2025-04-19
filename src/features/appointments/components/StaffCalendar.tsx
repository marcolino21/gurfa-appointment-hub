
import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
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

  console.log("Staff members in StaffCalendar:", staffMembers);

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

  // Create resource objects for each staff member
  const resources = staffMembers.map(staff => ({
    id: staff.id,
    title: `${staff.firstName} ${staff.lastName}`,
    businessHours: {
      startTime: '09:00',
      endTime: '20:00',
      daysOfWeek: [1, 2, 3, 4, 5, 6] // Lunedì a Sabato
    }
  }));

  // Configuration for all calendar views
  const commonConfig = {
    locale: itLocale,
    resources: view !== 'dayGridMonth' ? resources : undefined,
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
    events: events,
  };

  return (
    <div className="h-[calc(100vh-320px)]">
      <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimeGridPlugin, timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={view}
        {...commonConfig}
      />
    </div>
  );
};

export default StaffCalendar;
