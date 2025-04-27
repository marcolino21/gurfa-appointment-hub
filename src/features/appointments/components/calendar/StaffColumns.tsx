
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Importazione diretta degli stili specifici
import '../../styles/components/calendar-events.css';

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
  const [renderCount, setRenderCount] = useState(0);
  
  // Helper function to get staff name
  const getStaffName = useCallback((staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  }, []);
  
  // Log di diagnostica dettagliato
  const debugDOMElements = useCallback(() => {
    console.group("🔍 Debug DOM Elements");
    
    // Verifica elementi rilevanti
    const calendarElements = document.querySelectorAll('.fc');
    const staffColumns = document.querySelectorAll('.calendar-staff-col');
    const reactEvents = document.querySelectorAll('.react-appointment-event');
    
    console.log(`Elementi calendario (.fc): ${calendarElements.length}`);
    console.log(`Colonne staff (.calendar-staff-col): ${staffColumns.length}`);
    console.log(`React events (.react-appointment-event): ${reactEvents.length}`);
    console.log(`Eventi originali: ${events.length}`);
    
    console.groupEnd();
  }, [events]);

  // APPROCCIO REACT: Renderizzazione degli eventi come componenti React
  const renderAppointmentEvents = useCallback((staffId: string, staffEvents: any[]) => {
    if (!staffEvents.length) return null;
    
    // Calcoli per posizionamento
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const totalMinutesInDay = 24 * 60;
    
    return (
      <div className="appointments-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10000
      }}>
        {staffEvents.map(event => {
          // Calcoli per posizionamento
          const eventStart = new Date(event.start);
          const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 30 * 60000);
          
          // Minuti dall'inizio della giornata
          const minutesFromDayStart = (eventStart.getTime() - dayStart.getTime()) / 60000;
          const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / 60000;
          
          // Calcolo percentuale per posizionamento
          const topPercent = (minutesFromDayStart / totalMinutesInDay) * 100;
          const heightPercent = (durationMinutes / totalMinutesInDay) * 100;
          
          // Determinazione dello stato
          const status = event.extendedProps?.status || 'default';
          
          // Determinazione colori in base allo stato
          let bgColor, borderColor;
          switch (status) {
            case 'confirmed':
              bgColor = '#10b981'; // verde
              borderColor = '#047857';
              break;
            case 'pending':
              bgColor = '#f59e0b'; // giallo
              borderColor = '#b45309';
              break;
            case 'cancelled':
              bgColor = '#ef4444'; // rosso
              borderColor = '#b91c1c';
              break;
            default:
              bgColor = '#3b82f6'; // blu
              borderColor = '#1d4ed8';
          }
          
          return (
            <div
              key={event.id}
              className={`react-appointment-event appointment-status-${status}`}
              data-event-id={event.id}
              style={{
                position: 'absolute',
                top: `${topPercent}%`,
                left: '4px',
                right: '4px',
                height: `${Math.max(4, heightPercent)}%`,
                minHeight: '30px',
                backgroundColor: bgColor,
                borderLeft: `4px solid ${borderColor}`,
                color: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                padding: '4px',
                zIndex: 1000,
                pointerEvents: 'auto',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => {
                if (commonConfig.eventClick) {
                  commonConfig.eventClick({ 
                    event: {
                      ...event,
                      start: eventStart,
                      end: eventEnd,
                      title: event.title,
                      extendedProps: event.extendedProps || {}
                    }
                  });
                }
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.2 }}>
                {format(eventStart, 'HH:mm', { locale: it })}
              </div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {event.title}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [selectedDate, commonConfig]);
  
  // Completamente rimuove gli eventi nativi FullCalendar
  const hideNativeEvents = useCallback(() => {
    document.querySelectorAll('.fc-timegrid-event, .fc-timegrid-event-harness, .fc-event').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.cssText = `
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        `;
      }
    });
  }, []);
  
  // Funzione per eseguire le operazioni necessarie
  const setupEvents = useCallback(() => {
    console.log("🔄 Setup eventi - SOLUZIONE REACT");
    
    // Nascondi gli eventi nativi
    hideNativeEvents();
    
    // Incrementa il contatore di rendering
    setRenderCount(prev => prev + 1);
    
    // Esegui debug
    debugDOMElements();
  }, [hideNativeEvents, debugDOMElements]);
  
  // Applica i blocchi di tempo dopo il rendering iniziale
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Esecuzione periodica del setup
  useEffect(() => {
    // Esegui subito
    setupEvents();
    
    // Esegui più volte con timing diversi per assicurarsi che funzioni
    const timers = [
      setTimeout(setupEvents, 100),
      setTimeout(setupEvents, 500),
      setTimeout(setupEvents, 1000),
      setTimeout(setupEvents, 2000)
    ];
    
    // Observer per rilevare cambiamenti
    const viewObserver = new MutationObserver((mutations) => {
      const relevantMutation = mutations.some(mutation => {
        return mutation.type === 'childList' || 
               (mutation.type === 'attributes' && 
               (mutation.target as Element).className?.includes('fc'));
      });
      
      if (relevantMutation) {
        setupEvents();
      }
    });
    
    // Trova l'elemento calendario
    const calendarElement = document.querySelector('.fc');
    if (calendarElement) {
      viewObserver.observe(calendarElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    
    // Interval per sicurezza
    const intervalId = setInterval(setupEvents, 5000);
    
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(intervalId);
      viewObserver.disconnect();
    };
  }, [setupEvents]);
  
  // Esegui il setup quando cambiano gli eventi o la data
  useEffect(() => {
    setupEvents();
  }, [events, selectedDate, setupEvents]);
  
  // Memoize blocked staff status
  const blockedStaffStatus = useMemo(() => {
    return staffMembers.reduce((acc, staff) => {
      acc[staff.id] = isStaffBlocked(staff.id);
      return acc;
    }, {} as Record<string, boolean>);
  }, [staffMembers, isStaffBlocked]);

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
      width: '100%',
      position: 'relative'
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
        
        return (
          <div
            key={staffIdStr}
            className={`calendar-staff-col ${isBlocked ? 'staff-blocked' : ''}`}
            data-staff-id={staffIdStr}
            data-blocked={isBlocked ? 'true' : 'false'}
            style={{ position: 'relative', height: '100%', overflow: 'visible' }}
          >
            {/* NUOVO SISTEMA: Aggiungiamo gli appuntamenti come componenti React */}
            {renderAppointmentEvents(staffIdStr, staffEvents)}
            
            <FullCalendar
              key={`staff-calendar-${staffIdStr}`}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              initialDate={selectedDate}
              {...commonConfig}
              // Configurazione semplificata
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
              slotLabelContent={({ date }) => (
                <div style={{ fontSize: '0.7rem', color: '#888' }}>
                  {format(date, 'HH:mm', { locale: it })}
                </div>
              )}
              events={staffEvents}
              headerToolbar={false}
              height="100%"
              dayCellClassNames={isBlocked ? 'blocked-staff-column' : ''}
              viewClassNames={isBlocked ? 'blocked-staff-view' : ''}
              // Nascondi eventi nativi
              eventDisplay="none"
              eventDidMount={(info) => {
                if (commonConfig.eventDidMount) {
                  commonConfig.eventDidMount(info);
                }
                // Nascondi immediatamente l'evento
                const eventEl = info.el;
                if (eventEl instanceof HTMLElement) {
                  eventEl.style.display = 'none';
                  eventEl.style.visibility = 'hidden';
                  eventEl.style.opacity = '0';
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
