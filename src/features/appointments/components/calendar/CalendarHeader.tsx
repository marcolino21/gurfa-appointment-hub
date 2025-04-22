
import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CalendarHeaderProps {
  selectedDate: Date;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ selectedDate }) => {
  const getFormattedDate = () => {
    try {
      if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        console.error('Invalid date detected before formatting:', selectedDate);
        return new Date().toLocaleDateString('it-IT', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }
      
      return format(selectedDate, 'EEEE d MMMM yyyy', { locale: it });
    } catch (error) {
      console.error('Error formatting date with Italian locale:', error);
      try {
        return format(new Date(), 'EEEE d MMMM yyyy');
      } catch (fallbackError) {
        console.error('Fallback date formatting failed:', fallbackError);
        return new Date().toLocaleDateString();
      }
    }
  };

  return (
    <div className="staff-calendar-header">
      {getFormattedDate()}
    </div>
  );
};
