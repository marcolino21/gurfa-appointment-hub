
import React, { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { CalendarHeader } from './CalendarHeader';
import { StaffHeader } from './StaffHeader';
import { TimeColumn } from './TimeColumn';
import { StaffColumns } from './StaffColumns';
import { CalendarControls } from './CalendarControls';
import { useCalendarBlockTime } from '../../hooks/useCalendarBlockTime';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';
import '../../styles/index.css';

interface TimeGridViewProps {
  staffMembers: StaffMember[];
  events: any[];
  view: 'timeGridDay' | 'timeGridWeek';
  selectedDate?: Date;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
  zoomLevel?: number;
  onZoomChange?: (level: number) => void;
}

export const TimeGridView: React.FC<TimeGridViewProps> = ({
  staffMembers,
  events,
  view,
  selectedDate,
  commonConfig,
  calendarRefs,
  setCalendarApi,
  zoomLevel = 1,
  onZoomChange
}) => {
  const [gridInitialized, setGridInitialized] = useState(false);
  const { enhancedBlockTimeEvents } = useCalendarBlockTime();
  
  // Combine normal events with block time events
  const allEvents = [...events, ...enhancedBlockTimeEvents];
  
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();

  // Set up synchronized grid columns after render
  useEffect(() => {
    if (staffMembers.length > 0 && !gridInitialized) {
      setGridInitialized(true);
      
      setTimeout(() => {
        try {
          // Add classes for synchronization
          const calendarGridBody = document.querySelector('.calendar-grid-body');
          if (calendarGridBody) {
            calendarGridBody.classList.add('unified-calendar-grid');
          }
          
          console.log("Grid initialized for TimeGridView");
        } catch (error) {
          console.error("Error initializing grid layout:", error);
        }
      }, 300);
    }
  }, [staffMembers, gridInitialized]);

  // Handle zoom slider change
  const handleZoomSliderChange = (value: number[]) => {
    if (onZoomChange && value[0]) {
      onZoomChange(value[0]);
    }
  };

  const containerStyle = {
    minHeight: '500px',
    height: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white'
  };

  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-320px)] min-h-[500px] staff-calendar-block" style={containerStyle}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <CalendarHeader selectedDate={validSelectedDate} />
          <div className="flex items-center space-x-4">
            {/* Zoom control */}
            <div className="flex items-center space-x-2">
              <ZoomOut className="h-4 w-4 text-gray-500" />
              <Slider
                className="w-24"
                defaultValue={[zoomLevel]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={handleZoomSliderChange}
              />
              <ZoomIn className="h-4 w-4 text-gray-500" />
            </div>
            <CalendarControls 
              view={view} 
              selectedDate={validSelectedDate} 
              calendarRefs={calendarRefs}
            />
          </div>
        </div>

        <StaffHeader staffMembers={staffMembers} />
        
        <div className="calendar-grid-body sync-scroll-container" style={{ 
          minHeight: '450px',
          display: 'flex',
          position: 'relative',
          overflowX: 'auto'
        }}>
          <TimeColumn 
            selectedDate={validSelectedDate}
            commonConfig={commonConfig}
          />
          <div className="calendar-staff-cols" style={{ 
            flex: '1',
            overflow: 'auto',
            position: 'relative',
            minHeight: '450px' 
          }}>
            <StaffColumns
              staffMembers={staffMembers}
              events={allEvents}
              selectedDate={validSelectedDate}
              commonConfig={{
                ...commonConfig,
                // Fixes for standard FullCalendar version
                height: 'auto',
                contentHeight: 'auto',
                aspectRatio: 1.8,
                eventDidMount: (info: any) => {
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
                    
                    // Cleanup function for FullCalendar
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
