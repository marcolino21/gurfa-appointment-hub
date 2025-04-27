
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
  
  // Implementazione di eventi manuali che bypassano completamente il sistema di rendering di FullCalendar
  const createManualEvents = useCallback(() => {
    console.log("Creazione eventi manuali come soluzione alternativa");
    
    // Rimuove eventuali eventi manuali precedenti
    document.querySelectorAll('.manual-appointment-event').forEach(el => el.remove());
    document.querySelectorAll('.manual-event-wrapper').forEach(el => el.remove());
    
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
          const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 30 * 60000); // Default 30 minuti
          
          // Durata in minuti
          const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / 60000;
          
          // Calcolo della posizione oraria
          const dayStart = new Date(eventStart);
          dayStart.setHours(0, 0, 0, 0);
          
          // Calcola minuti dall'inizio della giornata
          const minutesFromDayStart = (eventStart.getTime() - dayStart.getTime()) / 60000;
          
          // Altezza di un minuto in pixel (regola in base all'altezza dello slot)
          const minuteHeight = 40 / 60; // 40px per slot da 1 ora diviso 60 minuti
          
          // Calcola la posizione verticale
          const topPosition = minutesFromDayStart * minuteHeight;
          const eventHeight = Math.max(30, durationMinutes * minuteHeight); // Minimo 30px di altezza
          
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
          
          // Crea un wrapper per l'evento manuale
          const eventWrapper = document.createElement('div');
          eventWrapper.className = 'manual-event-wrapper';
          eventWrapper.style.cssText = `
            position: absolute;
            top: ${topPosition}px;
            left: 2px;
            right: 2px;
            height: ${eventHeight}px;
            z-index: 100;
            pointer-events: none;
          `;
          
          // Crea l'elemento manuale
          const manualEvent = document.createElement('div');
          manualEvent.className = `manual-appointment-event appointment-status-${status}`;
          manualEvent.setAttribute('data-event-id', event.id);
          
          // Imposta lo stile in modo esplicito
          manualEvent.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
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
            display: block;
            visibility: visible;
            opacity: 1;
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
          
          // Aggiungi l'evento al wrapper
          eventWrapper.appendChild(manualEvent);

          // Aggiungi il wrapper al DOM
          timeGridBody.appendChild(eventWrapper);
          
          // Aggiungi gestione del click
          manualEvent.addEventListener('click', () => {
            if (commonConfig.eventClick) {
              commonConfig.eventClick({ 
                event: {
                  ...event,
                  // Aggiungi metodi necessari che potrebbero essere usati da eventClick
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
  }, [events, staffMembers, commonConfig]);

  // Apply block time styles once after initial render
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Completamente nasconde gli eventi nativi di FullCalendar nella vista giornaliera
  const hideNativeEvents = useCallback(() => {
    // Seleziona tutti gli elementi degli eventi nativi e li nasconde
    document.querySelectorAll('.fc-timegrid-event, .fc-timegrid-event-harness').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.cssText = `
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          pointer-events: none !important;
        `;
      }
    });
  }, []);

  // Add manual events rendering with improved timing
  useEffect(() => {
    // Funzione che esegue entrambe le operazioni necessarie
    const setupEvents = () => {
      // Prima nascondi gli eventi nativi
      hideNativeEvents();
      // Poi crea gli eventi manuali
      createManualEvents();
    };
    
    // Esegui immediatamente e dopo un breve ritardo
    setupEvents();
    
    // Esegui più volte con delay crescenti per assicurarsi che funzioni
    // anche quando ci sono ritardi nel rendering di FullCalendar
    const timers = [
      setTimeout(setupEvents, 100),
      setTimeout(setupEvents, 300),
      setTimeout(setupEvents, 1000),
      setTimeout(setupEvents, 2000)
    ];
    
    // Applica anche periodicamente per assicurare la persistenza
    const intervalTimer = setInterval(setupEvents, 3000);
    
    // Assicurati di ripetere l'operazione quando cambia la data
    const dateObserver = new MutationObserver((mutations) => {
      setupEvents();
    });
    
    // Osserva cambiamenti nel DOM che potrebbero indicare un cambio di visualizzazione
    const fcElement = document.querySelector('.fc');
    if (fcElement) {
      dateObserver.observe(fcElement, { 
        childList: true, 
        subtree: true,
        attributes: true, 
        attributeFilter: ['class']
      });
    }
    
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(intervalTimer);
      dateObserver.disconnect();
    };
  }, [createManualEvents, hideNativeEvents, events, selectedDate]);
  
  // Diagnosi eventi
  useEffect(() => {
    const diagnoseEvents = () => {
      console.group('📊 Calendar Events Diagnosis');
      
      // Controlla eventi manuali
      const manualEvents = document.querySelectorAll('.manual-appointment-event');
      console.log(`Manual events created: ${manualEvents.length}`);
      
      if (manualEvents.length > 0) {
        console.log('First manual event visible:', 
          manualEvents[0] instanceof HTMLElement 
          ? window.getComputedStyle(manualEvents[0]).display !== 'none' 
          : false
        );
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
              // Configurazione minimalista per eventi nativi (verranno nascosti)
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
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
