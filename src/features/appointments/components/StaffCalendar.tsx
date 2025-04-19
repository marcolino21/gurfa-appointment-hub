import React, { useRef, useEffect } from 'react';
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

  // Get initials for each staff member
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Preparazione delle risorse (staff) per il calendario
  const resources = staffMembers.map(staff => ({
    id: staff.id,
    title: staff.firstName,  // Show only first name in header
    extendedProps: {
      fullName: `${staff.firstName} ${staff.lastName}`,
      initials: getInitials(staff.firstName, staff.lastName),
      color: staff.color
    }
  }));

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

  return (
    <div className="h-[calc(100vh-320px)]">
      {view === 'dayGridMonth' ? (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          locale={itLocale}
          events={events}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          selectable={true}
          select={onDateSelect}
          eventClick={onEventClick}
        />
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          locale={itLocale}
          resources={resources}
          events={events}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          selectable={true}
          select={onDateSelect}
          eventClick={onEventClick}
          editable={true}
          droppable={true}
          eventDrop={onEventDrop}
          resourceLabelDidMount={({ el, resource }) => {
            const resourceData = resource.extendedProps as { 
              fullName: string;
              initials: string;
              color: string;
            };
            
            // Create header with initials circle and full name
            const headerContent = document.createElement('div');
            headerContent.className = 'flex flex-col items-center p-2 w-full';
            
            // Add initials circle
            const initialsCircle = document.createElement('div');
            initialsCircle.className = 'w-10 h-10 rounded-full flex items-center justify-center text-white mb-1';
            initialsCircle.style.backgroundColor = resourceData.color || '#9b87f5';
            initialsCircle.innerText = resourceData.initials;
            
            // Add staff name
            const staffName = document.createElement('div');
            staffName.className = 'text-sm font-medium';
            staffName.innerText = resourceData.fullName;
            
            headerContent.appendChild(initialsCircle);
            headerContent.appendChild(staffName);
            
            // Clear existing content and add new layout
            el.innerHTML = '';
            el.appendChild(headerContent);
            el.className = 'fc-resource-header';
          }}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        />
      )}
    </div>
  );
};

export default StaffCalendar;
