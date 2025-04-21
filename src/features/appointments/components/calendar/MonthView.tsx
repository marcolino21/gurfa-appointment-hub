
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { StaffMember } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
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
}) => {
  // Safe date formatting function
  const safeFormat = (date: Date | undefined, formatStr: string) => {
    try {
      if (!date) return '';
      
      try {
        // Try with Italian locale
        return format(date, formatStr, { locale: it });
      } catch (localeError) {
        // Fallback to default locale
        return format(date, formatStr);
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return date ? date.toLocaleDateString() : '';
    }
  };

  return (
    <div className="h-[calc(100vh-320px)] staff-calendar-container">
      <div className="month-view-date-header">
        {safeFormat(selectedDate || new Date(), 'MMMM yyyy')}
      </div>
      
      <div className="mb-2 flex justify-center">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button className="bg-white border border-gray-300 rounded px-4 py-1 text-sm font-medium hover:bg-gray-50">
              {selectedDate ? safeFormat(selectedDate, 'd MMMM yyyy') : 'Seleziona data'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
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
                initialDate={selectedDate}
                {...commonConfig}
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
                  const dateNum = document.createElement('div');
                  dateNum.className = 'text-xs font-medium text-gray-500';
                  dateNum.textContent = info.date.getDate().toString();
                  
                  const cellContent = info.el.querySelector('.fc-daygrid-day-top');
                  if (cellContent) {
                    cellContent.innerHTML = '';
                    cellContent.appendChild(dateNum);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
