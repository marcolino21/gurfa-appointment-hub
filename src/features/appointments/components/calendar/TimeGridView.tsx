
import React, { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { CalendarHeader } from './CalendarHeader';
import { StaffHeader } from './StaffHeader';
import { TimeColumn } from './TimeColumn';
import { StaffColumns } from './StaffColumns';
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
  useEffect(() => {
    if (staffMembers.length > 0 && !gridInitialized) {
      setGridInitialized(true);
      
      setTimeout(() => {
        try {
          const calendarGridBody = document.querySelector('.calendar-grid-body');
          if (calendarGridBody) {
            calendarGridBody.classList.add('unified-calendar-grid');
          }
          
          // Add a class to the main container to ensure proper height and scrolling
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
      <CalendarHeader selectedDate={validSelectedDate} />
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
