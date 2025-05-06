
import React from 'react';
import { getInitials } from '../../utils/staffUtils';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ProfileTab = ({ form }: { form: any }) => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-medium"
            style={{ backgroundColor: form.watch('color') }}
          >
            {getInitials(form.watch('firstName'), form.watch('lastName'))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cognome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Cognome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero di telefono</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Numero di telefono" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero di telefono aggiuntivo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Numero di telefono aggiuntivo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data di nascita</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileTab;
