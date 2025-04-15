
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StaffFormValues, staffSchema } from '../types';
import { Service } from '@/types';
import { getInitials } from '../utils/staffUtils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type StaffFormProps = {
  defaultValues?: StaffFormValues;
  services: Service[];
  onSubmit: (data: StaffFormValues) => void;
  isEdit?: boolean;
};

const StaffForm: React.FC<StaffFormProps> = ({ 
  defaultValues,
  services,
  onSubmit,
  isEdit = false
}) => {
  const [activeTab, setActiveTab] = useState('profilo');

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalPhone: '',
      country: 'Italia',
      birthDate: '',
      position: '',
      color: '#9b87f5',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: [],
    }
  });

  return (
    <Form {...staffForm}>
      <form onSubmit={staffForm.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="profilo">Profilo</TabsTrigger>
            <TabsTrigger value="servizi">Servizi</TabsTrigger>
            <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profilo" className="space-y-4 mt-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-medium"
                  style={{ backgroundColor: staffForm.watch('color') }}
                >
                  {getInitials(staffForm.watch('firstName'), staffForm.watch('lastName'))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={staffForm.control}
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
                control={staffForm.control}
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
              control={staffForm.control}
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
              control={staffForm.control}
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
              control={staffForm.control}
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
              control={staffForm.control}
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
          </TabsContent>

          <TabsContent value="servizi" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="impostazioni" className="space-y-4 mt-4">
            <FormField
              control={staffForm.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posizione lavorativa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Es. Parrucchiere, Estetista..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore calendario</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        {...field} 
                        type="color" 
                        className="w-12 h-10 p-1" 
                      />
                      <Input 
                        {...field} 
                        className="flex-1" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Profilo attivo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value 
                        ? "Il membro dello staff è attivo e può accedere al sistema" 
                        : "Il membro dello staff è disattivato e non può accedere al sistema"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="showInCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visibile in agenda</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value 
                        ? "Il membro dello staff è visibile nella vista agenda" 
                        : "Il membro dello staff è nascosto nella vista agenda"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{isEdit ? 'Salva modifiche' : 'Aggiungi membro'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StaffForm;
