
import React, { useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';

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
      const staffEvents = events.filter(event => event.resourceId === staff.id);
      console.log(`Staff ${getStaffName(staff)} (ID: ${staff.id}) has ${staffEvents.length} events`);
    });
    
    // Log degli eventi senza resourceId o con resourceId non corrispondente
    const orphanedEvents = events.filter(
      event => event.resourceId && !staffMembers.some(staff => staff.id === event.resourceId)
    );
    
    if (orphanedEvents.length > 0) {
      console.warn("Events with invalid resourceId:", orphanedEvents);
    }
    
    const eventsWithoutResource = events.filter(event => !event.resourceId);
    if (eventsWithoutResource.length > 0) {
      console.warn("Events without resourceId:", eventsWithoutResource);
    }
  }, [events, staffMembers]);

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
        
        // Filtra gli eventi per questo membro dello staff specifico
        const staffEvents = events.filter(event => {
          const eventStaffId = String(event.resourceId);
          const staffMatched = eventStaffId === staff.id;
          if (!staffMatched && eventStaffId === staff.id) {
            console.log(`Event ${event.id} has resourceId ${eventStaffId} that almost matches staff ${staff.id} but types differ`);
          }
          return staffMatched;
        });
        
        console.log(`Rendering calendar for ${staff.firstName} ${staff.lastName} (ID: ${staff.id}) with ${staffEvents.length} events`);
        
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
              eventClassNames={(arg) => {
                // Add extra class for blocked time events
                if (arg.event.extendedProps?.isBlockedTime || 
                    arg.event.classNames?.includes('blocked-time-event') ||
                    arg.event.display === 'background') {
                  return ['blocked-time-event', 'fc-non-interactive'];
                }
                return [];
              }}
              eventDidMount={(info) => {
                console.log(`Event mounted: ${info.event.title} for staff ${staff.firstName}`);
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
