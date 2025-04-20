
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../types';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WorkScheduleTabProps {
  staffForm: UseFormReturn<StaffFormValues>;
}

const WorkScheduleTab: React.FC<WorkScheduleTabProps> = ({ staffForm }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Orario di lavoro</h3>
        <p className="text-sm text-muted-foreground">
          Configura i giorni e gli orari di lavoro per questo membro dello staff
        </p>
      </div>
      
      <ScrollArea className="border rounded-md p-4 h-[500px]">
        <div className="space-y-6 pr-4">
          {staffForm.getValues('workSchedule').map((day, index) => (
            <div key={day.day} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{day.day}</h4>
                <FormField
                  control={staffForm.control}
                  name={`workSchedule.${index}.isWorking`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="text-sm">
                        {field.value ? 'Lavorativo' : 'Non lavorativo'}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {staffForm.watch(`workSchedule.${index}.isWorking`) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Orario di lavoro</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={staffForm.control}
                        name={`workSchedule.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Dalle</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={staffForm.control}
                        name={`workSchedule.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Alle</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Pausa</div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={staffForm.control}
                        name={`workSchedule.${index}.breakStart`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Dalle</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={staffForm.control}
                        name={`workSchedule.${index}.breakEnd`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Alle</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkScheduleTab;
