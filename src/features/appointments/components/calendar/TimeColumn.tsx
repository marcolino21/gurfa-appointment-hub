
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

interface TimeColumnProps {
  selectedDate: Date;
  commonConfig: any;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({ selectedDate, commonConfig }) => {
  return (
    <div className="calendar-time-col">
      <div className="calendar-time-inner">
        <FullCalendar
          key="time-col-calendar"
          plugins={[timeGridPlugin]}
          initialView="timeGridDay"
          initialDate={selectedDate}
          {...commonConfig}
          dayHeaderContent={() => null}
          allDaySlot={false}
          slotLabelClassNames="time-slot-label"
          dayCellContent={() => null}
          events={[]}
          headerToolbar={false}
          height="100%"
        />
      </div>
    </div>
  );
};
