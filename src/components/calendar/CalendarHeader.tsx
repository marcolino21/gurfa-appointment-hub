
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointmentStore } from '@/store/appointmentStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, startOfWeek, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';

interface CalendarHeaderProps {
  onCreateAppointment: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateAppointment }) => {
  const { selectedDate, view, setSelectedDate, setView } = useAppointmentStore();

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Navigate to previous period
  const goToPrev = () => {
    if (view === 'day') {
      setSelectedDate(addDays(selectedDate, -1));
    } else if (view === 'week') {
      setSelectedDate(addWeeks(selectedDate, -1));
    } else {
      setSelectedDate(addMonths(selectedDate, -1));
    }
  };

  // Navigate to next period
  const goToNext = () => {
    if (view === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (view === 'week') {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  // Format the date range for display
  const getDateRangeText = () => {
    if (view === 'day') {
      return format(selectedDate, 'EEEE d MMMM yyyy', { locale: it });
    } else if (view === 'week') {
      const start = startOfWeek(selectedDate, { locale: it });
      const end = addDays(start, 6);
      
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'd')} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, 'd MMMM')} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
      } else {
        return `${format(start, 'd MMMM yyyy')} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
      }
    } else {
      return format(selectedDate, 'MMMM yyyy', { locale: it });
    }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Oggi
        </Button>
        <Button variant="outline" size="sm" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold ml-2">
          {getDateRangeText()}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={view} onValueChange={(newView) => setView(newView as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Giorno</SelectItem>
            <SelectItem value="week">Settimana</SelectItem>
            <SelectItem value="month">Mese</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={onCreateAppointment}>
          <Plus className="mr-2 h-4 w-4" /> Nuovo
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
