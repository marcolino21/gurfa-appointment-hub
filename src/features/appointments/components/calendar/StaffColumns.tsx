
import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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
  
  // Helper function to get staff name
  const getStaffName = (staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  };
  
  // Enhanced force event visibility function that ensures events stay visible
  const forceEventVisibility = useCallback(() => {
    // Seleziona i contenitori degli eventi
    document.querySelectorAll('.fc-timegrid-event-harness').forEach(harness => {
      if (harness instanceof HTMLElement) {
        harness.style.cssText = `
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 100 !important;
          margin: 0 2px !important;
          height: auto !important;
          min-height: 30px !important;
          position: absolute !important;
          right: 0 !important;
          left: 0 !important;
          display: block !important;
        `;
      }
    });

    // Seleziona gli eventi
    document.querySelectorAll('.fc-event, .fc-timegrid-event, .calendar-appointment').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.cssText = `
          min-height: 30px !important;
          height: auto !important;
          max-height: none !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 100 !important;
          padding: 4px !important;
          background-color: #3b82f6 !important;
          border: 1px solid #2563eb !important;
          border-left: 4px solid #1d4ed8 !important;
          color: white !important;
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
          border-radius: 4px !important;
          overflow: visible !important;
          margin: 0 !important;
        `;
        
        // Status-specific styling
        if (el.classList.contains('appointment-status-confirmed')) {
          el.style.backgroundColor = '#10b981 !important';
          el.style.borderColor = '#059669 !important';
          el.style.borderLeftColor = '#047857 !important';
        } else if (el.classList.contains('appointment-status-pending')) {
          el.style.backgroundColor = '#f59e0b !important';
          el.style.borderColor = '#d97706 !important';
          el.style.borderLeftColor = '#b45309 !important';
        } else if (el.classList.contains('appointment-status-cancelled')) {
          el.style.backgroundColor = '#ef4444 !important';
          el.style.borderColor = '#dc2626 !important';
          el.style.borderLeftColor = '#b91c1c !important';
          el.style.textDecoration = 'line-through !important';
        }
        
        // Assicura che il contenuto interno sia visibile
        const mainEl = el.querySelector('.fc-event-main');
        if (mainEl instanceof HTMLElement) {
          mainEl.style.cssText = `
            padding: 2px 4px !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            overflow: visible !important;
          `;
        }
        
        const titleEl = el.querySelector('.fc-event-title');
        if (titleEl instanceof HTMLElement) {
          titleEl.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: white !important;
            font-weight: bold !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            padding: 2px 0 !important;
          `;
        }
        
        const timeEl = el.querySelector('.fc-event-time');
        if (timeEl instanceof HTMLElement) {
          timeEl.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 11px !important;
            line-height: 1.2 !important;
          `;
        }
      }
    });
  }, []);
  
  // Implementazione di eventi manuali che bypassano completamente il sistema di rendering di FullCalendar
  const createManualEvents = useCallback(() => {
    console.log("Creazione eventi manuali come soluzione alternativa");
    
    // Rimuove eventuali eventi manuali precedenti
    document.querySelectorAll('.manual-appointment-event').forEach(el => el.remove());
    
    // Per ogni membro dello staff
    staffMembers.forEach(staff => {
      const staffIdStr = String(staff.id);
      
      // Trova la colonna del calendario per questo staff
      const staffColumn = document.querySelector(`[data-staff-id="${staffIdStr}"]`);
      if (!staffColumn) return;
      
      // Trova il container degli slot temporali
      const timeGridBody = staffColumn.querySelector('.fc-timegrid-body');
      if (!timeGridBody) return;
      
      // Filtra gli eventi per questo staff
      const staffEvents = events.filter(event => {
        const eventStaffId = event.resourceId ? String(event.resourceId) : undefined;
        return eventStaffId === staffIdStr;
      });
      
      console.log(`Creando ${staffEvents.length} eventi manuali per ${staff.firstName}`);
      
      // Crea un elemento manuale per ogni evento
      staffEvents.forEach(event => {
        try {
          // Ottieni l'ora di inizio dell'evento
          const eventStart = new Date(event.start);
          
          // Calcola la posizione verticale (approssimativa) basata sull'ora
          // Assumendo che ogni ora nel calendario sia alta 40px
          const hour = eventStart.getHours();
          const minutes = eventStart.getMinutes();
          const topPosition = (hour * 60 + minutes) * (40/60);
          
          // Determina colori in base allo stato
          let bgColor, borderColor;
          const status = event.extendedProps?.status || 'default';
          
          switch (status) {
            case 'confirmed':
              bgColor = '#10b981';
              borderColor = '#047857';
              break;
            case 'pending':
              bgColor = '#f59e0b';
              borderColor = '#b45309';
              break;
            case 'cancelled':
              bgColor = '#ef4444';
              borderColor = '#b91c1c';
              break;
            default:
              bgColor = '#3b82f6';
              borderColor = '#1d4ed8';
          }
          
          // Crea l'elemento manuale
          const manualEvent = document.createElement('div');
          manualEvent.className = `manual-appointment-event appointment-status-${status}`;
          manualEvent.setAttribute('data-event-id', event.id);
          
          // Imposta lo stile in modo esplicito
          manualEvent.style.cssText = `
            position: absolute;
            top: ${topPosition}px;
            left: 0;
            right: 0;
            height: 30px;
            min-height: 24px;
            background-color: ${bgColor};
            color: white;
            padding: 4px;
            margin: 0 4px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 12px;
            border: 1px solid rgba(0,0,0,0.1);
            border-left: 4px solid ${borderColor};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            overflow: hidden;
            display: block;
            visibility: visible;
            opacity: 1;
          `;
          
          // Crea la struttura interna dell'evento
          manualEvent.innerHTML = `
            <div style="font-size: 11px; font-weight: 600; line-height: 1.2;">
              ${format(eventStart, 'HH:mm', { locale: it })}
            </div>
            <div style="font-size: 12px; font-weight: bold; line-height: 1.2; 
                       white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${event.title}
            </div>
          `;

          // Aggiungi l'evento al DOM
          timeGridBody.appendChild(manualEvent);
          
          // Aggiungi gestione del click
          manualEvent.addEventListener('click', () => {
            if (commonConfig.eventClick) {
              commonConfig.eventClick({ event });
            }
          });
          
        } catch (error) {
          console.error(`Errore nella creazione dell'evento manuale: ${error}`);
        }
      });
    });
  }, [events, staffMembers, commonConfig]);

  // Apply block time styles once after initial render
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Force events visibility several times to ensure they remain visible
  useEffect(() => {
    // Apply immediately
    forceEventVisibility();
    
    // Apply after short delays to catch any dynamic changes
    const timer1 = setTimeout(forceEventVisibility, 300);
    const timer2 = setTimeout(forceEventVisibility, 800);
    const timer3 = setTimeout(forceEventVisibility, 1500);
    
    // Apply periodically to ensure continued visibility
    const intervalTimer = setInterval(forceEventVisibility, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(intervalTimer);
    };
  }, [forceEventVisibility, events]);

  // Add manual events rendering
  useEffect(() => {
    // Aspetta che il calendario sia completamente renderizzato
    const timer1 = setTimeout(createManualEvents, 500);
    const timer2 = setTimeout(createManualEvents, 1500);
    
    // Applica anche periodicamente per assicurare la persistenza
    const intervalTimer = setInterval(createManualEvents, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(intervalTimer);
    };
  }, [createManualEvents, events]);
  
  // Funzione di diagnostica per aiutare a risolvere i problemi rimanenti
  useEffect(() => {
    const diagnoseEvents = () => {
      console.group('📊 Calendar Events Diagnosis');
      
      const eventElements = document.querySelectorAll('.fc-event');
      console.log(`Found ${eventElements.length} event elements in DOM vs ${events.length} in data`);
      
      if (eventElements.length > 0) {
        const firstEvent = eventElements[0];
        if (firstEvent instanceof HTMLElement) {
          console.log('First event styles:', {
            height: firstEvent.offsetHeight,
            width: firstEvent.offsetWidth,
            display: window.getComputedStyle(firstEvent).display,
            visibility: window.getComputedStyle(firstEvent).visibility,
            opacity: window.getComputedStyle(firstEvent).opacity,
            position: window.getComputedStyle(firstEvent).position
          });
        }
      }
      
      // Verifica eventi manuali
      const manualEvents = document.querySelectorAll('.manual-appointment-event');
      console.log(`Manual events created: ${manualEvents.length}`);
      
      if (manualEvents.length > 0) {
        const firstManualEvent = manualEvents[0];
        if (firstManualEvent instanceof HTMLElement) {
          console.log('First manual event styles:', {
            top: firstManualEvent.style.top,
            height: firstManualEvent.offsetHeight,
            width: firstManualEvent.offsetWidth,
            visibility: window.getComputedStyle(firstManualEvent).visibility
          });
        }
      }
      
      console.groupEnd();
    };
    
    const timer = setTimeout(diagnoseEvents, 2000);
    return () => clearTimeout(timer);
  }, [events]);

  // Memoize blocked staff status to prevent unnecessary recalculations
  const blockedStaffStatus = useMemo(() => {
    return staffMembers.reduce((acc, staff) => {
      acc[staff.id] = isStaffBlocked(staff.id);
      return acc;
    }, {} as Record<string, boolean>);
  }, [staffMembers, isStaffBlocked]);

  // Debug log di eventi e staff membri
  useEffect(() => {
    console.log("StaffColumns rendering with staffMembers:", staffMembers);
    console.log("StaffColumns rendering with events:", events);
    
    // Log degli eventi per ogni membro dello staff
    staffMembers.forEach(staff => {
      // Normalizza l'ID dello staff per il confronto
      const staffIdStr = String(staff.id);
      
      // Filtra gli eventi per questo staff membro
      const staffEvents = events.filter(event => {
        const eventStaffId = event.resourceId ? String(event.resourceId) : undefined;
        return eventStaffId === staffIdStr;
      });
      
      console.log(`Staff ${getStaffName(staff)} (ID: ${staffIdStr}) has ${staffEvents.length} events`);
      if (staffEvents.length > 0) {
        console.log(`First few events for ${getStaffName(staff)}:`, 
          staffEvents.slice(0, 2).map(e => ({
            id: e.id,
            title: e.title,
            resourceId: e.resourceId
          }))
        );
      }
    });
  }, [events, staffMembers, getStaffName]);

  if (staffMembers.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 h-full text-gray-500 p-8 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Nessun operatore visibile nel calendario</p>
          <p>Aggiungi operatori e imposta "Visibile in agenda" nelle impostazioni staff.</p>
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
        
        // Normalizza l'ID dello staff per il confronto
        const staffIdStr = String(staff.id);
        
        // Filtra gli eventi per questo membro dello staff specifico
        const staffEvents = events.filter(event => {
          const eventStaffId = event.resourceId ? String(event.resourceId) : undefined;
          return eventStaffId === staffIdStr;
        });
        
        console.log(`Rendering calendar for ${staff.firstName} ${staff.lastName} (ID: ${staffIdStr}) with ${staffEvents.length} events`);
        
        return (
          <div
            key={staffIdStr}
            className={`calendar-staff-col ${isBlocked ? 'staff-blocked' : ''}`}
            data-staff-id={staffIdStr}
            data-blocked={isBlocked ? 'true' : 'false'}
          >
            <FullCalendar
              key={`staff-calendar-${staffIdStr}`}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              initialDate={selectedDate}
              {...commonConfig}
              // Configurazione ottimizzata per la vista giornaliera
              eventMinHeight={30}
              slotEventOverlap={false}
              slotDuration={'00:30:00'}
              snapDuration={'00:15:00'}
              nowIndicator={false}
              eventDurationEditable={false}
              eventStartEditable={false}
              forceEventDuration={true}
              displayEventEnd={true}
              allDaySlot={false}
              dayMaxEvents={false}
              dayHeaderContent={() => null}
              slotLabelContent={() => null}
              events={staffEvents}
              headerToolbar={false}
              height="100%"
              dayCellClassNames={isBlocked ? 'blocked-staff-column' : ''}
              viewClassNames={isBlocked ? 'blocked-staff-view' : ''}
              // Improved event display options
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              // Custom event content rendering with more explicit styling
              eventContent={(eventInfo) => {
                // Determina lo stato dell'appuntamento
                const status = eventInfo.event.extendedProps?.status || 'default';
                
                // Imposta colori in base allo stato
                let bgColor, borderColor;
                
                switch (status) {
                  case 'confirmed':
                    bgColor = '#10b981';
                    borderColor = '#047857';
                    break;
                  case 'pending':
                    bgColor = '#f59e0b';
                    borderColor = '#b45309';
                    break;
                  case 'cancelled':
                    bgColor = '#ef4444';
                    borderColor = '#b91c1c';
                    break;
                  default:
                    bgColor = '#3b82f6';
                    borderColor = '#1d4ed8';
                }
                
                return (
                  <div style={{
                    display: 'block',
                    height: '100%',
                    minHeight: '24px',
                    padding: '2px 4px',
                    backgroundColor: bgColor,
                    borderLeft: `4px solid ${borderColor}`,
                    color: 'white',
                    overflow: 'hidden',
                    borderRadius: '4px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>
                      {format(eventInfo.event.start!, 'HH:mm', { locale: it })}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {eventInfo.event.title}
                    </div>
                  </div>
                );
              }}
              eventClassNames={(arg) => {
                // Add extra class for blocked time events
                if (arg.event.extendedProps?.isBlockedTime || 
                    arg.event.classNames?.includes('blocked-time-event') ||
                    arg.event.display === 'background') {
                  return ['blocked-time-event', 'fc-non-interactive'];
                }
                
                // Add classes for regular appointments
                const status = arg.event.extendedProps?.status || 'default';
                return ['calendar-appointment', `appointment-status-${status}`];
              }}
              eventDidMount={(info) => {
                console.log(`Event mounted: ${info.event.title} for staff ${staff.firstName}`);
                
                // Add data attributes for debugging
                const eventEl = info.el;
                if (eventEl) {
                  eventEl.setAttribute('data-event-id', info.event.id);
                  eventEl.setAttribute('data-staff-id', String(info.event.extendedProps?.staffId || ''));
                }
                
                if (commonConfig.eventDidMount) {
                  commonConfig.eventDidMount(info);
                }
                
                // Forza la visibilità dell'evento dopo il montaggio
                setTimeout(() => {
                  if (eventEl instanceof HTMLElement) {
                    forceEventVisibility();
                  }
                }, 50);
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
