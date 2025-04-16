
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../../types';

interface BusinessInformationProps {
  clientForm: UseFormReturn<ClientFormValues>;
}

const BusinessInformation: React.FC<BusinessInformationProps> = ({ clientForm }) => {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-slate-50">
      <h3 className="font-medium">Dati Aziendali</h3>
      
      <FormField
        control={clientForm.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ragione Sociale</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ragione Sociale" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={clientForm.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partita IVA</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Partita IVA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={clientForm.control}
          name="fiscalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice Fiscale</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Codice Fiscale" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={clientForm.control}
          name="sdiCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice SDI</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Codice SDI" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={clientForm.control}
          name="pecEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PEC</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Indirizzo PEC" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BusinessInformation;
