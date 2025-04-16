
import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import itLocale from '@fullcalendar/core/locales/it';
import { StaffMember, Appointment } from '@/types';
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
    title: `${staff.firstName} ${staff.lastName}`,
    color: staff.color,
    extendedProps: {
      color: staff.color,
      initials: getInitials(staff.firstName, staff.lastName),
      firstName: staff.firstName,
      lastName: staff.lastName
    }
  }));

  // Quando non ci sono membri dello staff visibili
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

  // Create staff footers after the calendar renders
  useEffect(() => {
    if (view === 'timeGridDay' || view === 'timeGridWeek') {
      const addStaffFooters = () => {
        // Wait a bit for the calendar to render completely
        setTimeout(() => {
          const columns = document.querySelectorAll('.fc-timegrid-col');
          
          columns.forEach((column, index) => {
            // Check if this column has a corresponding staff member
            const staff = resources[index];
            if (!staff) return;
            
            // Check if footer already exists
            if (column.querySelector('.staff-footer-content')) return;
            
            const resourceData = staff.extendedProps as {
              color?: string;
              initials?: string;
              firstName?: string;
              lastName?: string;
            };
            
            // Create footer content
            const footerContent = document.createElement('div');
            footerContent.className = 'staff-footer-content';
            
            // Add initials circle
            const initialsCircle = document.createElement('div');
            initialsCircle.className = 'staff-initials-circle';
            initialsCircle.innerText = resourceData.initials || '';
            initialsCircle.style.backgroundColor = resourceData.color || '#9b87f5';
            
            // Add staff name
            const staffName = document.createElement('div');
            staffName.className = 'staff-name';
            staffName.innerText = `${resourceData.firstName || ''} ${resourceData.lastName || ''}`;
            
            // Append elements
            footerContent.appendChild(initialsCircle);
            footerContent.appendChild(staffName);
            
            // Create footer container
            const footer = document.createElement('div');
            footer.className = 'staff-column-footer';
            footer.appendChild(footerContent);
            
            // Add footer to the column
            column.appendChild(footer);
          });
        }, 200);
      };
      
      // Add footers when view changes or calendar refreshes
      addStaffFooters();
      
      // Create a mutation observer to detect when the calendar changes
      const observer = new MutationObserver(addStaffFooters);
      const targetNode = document.querySelector('.fc-timegrid-body');
      if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [view, resources]);

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
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          resourceLabelDidMount={({ el, resource }) => {
            const resourceData = resource.extendedProps as { 
              color?: string,
              initials?: string,
              firstName?: string,
              lastName?: string
            } || {};
            
            // Create a custom header layout with initials and name
            const headerContent = document.createElement('div');
            headerContent.className = 'staff-header-content';
            
            // Add initials circle
            const initialsCircle = document.createElement('div');
            initialsCircle.className = 'staff-initials-circle';
            initialsCircle.innerText = resourceData.initials || '';
            initialsCircle.style.backgroundColor = resourceData.color || '#9b87f5';
            
            // Add staff name div
            const staffName = document.createElement('div');
            staffName.className = 'staff-name';
            staffName.innerText = `${resourceData.firstName || ''} ${resourceData.lastName || ''}`;
            
            // Append elements
            headerContent.appendChild(initialsCircle);
            headerContent.appendChild(staffName);
            
            // Clear existing content and add our custom content
            el.innerHTML = '';
            el.appendChild(headerContent);
            el.classList.add('fc-staff-header');
          }}
          viewDidMount={(arg) => {
            // Rimuove le date dai nomi delle colonne per sostituirle con i nomi dello staff
            if (view === 'timeGridDay' || view === 'timeGridWeek') {
              const headerCells = document.querySelectorAll('.fc-col-header-cell');
              headerCells.forEach((cell: any) => {
                // Rimuove completamente la data dalla cella dell'intestazione
                const staffHeader = cell.querySelector('.fc-staff-header');
                if (staffHeader) {
                  cell.querySelector('.fc-scrollgrid-sync-inner').innerHTML = '';
                  cell.querySelector('.fc-scrollgrid-sync-inner').appendChild(staffHeader);
                }
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default StaffCalendar;
