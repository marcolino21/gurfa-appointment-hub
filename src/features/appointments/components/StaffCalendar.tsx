
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
    color: staff.color || '#9b87f5'
  }));

  console.log("Resources created:", resources);

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
            // Custom resource header rendering
            const title = resource.title;
            // Use resource.extendedProps to access custom properties safely
            const resourceObj = resources.find(res => res.id === resource.id);
            const color = resourceObj?.color || '#9b87f5';
            
            // Create header with name
            const container = document.createElement('div');
            container.className = 'staff-label-container flex flex-col items-center p-2';
            
            // Add staff name
            const nameEl = document.createElement('div');
            nameEl.className = 'font-medium text-sm';
            nameEl.textContent = title;
            nameEl.style.borderLeft = `3px solid ${color}`;
            nameEl.style.paddingLeft = '8px';
            nameEl.style.width = '100%';
            nameEl.style.textAlign = 'center';
            
            container.appendChild(nameEl);
            
            // Clear existing content and add new layout
            el.innerHTML = '';
            el.appendChild(container);
          }}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        />
      )}
    </div>
  );
};

export default StaffCalendar;
