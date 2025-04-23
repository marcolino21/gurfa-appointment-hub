
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Data *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: it }) : <span>Seleziona data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              locale={it}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Stato</Label>
        <Select 
          value={formData.status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="confirmed">Confermato</SelectItem>
            <SelectItem value="completed">Completato</SelectItem>
            <SelectItem value="cancelled">Cancellato</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
