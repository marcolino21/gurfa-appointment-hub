
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceFormValues } from '../../../types';
import { ServiceCategory } from '@/types';

interface ServiceCategoryFieldProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
  categories: ServiceCategory[];
  useCustomCategory: boolean;
  setUseCustomCategory: (value: boolean) => void;
}

export const ServiceCategoryField: React.FC<ServiceCategoryFieldProps> = ({
  serviceForm,
  categories,
  useCustomCategory,
  setUseCustomCategory,
}) => {
  return (
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
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
  );
};
