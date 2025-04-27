
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { StaffMember } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';
import '../../styles/index.css';

interface MonthViewProps {
  staffMembers: StaffMember[];
  events: any[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  commonConfig: any;
  calendarRefs: React.MutableRefObject<any[]>;
  setCalendarApi: (api: any) => void;
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
  zoomLevel?: number;
  onZoomChange?: (level: number) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  staffMembers,
  events,
  selectedDate,
  onDateSelect,
  commonConfig,
  calendarRefs,
  setCalendarApi,
  datePickerOpen,
  setDatePickerOpen,
  zoomLevel = 1,
  onZoomChange
}) => {
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? selectedDate
    : new Date();

  // Safe date formatting function with robust error handling
  const safeFormat = (date: Date | undefined, formatStr: string) => {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    
    try {
      // Try with Italian locale
      return format(date, formatStr, { locale: it });
    } catch (localeError) {
      console.warn('Error using Italian locale, falling back to default:', localeError);
      try {
        // Fallback to default locale
        return format(date, formatStr);
      } catch (formatError) {
        console.error('Error formatting date:', formatError);
        return date.toLocaleDateString();
      }
    }
  };

  // Create a safer version of the common config with explicit formats
  const safeCommonConfig = {
    ...commonConfig,
    locale: 'it',
    timeZone: 'local',
    dayHeaderFormat: { 
      weekday: 'short'
    },
    titleFormat: { 
      month: 'long', 
      year: 'numeric' 
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    views: {
      dayGridMonth: {
        dayHeaderFormat: { weekday: 'short' },
        dayHeaderContent: (args: any) => {
          if (!args || !args.date) return '';
          try {
            const day = args.date.getDate();
            return day.toString();
          } catch (e) {
            console.error('Error formatting day header:', e);
            return '';
          }
        }
      }
    }
  };

  // Funzione per gestire lo zoom dal controllo slider
  const handleZoomSliderChange = (value: number[]) => {
    if (onZoomChange && value[0]) {
      onZoomChange(value[0]);
    }
  };

  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-container">
      <div className="month-view-date-header flex justify-between items-center px-4">
        <div>{safeFormat(validSelectedDate, 'MMMM yyyy')}</div>
        
        {/* Controllo zoom */}
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
      </div>
      
      <div className="mb-2 flex justify-center">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button className="bg-white border border-gray-300 rounded px-4 py-1 text-sm font-medium hover:bg-gray-50">
              {selectedDate ? safeFormat(selectedDate, 'd MMMM yyyy') : 'Seleziona data'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid sync-scroll-container" style={{ 
        gridTemplateColumns: `repeat(${staffMembers.length}, 1fr)`,
        height: 'calc(100% - 80px)',
        gap: '1px',
        backgroundColor: '#e5e7eb'
      }}>
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="bg-white h-full staff-column">
            <div 
              className="staff-column-header"
              style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
            >
              {staff.firstName} {staff.lastName}
            </div>
            
            <div className="h-[calc(100%-42px)] custom-month-view">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={validSelectedDate}
                {...safeCommonConfig}
                events={events.filter(event => event.resourceId === staff.id)}
                ref={(el) => {
                  if (el) {
                    calendarRefs.current[index] = el;
                    if (index === 0) setCalendarApi(el.getApi());
                  }
                }}
                eventContent={(arg) => (
                  <div className="text-xs overflow-hidden whitespace-nowrap">
                    {arg.event.title}
                  </div>
                )}
                dayCellDidMount={(info) => {
                  try {
                    if (!info || !info.date || !info.el) return;
                    
                    const dateNum = document.createElement('div');
                    dateNum.className = 'text-xs font-medium text-gray-500';
                    dateNum.textContent = info.date.getDate().toString();
                    
                    const cellContent = info.el.querySelector('.fc-daygrid-day-top');
                    if (cellContent) {
                      cellContent.innerHTML = '';
                      cellContent.appendChild(dateNum);
                    }
                    
                    // Apply zoom level to the cell
                    if (zoomLevel && zoomLevel !== 1) {
                      const cell = info.el;
                      const defaultHeight = 80; // Altezza predefinita della cella
                      const newHeight = defaultHeight * zoomLevel;
                      cell.style.height = `${newHeight}px`;
                    }
                  } catch (error) {
                    console.error('Error in dayCellDidMount:', error);
                  }
                }}
                // Abilita il drag & drop
                editable={true}
                eventDraggable={true}
                eventStartEditable={true}
                droppable={true}
                eventResizableFromStart={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
