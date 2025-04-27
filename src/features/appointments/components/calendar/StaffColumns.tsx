
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid'; // Added dayGrid for standard-compliant views
import { StaffMember } from '@/types';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Import specific styles
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
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const eventElRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Helper function to get staff name
  const getStaffName = useCallback((staff: StaffMember) => {
    return `${staff.firstName} ${staff.lastName}`.trim() || 'Operatore';
  }, []);
  
  // Apply time blocks after initial rendering
  useEffect(() => {
    const timer = setTimeout(applyBlockedTimeStyles, 300);
    return () => clearTimeout(timer);
  }, [applyBlockedTimeStyles]);
  
  // Handle event drag start
  const handleEventDragStart = useCallback((info: any) => {
    setIsDragging(true);
    info.el.classList.add('event-dragging');
    
    // Create drag tooltip
    const dragTooltip = document.createElement('div');
    dragTooltip.className = 'drag-tooltip';
    dragTooltip.textContent = 'Rilascia per riposizionare';
    document.body.appendChild(dragTooltip);
    
    // Update tooltip position during drag
    const updateTooltipPosition = (e: MouseEvent) => {
      dragTooltip.style.left = `${e.clientX + 15}px`;
      dragTooltip.style.top = `${e.clientY + 15}px`;
    };
    
    document.addEventListener('mousemove', updateTooltipPosition);
    
    // Save references for cleanup
    info.el.dragTooltip = dragTooltip;
    info.el.updateTooltipPosition = updateTooltipPosition;
  }, []);
  
  // Handle event drag stop
  const handleEventDragStop = useCallback((info: any) => {
    setIsDragging(false);
    info.el.classList.remove('event-dragging');
    
    // Remove drag tooltip
    if (info.el.dragTooltip) {
      document.body.removeChild(info.el.dragTooltip);
      document.removeEventListener('mousemove', info.el.updateTooltipPosition);
      delete info.el.dragTooltip;
      delete info.el.updateTooltipPosition;
    }
  }, []);
  
  // Handle resize start
  const handleEventResizeStart = useCallback((info: any) => {
    setIsResizing(true);
    info.el.classList.add('event-resizing');
    
    // Show informational tooltip
    toast({
      title: "Ridimensionamento",
      description: "Trascina per modificare la durata",
      duration: 2000
    });
  }, [toast]);
  
  // Handle resize stop
  const handleEventResizeStop = useCallback((info: any) => {
    setIsResizing(false);
    info.el.classList.remove('event-resizing');
  }, []);
  
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
        
        // Normalize staff ID for comparison
        const staffIdStr = String(staff.id);
        
        // Filter events for this specific staff member
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
              plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]} // Added dayGridPlugin
              initialView="timeGridDay"
              initialDate={selectedDate}
              {...commonConfig}
              // Simplified configuration for standard version
              eventMinHeight={30}
              slotEventOverlap={false}
              slotDuration={'00:30:00'}
              snapDuration={'00:15:00'}
              nowIndicator={false}
              // Interactive features
              eventDurationEditable={true}
              eventStartEditable={true}
              eventResizableFromStart={true}
              dragRevertDuration={200}
              dragScroll={true}
              forceEventDuration={true}
              displayEventEnd={true}
              allDaySlot={false}
              dayMaxEvents={false}
              // Fix for standard FullCalendar
              height="auto", // Changed from 100% to auto
              dayHeaderContent={() => null}
              slotLabelContent={({ date }) => (
                <div style={{ fontSize: '0.7rem', color: '#888' }}>
                  {format(date, 'HH:mm', { locale: it })}
                </div>
              )}
              events={staffEvents}
              headerToolbar={false}
              dayCellClassNames={isBlocked ? 'blocked-staff-column' : ''}
              viewClassNames={isBlocked ? 'blocked-staff-view' : ''}
              // Interaction events
              eventDragStart={handleEventDragStart}
              eventDragStop={handleEventDragStop}
              eventResizeStart={handleEventResizeStart}
              eventResizeStop={handleEventResizeStop}
              eventResize={(info) => {
                if (commonConfig.eventResize) {
                  commonConfig.eventResize(info);
                } else if (commonConfig.eventDrop) {
                  // Use eventDrop as fallback if eventResize isn't defined
                  commonConfig.eventDrop(info);
                }
              }}
              eventDrop={(info) => {
                if (commonConfig.eventDrop) {
                  commonConfig.eventDrop(info);
                }
              }}
              eventDidMount={(info) => {
                // Save event element references
                eventElRefs.current.set(info.event.id, info.el);
                
                if (commonConfig.eventDidMount) {
                  commonConfig.eventDidMount(info);
                }
                
                // Add custom resize handles
                const eventEl = info.el;
                
                // Add class for interactive styling
                eventEl.classList.add('interactive-event');
                
                // Add accessibility attributes
                eventEl.setAttribute('aria-label', `Appuntamento: ${info.event.title}`);
                eventEl.setAttribute('role', 'button');
                eventEl.setAttribute('tabindex', '0');
                
                // Add event data
                eventEl.dataset.eventId = info.event.id;
                eventEl.dataset.eventStatus = info.event.extendedProps?.status || 'default';
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
