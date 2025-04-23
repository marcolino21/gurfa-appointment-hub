
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectFormValues, StaffMember } from '@/types';

interface ProjectStaffSelectorProps {
  form: UseFormReturn<ProjectFormValues>;
  staffMembers: StaffMember[];
}

export const ProjectStaffSelector: React.FC<ProjectStaffSelectorProps> = ({ form, staffMembers }) => {
  return (
    <FormField
      control={form.control}
      name="staffIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Staff Assegnato</FormLabel>
          <Select
            value={field.value ? field.value[0] : ''}
            onValueChange={(value) => field.onChange([value])}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona staff" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.firstName} {staff.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
