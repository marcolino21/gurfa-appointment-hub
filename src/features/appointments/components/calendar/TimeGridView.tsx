
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

  // Aggiungiamo un effetto per sincronizzare lo scorrimento dopo il rendering
  React.useEffect(() => {
    const synchronizeScrolling = () => {
      const timeGrids = document.querySelectorAll('.fc-timegrid-body');
      if (timeGrids.length <= 1) return;
      
      const mainElement = timeGrids[0] as HTMLElement;
      
      const scrollHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        const scrollTop = target.scrollTop;
        
        timeGrids.forEach((grid) => {
          const element = grid as HTMLElement;
          if (element !== target) {
            element.scrollTop = scrollTop;
          }
        });
      };
      
      mainElement.addEventListener('scroll', scrollHandler);
      
      return () => {
        mainElement.removeEventListener('scroll', scrollHandler);
      };
    };
    
    // Diamo tempo ai calendari di renderizzarsi completamente
    const timer = setTimeout(synchronizeScrolling, 300);
    return () => clearTimeout(timer);
  }, [staffMembers.length]);

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
        className="grid staff-grid-container"
        style={{
          gridTemplateColumns: `50px repeat(${staffMembers.length}, 1fr)`,
          height: 'calc(100% - 50px)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
        }}
      >
        {/* Colonna slot orari (prima colonna) */}
        <div className="bg-white h-full staff-column time-col" style={{ 
          paddingTop: 0, 
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          left: 0,
          zIndex: 5
        }}>
          {/* La colonna degli orari verrà mostrata solo dal primo calendario */}
          <div className="h-full time-only-column">
            {staffMembers.length > 0 && (
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView={view}
                initialDate={selectedDate}
                {...commonConfig}
                dayHeaderContent="" // Nascondiamo l'header del giorno
                allDaySlot={false}
                slotLabelClassNames="time-slot-label"
                dayCellContent={() => null} // Nascondiamo il contenuto delle celle dei giorni
                events={[]} // Nessun evento nella colonna orari
                headerToolbar={false}
              />
            )}
          </div>
        </div>
        {/* Colonne staff, vanno in sync-scroll */}
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="bg-white h-full staff-column staff-content-column">
            <div className="h-full calendar-container">
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={view}
                initialDate={selectedDate}
                {...commonConfig}
                slotLabelFormat={[]} // Nascondiamo le etichette degli slot orari nelle colonne dello staff
                slotLabelContent={() => null} // Nascondiamo il contenuto delle etichette degli slot orari
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
