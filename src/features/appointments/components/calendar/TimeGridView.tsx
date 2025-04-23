
import React, { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { CalendarHeader } from './CalendarHeader';
import { StaffHeader } from './StaffHeader';
import { TimeColumn } from './TimeColumn';
import { StaffColumns } from './StaffColumns';
import { CalendarControls } from './CalendarControls';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { TooltipProvider } from "@/components/ui/tooltip";
import '../../styles/index.css';

interface TimeGridViewProps {
  staffMembers: StaffMember[];
  events: any[];
  view: 'timeGridDay' | 'timeGridWeek';
  selectedDate?: Date;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
}

export const TimeGridView: React.FC<TimeGridViewProps> = ({
  staffMembers,
  events,
  view,
  selectedDate,
  commonConfig,
  calendarRefs,
  setCalendarApi
}) => {
  const [gridInitialized, setGridInitialized] = useState(false);
  const { enhancedBlockTimeEvents } = useCalendarBlockTime();
  
  // Combine normal events with block time events
  const allEvents = [...events, ...enhancedBlockTimeEvents];
  
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();

  // Debug events
  useEffect(() => {
    console.log("TimeGridView events:", allEvents.length);
    console.log("Sample event:", allEvents[0]);
  }, [allEvents]);

  // Set up synchronized grid columns after render
  useEffect(() => {
    if (staffMembers.length > 0 && !gridInitialized) {
      setGridInitialized(true);
      
      // Apply interactivity enhancements
      setTimeout(() => {
        try {
          // Initialize grid layout
          const calendarGridBody = document.querySelector('.calendar-grid-body');
          if (calendarGridBody) {
            calendarGridBody.classList.add('unified-calendar-grid');
          }
          
          // Add calendar scrollable class
          const appointmentCalendar = document.querySelector('.staff-calendar-block');
          if (appointmentCalendar) {
            appointmentCalendar.classList.add('calendar-scrollable');
          }
          
          // Remove any elements that might block interactivity
          document.querySelectorAll('.fc-event-mirror').forEach(el => el.remove());
          
          // Add interactivity attributes to all events
          document.querySelectorAll('.fc-event').forEach(el => {
            el.setAttribute('data-interactive', 'true');
            (el as HTMLElement).style.pointerEvents = 'auto';
            (el as HTMLElement).style.cursor = 'pointer';
            el.classList.add('fc-event-interactive');
          });
        } catch (error) {
          console.error("Error initializing grid layout:", error);
        }
      }, 300);
    }
  }, [staffMembers, gridInitialized]);

  // Ensure events remain interactive after each render
  useEffect(() => {
    const makeEventsInteractive = () => {
      document.querySelectorAll('.fc-event').forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
        (el as HTMLElement).style.cursor = 'pointer';
        el.classList.add('fc-event-interactive');
      });
      
      console.log("Events made interactive");
    };
    
    // Execute immediately
    makeEventsInteractive();
    
    // Execute again after a short delay to catch dynamically added events
    const timerId = setTimeout(makeEventsInteractive, 200);
    // And once more after components settle
    const timerId2 = setTimeout(makeEventsInteractive, 500);
    
    return () => {
      clearTimeout(timerId);
      clearTimeout(timerId2);
    };
  }, [events, allEvents]);

  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-320px)] staff-calendar-block">
        <div className="flex items-center justify-between px-4 py-2">
          <CalendarHeader selectedDate={validSelectedDate} />
          <CalendarControls 
            view={view} 
            selectedDate={validSelectedDate} 
            calendarRefs={calendarRefs}
          />
        </div>

        <StaffHeader staffMembers={staffMembers} />
        
        <div className="calendar-grid-body sync-scroll-container">
          <TimeColumn 
            selectedDate={validSelectedDate}
            commonConfig={commonConfig}
          />
          <div className="calendar-staff-cols unified-calendar-content">
            <StaffColumns
              staffMembers={staffMembers}
              events={allEvents}
              selectedDate={validSelectedDate}
              commonConfig={{
                ...commonConfig,
                eventClassNames: "interactive-event", 
                eventClick: (info: any) => {
                  console.log("Event clicked:", info.event.id);
                  if (commonConfig.eventClick) {
                    commonConfig.eventClick(info);
                  }
                },
                eventDidMount: (info: any) => {
                  // Make event explicitly interactive
                  if (info.el) {
                    info.el.style.pointerEvents = 'auto';
                    info.el.style.cursor = 'pointer';
                    info.el.classList.add('fc-event-interactive');
                    
                    // Add extra click handler just in case
                    info.el.addEventListener('click', () => {
                      console.log("Direct click on event:", info.event.id);
                      if (commonConfig.eventClick) {
                        commonConfig.eventClick({
                          event: info.event,
                          el: info.el,
                          jsEvent: new MouseEvent('click')
                        });
                      }
                    });
                  }
                  
                  // Handle blocked time events
                  if (info.event.extendedProps.isBlockedTime || 
                      info.event.classNames?.includes('blocked-time-event') ||
                      info.event.display === 'background') {
                    info.el.classList.add('blocked-time-event');
                    
                    // Create tooltip for blocked time
                    const tooltip = document.createElement('div');
                    tooltip.className = 'calendar-tooltip';
                    
                    let tooltipContent = 'Operatore non disponibile';
                    if (info.event.extendedProps.reason) {
                      tooltipContent += `: ${info.event.extendedProps.reason}`;
                    }
                    
                    tooltip.innerText = tooltipContent;
                    info.el.appendChild(tooltip);
                    
                    // Simplified event listeners
                    const handleMouseEnter = () => { tooltip.style.display = 'block'; };
                    const handleMouseLeave = () => { tooltip.style.display = 'none'; };
                    
                    info.el.addEventListener('mouseenter', handleMouseEnter);
                    info.el.addEventListener('mouseleave', handleMouseLeave);
                    
                    // Cleanup function
                    info.el.addEventListener('DOMNodeRemoved', () => {
                      info.el.removeEventListener('mouseenter', handleMouseEnter);
                      info.el.removeEventListener('mouseleave', handleMouseLeave);
                    });
                  }
                  
                  if (commonConfig.eventDidMount) {
                    commonConfig.eventDidMount(info);
                  }
                }
              }}
              calendarRefs={calendarRefs}
              setCalendarApi={setCalendarApi}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
