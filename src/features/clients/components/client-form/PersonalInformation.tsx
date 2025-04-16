
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../../types';

interface PersonalInformationProps {
  clientForm: UseFormReturn<ClientFormValues>;
  isPrivate: boolean;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ clientForm, isPrivate }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={clientForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isPrivate ? 'Cognome' : 'Cognome Referente'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={isPrivate ? 'Cognome' : 'Cognome Referente'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={clientForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isPrivate ? 'Nome' : 'Nome Referente'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={isPrivate ? 'Nome' : 'Nome Referente'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={clientForm.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Indirizzo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={clientForm.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Città</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Città" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={clientForm.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CAP</FormLabel>
              <FormControl>
                <Input {...field} placeholder="CAP" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={clientForm.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={clientForm.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Telefono" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isPrivate && (
        <FormField
          control={clientForm.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesso</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="M" />
                    <label htmlFor="M">M</label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="F" id="F" />
                    <label htmlFor="F">F</label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="O" id="O" />
                    <label htmlFor="O">Altro</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default PersonalInformation;
