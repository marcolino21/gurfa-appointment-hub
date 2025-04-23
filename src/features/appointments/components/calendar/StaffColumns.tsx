
import React, { useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
import { useAuth } from '@/contexts/AuthContext';

interface StaffColumnsProps {
  staffMembers: StaffMember[];
  events: any[];
  selectedDate: Date;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
}

export const StaffColumns: React.FC<StaffColumnsProps> = ({
  staffMembers,
  events,
  selectedDate,
  commonConfig,
  calendarRefs,
  setCalendarApi
}) => {
  const { applyBlockedTimeStyles } = useCalendarBlockTime();
  const { isStaffBlocked } = useStaffBlockTime();
  const { currentSalonId } = useAuth();
  
  // Helper function to get staff name
  const getStaffName = (staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  };
  
  // Apply block time styles once after initial render
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);

  // Memoize blocked staff status to prevent unnecessary recalculations
  const blockedStaffStatus = useMemo(() => {
    return staffMembers.reduce((acc, staff) => {
      acc[staff.id] = isStaffBlocked(staff.id);
      return acc;
    }, {} as Record<string, boolean>);
  }, [staffMembers, isStaffBlocked]);

  // Debug log per il problema degli eventi non interattivi
  useEffect(() => {
    console.log("StaffColumns - eventi totali:", events.length);
    
    // Analisi degli eventi senza resourceId corretto
    const eventsWithInvalidResourceId = events.filter(event => {
      return event.resourceId && typeof event.resourceId === 'object';
    });
    
    if (eventsWithInvalidResourceId.length > 0) {
      console.warn("Eventi con resourceId non valido:", eventsWithInvalidResourceId.length);
      console.warn("Esempio:", eventsWithInvalidResourceId[0]);
    }
    
    // Verifichiamo la distribuzione di eventi
    const staffEventsMapping = staffMembers.map(staff => ({
      staffId: staff.id,
      name: getStaffName(staff),
      events: events.filter(event => {
        // Correzione per resourceId come oggetto
        const resourceId = typeof event.resourceId === 'object' 
          ? event.resourceId?.value 
          : event.resourceId;
        
        return resourceId === staff.id;
      }).length
    }));
    
    console.log("Mappatura staff-eventi:", staffEventsMapping);
  }, [events, staffMembers]);

  // Se non ci sono membri dello staff da visualizzare
  if (staffMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full p-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
        <div className="text-lg font-medium mb-2">Nessun operatore visibile nel calendario.</div>
        <div className="text-sm text-center">
          {currentSalonId ? (
            <p>
              Per visualizzare gli operatori nell'agenda:
              <br />
              1. Vai alla pagina Staff<br />
              2. Seleziona "Visibile in agenda" nelle impostazioni dell'operatore
            </p>
          ) : (
            <p>Seleziona prima un salone dalle impostazioni profilo</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="staff-columns-wrapper" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
      height: '100%',
      width: '100%'
    }}>
      {staffMembers.map((staff, index) => {
        const isBlocked = blockedStaffStatus[staff.id] || false;
        
        // Correggi il filtering degli eventi per questo staff
        const staffEvents = events.filter(event => {
          // Gestione di resourceId sia come stringa che come oggetto
          let eventResourceId = event.resourceId;
          
          // Se resourceId è un oggetto, estraiamo il valore
          if (typeof eventResourceId === 'object' && eventResourceId !== null) {
            eventResourceId = eventResourceId.value;
          }
          
          // Se staffId è un oggetto nelle extendedProps, usiamo quello
          if (!eventResourceId && event.extendedProps?.staffId) {
            eventResourceId = typeof event.extendedProps.staffId === 'object'
              ? event.extendedProps.staffId.value
              : event.extendedProps.staffId;
          }
          
          // Matching con l'ID dello staff
          return eventResourceId === staff.id;
        });
        
        console.log(`Staff ${getStaffName(staff)} (${staff.id}) ha ${staffEvents.length} eventi`);
        
        return (
          <div
            key={staff.id}
            className={`calendar-staff-col ${isBlocked ? 'staff-blocked' : ''}`}
            data-staff-id={staff.id}
            data-blocked={isBlocked ? 'true' : 'false'}
          >
            <FullCalendar
              key={`staff-calendar-${staff.id}`}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              initialDate={selectedDate}
              {...commonConfig}
              dayHeaderContent={() => null}
              slotLabelContent={() => null}
              events={staffEvents}
              headerToolbar={false}
              height="100%"
              dayCellClassNames={isBlocked ? 'blocked-staff-column' : ''}
              viewClassNames={isBlocked ? 'blocked-staff-view' : ''}
              eventClassNames={['fc-event-interactive', 'event-clickable']}
              eventDidMount={(info) => {
                // Add data attributes for debugging
                if (info.el) {
                  info.el.setAttribute('data-event-id', info.event.id);
                  info.el.setAttribute('data-staff-id', staff.id);
                  info.el.setAttribute('data-interactive', 'true');
                  (info.el as HTMLElement).style.pointerEvents = 'auto';
                  (info.el as HTMLElement).style.cursor = 'pointer';
                  
                  // Add click handler as a backup
                  info.el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log("Direct click on event:", info.event.id, "on staff:", staff.id);
                    if (commonConfig.eventClick) {
                      commonConfig.eventClick({
                        event: info.event,
                        el: info.el,
                        jsEvent: e
                      });
                    }
                  });
                }
                
                // Special handling for blocked time events
                if (info.event.extendedProps?.isBlockedTime || 
                    info.event.classNames?.includes('blocked-time-event') ||
                    info.event.display === 'background') {
                  info.el.classList.add('blocked-time-event');
                  info.el.classList.add('fc-non-interactive');
                  
                  // Create tooltip for blocked time
                  const tooltip = document.createElement('div');
                  tooltip.className = 'calendar-tooltip';
                  
                  let tooltipContent = 'Operatore non disponibile';
                  if (info.event.extendedProps?.reason) {
                    tooltipContent += `: ${info.event.extendedProps.reason}`;
                  }
                  
                  tooltip.innerText = tooltipContent;
                  info.el.appendChild(tooltip);
                  
                  // Add event listeners for the tooltip visibility
                  info.el.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                  });
                  
                  info.el.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                  });
                }
                
                // Call the original eventDidMount if provided
                if (commonConfig.eventDidMount) {
                  commonConfig.eventDidMount(info);
                }
              }}
              ref={el => {
                if (el) {
                  calendarRefs.current[index] = el;
                  if (index === 0) setCalendarApi(el.getApi());
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
