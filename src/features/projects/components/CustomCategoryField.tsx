
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProjectCategory, ProjectFormValues } from '@/types';

interface CustomCategoryFieldProps {
  form: UseFormReturn<ProjectFormValues>;
  categories: ProjectCategory[];
  useCustomCategory: boolean;
  setUseCustomCategory: (value: boolean) => void;
}

export const CustomCategoryField: React.FC<CustomCategoryFieldProps> = ({
  form,
  categories,
  useCustomCategory,
  setUseCustomCategory
}) => {
  if (!useCustomCategory) {
    return (
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Categoria</FormLabel>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Categoria personalizzata</span>
                <Switch 
                  checked={useCustomCategory} 
                  onCheckedChange={setUseCustomCategory}
                />
              </div>
            </div>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name="customCategory"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Categoria personalizzata</FormLabel>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Usa lista</span>
              <Switch 
                checked={useCustomCategory} 
                onCheckedChange={setUseCustomCategory}
              />
            </div>
          </div>
          <FormControl>
            <Input {...field} placeholder="Inserisci categoria personalizzata" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
