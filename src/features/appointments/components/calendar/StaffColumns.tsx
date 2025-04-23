
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

  // Debug log of events
  useEffect(() => {
    console.log("StaffColumns - eventi disponibili:", events.length);
    console.log("StaffColumns - gruppi di eventi per staff:", 
      staffMembers.map(staff => ({
        staffId: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        events: events.filter(event => event.resourceId === staff.id).length
      }))
    );
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
        
        // Filter events for this staff
        const staffEvents = events.filter(event => event.resourceId === staff.id);
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
                // Add special handling for blocked time events
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
