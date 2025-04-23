
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../types';

interface BusinessInfoFieldsProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="vat_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partita IVA</FormLabel>
            <FormControl>
              <Input placeholder="Partita IVA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pec_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PEC</FormLabel>
            <FormControl>
              <Input type="email" placeholder="PEC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sdi_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Codice SDI</FormLabel>
            <FormControl>
              <Input placeholder="Codice SDI" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
