
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
  const eventsContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Helper function to get staff name
  const getStaffName = useCallback((staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  }, []);
  
  // Funzione di debug per ispezionare gli elementi del DOM
  const debugDOMElements = useCallback(() => {
    console.group("🔍 Debug DOM Elements");
    
    // Verifica se gli elementi del calendario esistono
    const calendarElements = document.querySelectorAll('.fc');
    console.log(`Elementi calendario (.fc): ${calendarElements.length}`);
    
    // Verifica se le colonne dello staff esistono
    const staffColumns = document.querySelectorAll('.calendar-staff-col');
    console.log(`Colonne staff (.calendar-staff-col): ${staffColumns.length}`);
    
    // Verifica la struttura del timegrid
    const timegridBodies = document.querySelectorAll('.fc-timegrid-body');
    console.log(`Timegrid bodies (.fc-timegrid-body): ${timegridBodies.length}`);
    
    // Verifica gli slot temporali
    const timeSlots = document.querySelectorAll('.fc-timegrid-slot');
    console.log(`Time slots (.fc-timegrid-slot): ${timeSlots.length}`);
    
    // Verifica overlay degli eventi manuali
    const manualOverlays = document.querySelectorAll('.manual-event-overlay');
    console.log(`Manual event overlays (.manual-event-overlay): ${manualOverlays.length}`);
    
    // Verifica eventi manuali
    const manualEvents = document.querySelectorAll('.manual-appointment-event');
    console.log(`Manual events (.manual-appointment-event): ${manualEvents.length}`);
    
    // Analizza stili e visibilità del primo evento manuale
    if (manualEvents.length > 0) {
      const firstEvent = manualEvents[0] as HTMLElement;
      const style = window.getComputedStyle(firstEvent);
      console.log("Primo evento manuale:", {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        position: style.position,
        top: style.top,
        left: style.left,
        width: style.width,
        height: style.height,
        backgroundColor: style.backgroundColor
      });
    }
    
    console.groupEnd();
  }, []);
  
  /**
   * VERSIONE OTTIMIZZATA DELLA FUNZIONE CHE CREA EVENTI MANUALI
   */
  const createManualEvents = useCallback(() => {
    console.log("🔄 Creazione eventi manuali (versione ultra-ottimizzata)");
    
    // Per ogni membro dello staff
    staffMembers.forEach(staff => {
      const staffIdStr = String(staff.id);
      
      // Trova la colonna del calendario per questo staff
      const staffColumn = document.querySelector(`[data-staff-id="${staffIdStr}"]`);
      if (!staffColumn) {
        console.warn(`Colonna per lo staff ${staffIdStr} non trovata`);
        return;
      }
      
      // Ottieni o crea il container per gli eventi di questo staff
      let eventsContainer = eventsContainerRefs.current.get(staffIdStr);
      
      // Se il container non esiste o non è nel DOM, crealo
      if (!eventsContainer || !document.body.contains(eventsContainer)) {
        // Prima rimuovi eventuali container esistenti per questo staff
        document.querySelectorAll(`.manual-events-${staffIdStr}`).forEach(el => el.remove());
        
        // Crea un nuovo container
        eventsContainer = document.createElement('div');
        eventsContainer.className = `manual-event-overlay manual-events-${staffIdStr}`;
        eventsContainer.setAttribute('data-staff-id', staffIdStr);
        
        // Memorizza il riferimento
        eventsContainerRefs.current.set(staffIdStr, eventsContainer);
        
        // Aggiungi il container direttamente alla colonna dello staff
        staffColumn.appendChild(eventsContainer);
        
        console.log(`🆕 Creato nuovo container per eventi dello staff ${staffIdStr}`);
      } else {
        // Pulisci il container esistente
        eventsContainer.innerHTML = '';
        console.log(`🔄 Riutilizzo container esistente per lo staff ${staffIdStr}`);
      }
      
      // Filtra gli eventi per questo staff
      const staffEvents = events.filter(event => {
        const eventStaffId = event.resourceId ? String(event.resourceId) : undefined;
        return eventStaffId === staffIdStr;
      });
      
      console.log(`📅 Creando ${staffEvents.length} eventi manuali per ${getStaffName(staff)}`);
      
      // Ottieni dimensioni del container per il calcolo delle posizioni
      const containerRect = staffColumn.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const headerHeight = 44; // Altezza dell'header se presente
      const availableHeight = containerHeight - headerHeight;
      
      // Assumiamo che la vista copra 24 ore, adatta per il tuo caso
      const startHour = 0;
      const endHour = 24;
      const hoursDisplayed = endHour - startHour;
      const pixelsPerHour = availableHeight / hoursDisplayed;
      
      // Crea un elemento manuale per ogni evento
      staffEvents.forEach(event => {
        try {
          // Ottieni l'ora di inizio e fine dell'evento
          const eventStart = new Date(event.start);
          const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 30 * 60000);
          
          // Calcola ore dall'inizio del giorno
          const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
          const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
          const durationHours = endHour - startHour;
          
          // Calcola posizione e dimensione
          const topPosition = headerHeight + (startHour * pixelsPerHour);
          const eventHeight = Math.max(30, durationHours * pixelsPerHour);
          
          // Determina stato dell'appuntamento
          const status = event.extendedProps?.status || 'default';
          
          // Crea l'elemento manuale
          const manualEvent = document.createElement('div');
          manualEvent.className = `manual-appointment-event appointment-status-${status}`;
          manualEvent.setAttribute('data-event-id', event.id);
          
          // Imposta lo stile e la posizione
          manualEvent.style.position = 'absolute';
          manualEvent.style.top = `${topPosition}px`;
          manualEvent.style.left = '4px';
          manualEvent.style.right = '4px';
          manualEvent.style.height = `${eventHeight}px`;
          manualEvent.style.zIndex = '1000';
          
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
    
    // Esegui debug dopo la creazione
    setTimeout(debugDOMElements, 500);
    
  }, [events, staffMembers, commonConfig, getStaffName, debugDOMElements]);
  
  // Completamente rimuove gli eventi nativi FullCalendar
  const hideNativeEvents = useCallback(() => {
    document.querySelectorAll('.fc-timegrid-event, .fc-timegrid-event-harness').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
    });
  }, []);
  
  // Funzione che esegue tutte le operazioni necessarie per gli eventi manuali
  const setupEvents = useCallback(() => {
    console.log("🔄 Setup eventi manuali");
    
    // Prima nascondi gli eventi nativi
    hideNativeEvents();
    
    // Poi crea gli eventi manuali
    createManualEvents();
    
    // Incrementa il contatore di rendering
    setRenderCount(prev => prev + 1);
  }, [hideNativeEvents, createManualEvents]);
  
  // Applica i blocchi di tempo dopo il rendering iniziale
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Setup completo degli eventi manuali con approccio robusto
  useEffect(() => {
    console.log("🔄 Inizializzazione eventi manuali");
    
    // Esegui immediatamente
    setupEvents();
    
    // Programma esecuzioni con tempi crescenti
    const timers = [
      setTimeout(setupEvents, 100),
      setTimeout(setupEvents, 500),
      setTimeout(setupEvents, 1000),
      setTimeout(setupEvents, 2000)
    ];
    
    // Observer per rilevare cambiamenti nella vista
    const viewObserver = new MutationObserver(() => {
      console.log("🔍 Rilevato cambiamento nella vista, ricreo eventi manuali");
      setupEvents();
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
  
  // Log di diagnostica
  useEffect(() => {
    console.log(`📊 Render #${renderCount}: ${events.length} eventi totali per ${staffMembers.length} staff`);
    
    // Debug del DOM dopo ogni rendering
    const debugTimer = setTimeout(debugDOMElements, 500);
    
    return () => clearTimeout(debugTimer);
  }, [renderCount, events, staffMembers, debugDOMElements]);
  
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
                  
                  // Forza la creazione degli eventi manuali dopo che il calendario è pronto
                  setTimeout(setupEvents, 100);
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
