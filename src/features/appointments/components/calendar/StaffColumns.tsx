
import React, { useEffect, useMemo } from 'react';
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
              // Custom event content rendering
              eventContent={(eventInfo) => {
                return (
                  <>
                    <div className="fc-event-time">
                      {format(eventInfo.event.start!, 'HH:mm', { locale: it })}
                    </div>
                    <div className="fc-event-title">
                      {eventInfo.event.title}
                    </div>
                  </>
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
