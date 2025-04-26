
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
  const selectedCategoryId = form.watch('categoryId');

  const handleCategoryChange = (value: string) => {
    form.setValue('categoryId', value);
    form.setValue('subcategoryId', ''); // Reset subcategory when category changes
  };

  return (
    <div className="space-y-4">
      {!useCustomCategory ? (
        <>
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

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value}
                  onValueChange={handleCategoryChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
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

          {selectedCategoryId && subcategories.length > 0 && (
            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sottocategoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una sottocategoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      ) : (
        <FormField
          control={form.control}
          name="customCategory"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Categoria personalizzata</FormLabel>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Usa categorie esistenti</span>
                  <Switch 
                    checked={useCustomCategory} 
                    onCheckedChange={(checked) => setUseCustomCategory(checked)}
                  />
                </div>
              </div>
              <FormControl>
                <Input placeholder="Inserisci una categoria personalizzata" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
