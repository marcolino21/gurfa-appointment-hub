import React, { useCallback, useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';
  onViewChange: (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onDateChange,
  view,
  onViewChange
}) => {
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = useCallback((date: Date | undefined) => {
    try {
      if (!date) {
        throw new Error('Invalid date selected');
      }

      // Validate date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        toast({
          title: "Data non valida",
          description: "Non è possibile selezionare una data nel passato",
          variant: "destructive"
        });
        return;
      }

      // Validate date is not too far in the future (e.g., 1 year)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (date > oneYearFromNow) {
        toast({
          title: "Data non valida",
          description: "Non è possibile selezionare una data oltre un anno da oggi",
          variant: "destructive"
        });
        return;
      }

      onDateChange(date);
      setIsCalendarOpen(false);
    } catch (error) {
      console.error('Error changing date:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la selezione della data",
        variant: "destructive"
      });
    }
  }, [onDateChange, toast]);

  const handlePrevMonth = useCallback(() => {
    try {
      const newDate = subMonths(selectedDate, 1);
      onDateChange(newDate);
    } catch (error) {
      console.error('Error navigating to previous month:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la navigazione",
        variant: "destructive"
      });
    }
  }, [selectedDate, onDateChange, toast]);

  const handleNextMonth = useCallback(() => {
    try {
      const newDate = addMonths(selectedDate, 1);
      onDateChange(newDate);
    } catch (error) {
      console.error('Error navigating to next month:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la navigazione",
        variant: "destructive"
      });
    }
  }, [selectedDate, onDateChange, toast]);

  const handleViewChange = useCallback((newView: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
    try {
      onViewChange(newView);
    } catch (error) {
      console.error('Error changing view:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il cambio di visualizzazione",
        variant: "destructive"
      });
    }
  }, [onViewChange, toast]);

  return (
    <div className="flex items-center justify-between p-4 border-b" role="toolbar" aria-label="Calendar navigation">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
              aria-label="Select date"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "MMMM yyyy", { locale: it })
              ) : (
                <span>Seleziona data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
                return date < today || date > oneYearFromNow;
              }}
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={view === 'timeGridDay' ? 'default' : 'outline'}
          onClick={() => handleViewChange('timeGridDay')}
          aria-pressed={view === 'timeGridDay'}
        >
          Giorno
        </Button>
        <Button
          variant={view === 'timeGridWeek' ? 'default' : 'outline'}
          onClick={() => handleViewChange('timeGridWeek')}
          aria-pressed={view === 'timeGridWeek'}
        >
          Settimana
        </Button>
        <Button
          variant={view === 'dayGridMonth' ? 'default' : 'outline'}
          onClick={() => handleViewChange('dayGridMonth')}
          aria-pressed={view === 'dayGridMonth'}
        >
          Mese
        </Button>
      </div>
    </div>
  );
};
