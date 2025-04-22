
import React, { useState } from 'react';
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
  
  // Ensure we have a valid date to avoid formatting errors
  const validSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    ? new Date(selectedDate.getTime())
    : new Date();

  // Set up synchronized grid columns after render
  React.useEffect(() => {
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
            events={events}
            selectedDate={validSelectedDate}
            commonConfig={commonConfig}
            calendarRefs={calendarRefs}
            setCalendarApi={setCalendarApi}
          />
        </div>
      </div>
    </div>
  );
};
