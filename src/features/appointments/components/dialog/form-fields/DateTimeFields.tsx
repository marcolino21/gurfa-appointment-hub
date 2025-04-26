
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimeFieldsProps {
  formData: any;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  handleStatusChange: (value: string) => void;
  generateTimeOptions: () => string[];
}

export const DateTimeFields = ({
  formData,
  date,
  setDate,
  startTime,
  setStartTime,
  handleStatusChange,
  generateTimeOptions
}: DateTimeFieldsProps) => {
  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-4">
      <div className="font-medium text-base mb-2">Data e Orario</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="font-medium">Data *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime" className="font-medium">Ora inizio *</Label>
          <select
            id="startTime"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="font-medium">Stato</Label>
        <select
          id="status"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.status || 'pending'}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="pending">In attesa</option>
          <option value="confirmed">Confermato</option>
          <option value="completed">Completato</option>
          <option value="cancelled">Cancellato</option>
        </select>
      </div>
    </div>
  );
};
