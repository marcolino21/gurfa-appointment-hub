
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../../types';

interface AdditionalDetailsProps {
  clientForm: UseFormReturn<ClientFormValues>;
  isPrivate: boolean;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ clientForm, isPrivate }) => {
  return (
    <>
      {isPrivate && (
        <FormField
          control={clientForm.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data di nascita</FormLabel>
              <FormControl>
                <Input {...field} type="date" placeholder="GG/MM/AAAA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {isPrivate && (
        <FormField
          control={clientForm.control}
          name="fiscalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice fiscale</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Codice fiscale" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={clientForm.control}
        name="loyaltyCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Codice tessera</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Codice tessera" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={clientForm.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={4}
                placeholder="Aggiungi note"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AdditionalDetails;
