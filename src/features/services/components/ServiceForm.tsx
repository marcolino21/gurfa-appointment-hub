import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Service, ServiceCategory, StaffMember } from '@/types';
import { ServiceFormValues, serviceSchema } from '../types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Euro } from 'lucide-react';

interface ServiceFormProps {
  categories: ServiceCategory[];
  staffMembers: StaffMember[];
  selectedService: Service | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (data: ServiceFormValues) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ 
  categories, 
  staffMembers, 
  selectedService, 
  activeTab,
  setActiveTab,
  onSubmit 
}) => {
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: selectedService ? {
      name: selectedService.name,
      category: selectedService.category,
      description: selectedService.description || '',
      duration: selectedService.duration,
      price: selectedService.price,
      color: selectedService.color,
      assignedStaffIds: selectedService.assignedStaffIds || [],
      customCategory: '',
    } : {
      name: '',
      category: categories.length > 0 ? categories[0].id : '',
      description: '',
      duration: 30,
      price: 0,
      color: categories.length > 0 ? categories[0].color : '#9b87f5',
      assignedStaffIds: [],
      customCategory: '',
    }
  });

  return (
    <Form {...serviceForm}>
      <form onSubmit={serviceForm.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dettagli">Dettagli di base</TabsTrigger>
            <TabsTrigger value="staff">Membri del team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dettagli" className="space-y-4 mt-4">
            <FormField
              control={serviceForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome del servizio</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Es. Taglio capelli uomo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={serviceForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome categoria</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={useCustomCategory}
                        onCheckedChange={(checked) => {
                          setUseCustomCategory(!!checked);
                          if (checked) {
                            serviceForm.setValue('category', '');
                          } else {
                            serviceForm.setValue('category', categories[0]?.id || '');
                          }
                        }}
                      />
                      <label htmlFor="custom-category" className="text-sm font-medium">
                        Inserisci categoria personalizzata
                      </label>
                    </div>
                    
                    {useCustomCategory ? (
                      <FormControl>
                        <Input
                          placeholder="Inserisci nome categoria"
                          {...serviceForm.register('customCategory')}
                        />
                      </FormControl>
                    ) : (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                            >
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: category.color }} 
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colore</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          {...field} 
                          type="color" 
                          className="w-12 h-10 p-1" 
                        />
                        <Input 
                          {...field} 
                          placeholder="Codice colore" 
                          className="flex-1" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={serviceForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione (Facoltativo)</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      rows={3}
                      placeholder="Aggiungi una breve descrizione"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={serviceForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durata</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona durata" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minuti</SelectItem>
                        <SelectItem value="30">30 minuti</SelectItem>
                        <SelectItem value="45">45 minuti</SelectItem>
                        <SelectItem value="60">1 ora</SelectItem>
                        <SelectItem value="90">1 ora 30 minuti</SelectItem>
                        <SelectItem value="120">2 ore</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          step="0.01"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8" 
                          placeholder="0.00" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 mt-4">
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
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{selectedService ? 'Salva modifiche' : 'Aggiungi servizio'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
