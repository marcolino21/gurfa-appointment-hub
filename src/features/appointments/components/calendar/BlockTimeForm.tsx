
import React, { useState } from 'react';
import { StaffMember } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface BlockTimeFormProps {
  staffMember: StaffMember | null;
  onCancel: () => void;
  onSubmit: (data: BlockTimeFormData) => void;
}

export interface BlockTimeFormData {
  staffId: string;
  startTime: string;
  endTime: string;
  blockType: 'today' | 'period';
  startDate?: Date;
  endDate?: Date;
  reason?: string;
}

const blockTimeSchema = z.object({
  staffId: z.string(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato orario richiesto: HH:MM"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato orario richiesto: HH:MM"),
  blockType: z.enum(['today', 'period']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  reason: z.string().optional()
}).refine(data => {
  if (data.blockType === 'period') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: "Seleziona le date del periodo",
  path: ["startDate"]
}).refine(data => {
  if (data.blockType === 'period' && data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "La data di fine deve essere successiva alla data di inizio",
  path: ["endDate"]
});

export const BlockTimeForm: React.FC<BlockTimeFormProps> = ({ 
  staffMember, 
  onCancel,
  onSubmit 
}) => {
  const today = new Date();
  
  const form = useForm<BlockTimeFormData>({
    resolver: zodResolver(blockTimeSchema),
    defaultValues: {
      staffId: staffMember?.id || '',
      startTime: '09:00',
      endTime: '18:00',
      blockType: 'today',
      startDate: undefined,
      endDate: undefined,
      reason: ''
    }
  });

  React.useEffect(() => {
    if (staffMember) {
      form.setValue('staffId', staffMember.id);
    }
  }, [staffMember, form]);

  const blockType = form.watch('blockType');

  const handleSubmit = (data: BlockTimeFormData) => {
    onSubmit({
      ...data,
      startDate: data.blockType === 'today' ? today : data.startDate,
      endDate: data.blockType === 'today' ? today : data.endDate
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dalle</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alle</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="blockType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Applicazione</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today">Solo oggi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="period" id="period" />
                    <Label htmlFor="period">Periodo</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {blockType === 'period' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dal giorno</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            !field.value ? "text-muted-foreground" : ""
                          }
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: it })
                          ) : (
                            <span>Seleziona la data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < today
                        }
                        initialFocus
                        locale={it}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Al giorno</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            !field.value ? "text-muted-foreground" : ""
                          }
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: it })
                          ) : (
                            <span>Seleziona la data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return date < today || (startDate && date < startDate);
                        }}
                        initialFocus
                        locale={it}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo del blocco (opzionale)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Inserisci il motivo del blocco..." 
                  className="resize-none" 
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
          <Button type="submit">Conferma</Button>
        </div>
      </form>
    </Form>
  );
};
