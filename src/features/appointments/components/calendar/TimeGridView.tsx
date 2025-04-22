
import React, { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { CalendarHeader } from './CalendarHeader';
import { StaffHeader } from './StaffHeader';
import { TimeColumn } from './TimeColumn';
import { StaffColumns } from './StaffColumns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
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
  const { getBlockTimeEvents } = useStaffBlockTime();
  
  // Get all blocked time events
  const blockTimeEvents = getBlockTimeEvents();

  // Ensure blockTimeEvents are properly configured with all required attributes
  const enhancedBlockTimeEvents = blockTimeEvents.map(event => ({
    ...event,
    display: 'background',
    rendering: 'background',
    className: 'blocked-time-event',
    classNames: ['blocked-time-event'],
    overlap: false,
    backgroundColor: 'rgba(211, 211, 211, 0.7)'
  }));
  
  // Combine normal events with block time events
  const allEvents = [...events, ...enhancedBlockTimeEvents];
  
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();

  // Apply block time styling whenever blockTimeEvents changes
  useEffect(() => {
    // Apply block time styling after a short delay
    if (blockTimeEvents.length > 0) {
      setTimeout(() => {
        try {
          document.querySelectorAll('.fc-bg-event').forEach(el => {
            el.classList.add('blocked-time-event');
          });
        } catch (error) {
          console.error("Error applying block time styling:", error);
        }
      }, 100);
    }
  }, [blockTimeEvents]);

  // Set up synchronized grid columns after render
  useEffect(() => {
    if (staffMembers.length > 0 && !gridInitialized) {
      setGridInitialized(true);
      
      setTimeout(() => {
        try {
          const calendarGridBody = document.querySelector('.calendar-grid-body');
          if (calendarGridBody) {
            calendarGridBody.classList.add('unified-calendar-grid');
          }
          
          const appointmentCalendar = document.querySelector('.staff-calendar-block');
          if (appointmentCalendar) {
            appointmentCalendar.classList.add('calendar-scrollable');
          }

          // Apply block time styling to all existing blocked time events
          document.querySelectorAll('.fc-bg-event').forEach(el => {
            el.classList.add('blocked-time-event');
          });
        } catch (error) {
          console.error("Error initializing grid layout:", error);
        }
      }, 50);
    }
  }, [staffMembers, gridInitialized]);

  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-block">
      <div className="flex items-center justify-between px-4 py-2">
        <CalendarHeader selectedDate={validSelectedDate} />
        
        {view === 'timeGridWeek' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(validSelectedDate, "EEEE d MMMM yyyy", { locale: it })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={validSelectedDate}
                onSelect={(date) => {
                  if (date) {
                    try {
                      const api = calendarRefs.current[0]?.getApi();
                      if (api) {
                        api.gotoDate(date);
                      }
                    } catch (error) {
                      console.error("Error navigating to date:", error);
                    }
                  }
                }}
                initialFocus
                locale={it}
              />
            </PopoverContent>
          </Popover>
        )}
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
              eventDidMount: (info: any) => {
                // Add tooltip for blocked times
                if (info.event.extendedProps.isBlockedTime || info.event.classNames?.includes('blocked-time-event')) {
                  // Add classname to ensure proper styling
                  info.el.classList.add('blocked-time-event');
                  
                  const tooltip = document.createElement('div');
                  tooltip.className = 'calendar-tooltip';
                  
                  let tooltipContent = 'Operatore non disponibile';
                  if (info.event.extendedProps.reason) {
                    tooltipContent += `: ${info.event.extendedProps.reason}`;
                  }
                  
                  tooltip.innerText = tooltipContent;
                  info.el.appendChild(tooltip);
                  
                  // Make div with blocked time not draggable
                  info.el.classList.add('blocked-time');
                  
                  // Show tooltip on hover
                  info.el.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                  });
                  
                  info.el.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                  });
                }
                
                // Call original eventDidMount if exists
                if (commonConfig.eventDidMount) {
                  commonConfig.eventDidMount(info);
                }
              },
              eventAllow: (dropInfo: any, draggedEvent: any) => {
                // Prevent dropping events on blocked times
                const blockEvents = blockTimeEvents;
                for (const blockEvent of blockEvents) {
                  if (
                    blockEvent.resourceId === dropInfo.resource?.id &&
                    new Date(dropInfo.start) >= new Date(blockEvent.start) &&
                    new Date(dropInfo.start) < new Date(blockEvent.end)
                  ) {
                    return false;
                  }
                }
                
                // Allow the drop if no block found
                return true;
              }
            }}
            calendarRefs={calendarRefs}
            setCalendarApi={setCalendarApi}
          />
        </div>
      </div>
    </div>
  );
};
