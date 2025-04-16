
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceFormValues } from '../../types';
import { StaffMember } from '@/types';

interface ServiceStaffTabProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
  staffMembers: StaffMember[];
}

export const ServiceStaffTab: React.FC<ServiceStaffTabProps> = ({ 
  serviceForm,
  staffMembers
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Membri del team richiesti</h3>
        <p className="text-sm text-muted-foreground">
          Scegli quali membri del team offriranno questo servizio
        </p>
      </div>

      <div className="border rounded-md p-4">
        <FormField
          control={serviceForm.control}
          name="assignedStaffIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <Checkbox 
                  id="select-all" 
                  onCheckedChange={(checked) => {
                    const allStaffIds = staffMembers.map(staff => staff.id);
                    if (checked) {
                      serviceForm.setValue('assignedStaffIds', allStaffIds);
                    } else {
                      serviceForm.setValue('assignedStaffIds', []);
                    }
                  }} 
                  checked={
                    serviceForm.getValues('assignedStaffIds').length === staffMembers.length
                  }
                />
                <label
                  htmlFor="select-all"
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tutti i membri del team ({staffMembers.length})
                </label>
              </div>

              <div className="space-y-4">
                {staffMembers.map((staff) => (
                  <FormField
                    key={staff.id}
                    control={serviceForm.control}
                    name="assignedStaffIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(staff.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, staff.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== staff.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: staff.color || '#9b87f5' }}
                            >
                              {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                            <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {staff.firstName} {staff.lastName}
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
