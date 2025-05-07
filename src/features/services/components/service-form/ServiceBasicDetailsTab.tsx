
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ServiceFormValues } from '../../types';
import { ServiceCategory } from '@/types';
import { Euro } from 'lucide-react';

interface ServiceBasicDetailsTabProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
  categories: ServiceCategory[];
  useCustomCategory: boolean;
  setUseCustomCategory: (value: boolean) => void;
}

export const ServiceBasicDetailsTab: React.FC<ServiceBasicDetailsTabProps> = ({
  serviceForm,
  categories,
  useCustomCategory,
  setUseCustomCategory
}) => {
  return (
    <div className="space-y-4">
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Nome categoria</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Categoria personalizzata</span>
              <Switch 
                checked={useCustomCategory}
                onCheckedChange={(checked) => {
                  setUseCustomCategory(checked);
                  if (checked) {
                    // Clear the category selection and focus on custom category
                    serviceForm.setValue('category', '');
                    // Reset any validation errors on category when switching
                    serviceForm.clearErrors('category');
                  } else {
                    // Set back to a default category when turning off custom
                    if (categories.length > 0) {
                      serviceForm.setValue('category', categories[0].id);
                    }
                    // Clear the custom category field
                    serviceForm.setValue('customCategory', '');
                  }
                }}
              />
            </div>
          </div>

          {useCustomCategory ? (
            <FormField
              control={serviceForm.control}
              name="customCategory"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Inserisci nome categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={serviceForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={serviceForm.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durata (lavorazione)</FormLabel>
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
          name="tempoDiPosa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo di posa</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tempo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Nessuna posa</SelectItem>
                  <SelectItem value="5">5 minuti</SelectItem>
                  <SelectItem value="10">10 minuti</SelectItem>
                  <SelectItem value="15">15 minuti</SelectItem>
                  <SelectItem value="20">20 minuti</SelectItem>
                  <SelectItem value="30">30 minuti</SelectItem>
                  <SelectItem value="45">45 minuti</SelectItem>
                  <SelectItem value="60">1 ora</SelectItem>
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
    </div>
  );
};
