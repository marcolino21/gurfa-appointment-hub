
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../../types';

interface ClientTypeSelectorProps {
  clientForm: UseFormReturn<ClientFormValues>;
}

const ClientTypeSelector: React.FC<ClientTypeSelectorProps> = ({ clientForm }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 flex justify-center items-start">
        <div className="flex items-center gap-2">
          <FormField
            control={clientForm.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="space-y-1 flex gap-4">
                <FormLabel>Tipo cliente</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'privato')}
                    defaultValue={field.value ? 'privato' : 'azienda'}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="privato" id="privato" />
                      <label htmlFor="privato">Privato</label>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <RadioGroupItem value="azienda" id="azienda" />
                      <label htmlFor="azienda">Azienda</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientTypeSelector;
