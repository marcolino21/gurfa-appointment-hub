
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
      {/* Data in alto */}
      <div className="staff-calendar-header">
        {getFormattedDate()}
      </div>
      {/* Header staff (fisso sopra) */}
      <div className="grid" style={{
        gridTemplateColumns: `50px repeat(${staffMembers.length}, 1fr)`,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div className="text-center font-medium text-sm bg-white sticky top-0 z-10">Ora</div>
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="text-center font-medium text-sm px-1 truncate bg-white sticky top-0 z-10"
            style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
          >
            {staff.firstName} {staff.lastName}
          </div>
        ))}
      </div>
      {/* Griglia slot + colonne staff: scroll sincronizzato */}
      <div
        className="grid sync-scroll-container"
        style={{
          gridTemplateColumns: `50px repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 50px)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
        }}
      >
        {/* Colonna slot orari (prima colonna, orari verticali) */}
        <div className="bg-white h-full staff-column time-col" style={{ paddingTop: 0, borderRight: '1px solid #e5e7eb' }}>
          {/* FullCalendar con solo asse orario (nascosto) */}
          {/* Qui potrebbe essere aggiunto uno slot times se serve */}
        </div>
        {/* Colonne staff, vanno in sync-scroll-container */}
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="bg-white h-full staff-column">
            <div
              className="staff-column-header"
              style={{
                borderLeft: `3px solid ${staff.color || '#9b87f5'}`,
                display: 'none' // Rimossa la riga del giorno sotto il nome staff
              }}
            >
              {/* Intestazione staff duplicata: ora viene nascosta (display: none) */}
            </div>
            <div className="h-full">
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
