
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
  subcategories: ProjectCategory[];
}

export const CustomCategoryField: React.FC<CustomCategoryFieldProps> = ({
  form,
  categories,
  useCustomCategory,
  setUseCustomCategory,
  subcategories
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Categoria</FormLabel>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Categoria personalizzata</span>
          <Switch
            checked={useCustomCategory}
            onCheckedChange={(checked) => {
              setUseCustomCategory(checked);
              if (checked) {
                form.setValue('categoryId', '');
                form.setValue('subcategoryId', '');
              } else {
                form.setValue('customCategory', '');
              }
            }}
          />
        </div>
      </div>

      {useCustomCategory ? (
        <FormField
          control={form.control}
          name="customCategory"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Nome categoria personalizzata" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('subcategoryId', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('categoryId') && (
            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Sottocategoria</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ''}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una sottocategoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
