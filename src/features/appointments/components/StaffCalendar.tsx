
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

  // Preparazione delle risorse (staff) per il calendario
  const resources = staffMembers.map(staff => ({
    id: staff.id,
    title: `${staff.firstName} ${staff.lastName}`,
    color: staff.color
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
            // Sostituiamo il testo delle intestazioni con i nomi dello staff
            el.innerText = resource.title || '';
            
            // Aggiunge stile all'intestazione
            el.classList.add('fc-staff-header');
            
            // Aggiunge un colore di sfondo basato sul colore dello staff
            if (resource.color) {
              el.style.borderLeft = `3px solid ${resource.color}`;
            }
          }}
          viewDidMount={(arg) => {
            // Rimuove le date dai nomi delle colonne per sostituirle con i nomi dello staff
            if (view !== 'dayGridMonth') {
              const headerCells = document.querySelectorAll('.fc-col-header-cell');
              headerCells.forEach((cell: any) => {
                // Rimuove completamente la data dalla cella dell'intestazione
                const staffHeader = cell.querySelector('.fc-staff-header');
                if (staffHeader) {
                  // Sostituisci l'intero contenuto con il nome dello staff
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
