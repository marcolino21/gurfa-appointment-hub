
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../../types';
import { Service } from '@/types';
import {
  FormField,
  FormItem,
  FormControl,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface ServicesTabProps {
  staffForm: UseFormReturn<StaffFormValues>;
  services: Service[];
}

const ServicesTab: React.FC<ServicesTabProps> = ({ staffForm, services }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Servizi offerti</h3>
        <p className="text-sm text-muted-foreground">
          Seleziona i servizi che questo membro dello staff può offrire
        </p>
      </div>

      <div className="border rounded-md p-4">
        <FormField
          control={staffForm.control}
          name="assignedServiceIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <Checkbox 
                  id="select-all-services" 
                  onCheckedChange={(checked) => {
                    const allServiceIds = services.map(service => service.id);
                    if (checked) {
                      staffForm.setValue('assignedServiceIds', allServiceIds);
                    } else {
                      staffForm.setValue('assignedServiceIds', []);
                    }
                  }} 
                  checked={
                    services.length > 0 &&
                    staffForm.getValues('assignedServiceIds').length === services.length
                  }
                />
                <label
                  htmlFor="select-all-services"
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tutti i servizi ({services.length})
                </label>
              </div>

              <div className="space-y-4">
                {services.map((service) => (
                  <FormField
                    key={service.id}
                    control={staffForm.control}
                    name="assignedServiceIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(service.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, service.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== service.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full mr-1" 
                              style={{ backgroundColor: service.color }} 
                            />
                            <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {service.name}
                            </label>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ServicesTab;
