
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
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
  const [renderCount, setRenderCount] = useState(0);
  
  // Helper function to get staff name
  const getStaffName = (staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  };
  
  /**
   * VERSIONE COMPLETAMENTE RISCRITTO DELLA FUNZIONE CHE CREA EVENTI MANUALI
   * Questa implementazione è più robusta ed evita i problemi di visibilità
   */
  const createManualEvents = useCallback(() => {
    console.log("🔄 Creazione eventi manuali (versione migliorata)");
    
    // Rimuove eventuali eventi manuali precedenti per evitare duplicati
    document.querySelectorAll('.manual-event-overlay').forEach(el => el.remove());
    
    // Per ogni membro dello staff
    staffMembers.forEach(staff => {
      const staffIdStr = String(staff.id);
      
      // Trova la colonna del calendario per questo staff
      const staffColumn = document.querySelector(`[data-staff-id="${staffIdStr}"]`);
      if (!staffColumn) {
        console.warn(`Colonna per lo staff ${staffIdStr} non trovata`);
        return;
      }
      
      // Filtra gli eventi per questo staff
      const staffEvents = events.filter(event => {
        const eventStaffId = event.resourceId ? String(event.resourceId) : undefined;
        return eventStaffId === staffIdStr;
      });
      
      // Trova il container degli slot temporali - cerchiamo in più posizioni
      let timeGridContainer = staffColumn.querySelector('.fc-timegrid-body');
      if (!timeGridContainer) {
        timeGridContainer = staffColumn.querySelector('.fc-timegrid');
      }
      if (!timeGridContainer) {
        timeGridContainer = staffColumn.querySelector('.fc-view');
      }
      if (!timeGridContainer) {
        timeGridContainer = staffColumn;
      }
      
      console.log(`📅 Creando ${staffEvents.length} eventi manuali per ${getStaffName(staff)}`);
      
      // Crea un container per gli eventi manuali
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'manual-event-overlay';
      eventsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        pointer-events: none;
        overflow: visible;
      `;
      
      // Aggiungilo alla colonna
      timeGridContainer.appendChild(eventsContainer);
      
      // Ottieni la geometria del container per calcolare le posizioni
      const containerRect = timeGridContainer.getBoundingClientRect();
      const containerHeight = containerRect.height;
      
      // Crea un elemento manuale per ogni evento
      staffEvents.forEach(event => {
        try {
          // Ottieni l'ora di inizio e fine dell'evento
          const eventStart = new Date(event.start);
          const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 30 * 60000);
          
          // Durata in minuti
          const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / 60000;
          
          // Calcolo della posizione oraria
          // Assumiamo che il calendario mostri 24 ore (dalle 00:00 alle 24:00)
          const totalMinutesInDay = 24 * 60;
          
          // Minuti dall'inizio della giornata
          const startOfDay = new Date(eventStart);
          startOfDay.setHours(0, 0, 0, 0);
          const minutesFromStartOfDay = (eventStart.getTime() - startOfDay.getTime()) / 60000;
          
          // Percentuale della giornata per inizio e durata
          const topPercent = (minutesFromStartOfDay / totalMinutesInDay) * 100;
          const heightPercent = (durationMinutes / totalMinutesInDay) * 100;
          
          // Top position in pixel (percentuale dell'altezza del container)
          const topPosition = (containerHeight * topPercent) / 100;
          const eventHeight = Math.max(30, (containerHeight * heightPercent) / 100);
          
          // Determina colori in base allo stato
          let bgColor, borderColor;
          const status = event.extendedProps?.status || 'default';
          
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
          
          // Crea l'elemento manuale
          const manualEvent = document.createElement('div');
          manualEvent.className = `manual-appointment-event appointment-status-${status}`;
          manualEvent.setAttribute('data-event-id', event.id);
          
          // Imposta lo stile in modo esplicito e dettagliato
          manualEvent.style.cssText = `
            position: absolute;
            top: ${topPosition}px;
            left: 4px;
            right: 4px;
            height: ${eventHeight}px;
            background-color: ${bgColor};
            color: white;
            padding: 4px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 12px;
            border: 1px solid rgba(0,0,0,0.1);
            border-left: 4px solid ${borderColor};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            overflow: hidden;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: all;
            cursor: pointer;
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
          
          // Aggiungi l'evento al container
          eventsContainer.appendChild(manualEvent);
          
          // Aggiungi gestione del click
          manualEvent.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene la propagazione del click
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
          });
          
        } catch (error) {
          console.error(`Errore nella creazione dell'evento manuale: ${error}`);
        }
      });
    });
  }, [events, staffMembers, commonConfig, getStaffName]);
  
  // Completamente rimuove gli eventi nativi FullCalendar
  const hideNativeEvents = useCallback(() => {
    const hideEvents = () => {
      document.querySelectorAll('.fc-timegrid-event, .fc-timegrid-event-harness').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          `;
        }
      });
    };
    
    hideEvents(); // Esegui subito
    
    // E poi con un piccolo ritardo per catturare elementi che potrebbero essere aggiunti dopo
    setTimeout(hideEvents, 50);
    setTimeout(hideEvents, 200);
  }, []);
  
  // Funzione che esegue tutte le operazioni necessarie per gli eventi manuali
  const setupManualEvents = useCallback(() => {
    // Prima nascondi gli eventi nativi
    hideNativeEvents();
    // Poi crea gli eventi manuali
    createManualEvents();
    // Incrementa il contatore di rendering
    setRenderCount(prev => prev + 1);
  }, [hideNativeEvents, createManualEvents]);
  
  // Apply block time styles once after initial render
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Setup completo degli eventi manuali
  useEffect(() => {
    console.log("🔄 Inizializzazione eventi manuali");
    
    // Esegui subito
    setupManualEvents();
    
    // Programma più esecuzioni con tempi crescenti per assicurare che funzioni
    const timers = [
      setTimeout(setupManualEvents, 100),
      setTimeout(setupManualEvents, 300),
      setTimeout(setupManualEvents, 1000),
      setTimeout(setupManualEvents, 2000),
      setTimeout(setupManualEvents, 5000) // Molto ritardato per assicurarsi che tutto sia pronto
    ];
    
    // Configurazione di un observer per rilevare cambiamenti nella vista
    const viewObserver = new MutationObserver(() => {
      console.log("🔍 Rilevato cambiamento nella vista, ricreo eventi manuali");
      setupManualEvents();
    });
    
    // Trova l'elemento principale del calendario
    const calendarElement = document.querySelector('.fc');
    if (calendarElement) {
      viewObserver.observe(calendarElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    
    // Imposta anche un interval per sicurezza (periodicità più lunga)
    const intervalId = setInterval(setupManualEvents, 10000);
    
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(intervalId);
      viewObserver.disconnect();
    };
  }, [setupManualEvents, events, selectedDate]);
  
  // Log di diagnostica per debug
  useEffect(() => {
    console.log(`📊 Render #${renderCount}: ${events.length} eventi totali per ${staffMembers.length} staff`);
    
    // Diagnostica rapida degli eventi creati
    const manualEventsCount = document.querySelectorAll('.manual-appointment-event').length;
    console.log(`🔍 Eventi manuali trovati nel DOM: ${manualEventsCount}`);
    
    // Test di visibilità
    setTimeout(() => {
      const firstManualEvent = document.querySelector('.manual-appointment-event');
      if (firstManualEvent instanceof HTMLElement) {
        const style = window.getComputedStyle(firstManualEvent);
        console.log(`🔍 Primo evento manuale - display: ${style.display}, visibility: ${style.visibility}, opacity: ${style.opacity}`);
      }
    }, 500);
  }, [renderCount, events, staffMembers]);
  
  // Memoize blocked staff status to prevent unnecessary recalculations
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
            <FullCalendar
              key={`staff-calendar-${staffIdStr}`}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              initialDate={selectedDate}
              {...commonConfig}
              // Utilizziamo una configurazione molto semplice per il calendario
              // dato che renderizzeremo gli eventi manualmente
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
              // Versione più minimalista per eventi nativi
              eventDisplay="none" // Nascondi del tutto gli eventi nativi
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
