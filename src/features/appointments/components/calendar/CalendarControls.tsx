
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

interface CalendarControlsProps {
  view: 'timeGridDay' | 'timeGridWeek';
  selectedDate: Date;
  calendarRefs: React.MutableRefObject<any[]>;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  view,
  selectedDate,
  calendarRefs,
}) => {
  if (view !== 'timeGridWeek') return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedDate, "EEEE d MMMM yyyy", { locale: it })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
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
  );
};
