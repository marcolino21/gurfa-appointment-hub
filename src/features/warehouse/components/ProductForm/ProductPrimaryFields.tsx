
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProductBrand } from '@/types';
import { ProductFormValues } from '../../schemas/productSchema';

interface ProductPrimaryFieldsProps {
  form: UseFormReturn<ProductFormValues>;
  brands: ProductBrand[];
}

export const ProductPrimaryFields: React.FC<ProductPrimaryFieldsProps> = ({ form, brands }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome prodotto*</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Barcode</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo di vendita*</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="costPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo di costo</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="stockQuantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantità in magazzino*</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lowStockThreshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Soglia scorta minima</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" />
            </FormControl>
            <FormDescription>
              Soglia per gli avvisi di sottoscorta
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume</FormLabel>
            <FormControl>
              <Input {...field} placeholder="es. 250ml" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formato</FormLabel>
            <FormControl>
              <Input {...field} placeholder="es. 5%" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
