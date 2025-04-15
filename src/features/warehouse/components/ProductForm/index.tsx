
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { toast } from '@/hooks/use-toast';
import { productSchema, ProductFormValues } from '../../schemas/productSchema';
import { ProductPrimaryFields } from './ProductPrimaryFields';
import { CategoryField } from './CategoryField';
import { ProductDetailsFields } from './ProductDetailsFields';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  brands: ProductBrand[];
  categories: ProductCategory[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onOpenChange,
  product,
  brands,
  categories,
}) => {
  const isEditing = !!product;
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditing ? {
      name: product.name || '',
      description: product.description || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      brand: product.brand || '',
      category: product.category || '',
      customCategory: '',
      price: product.price || 0,
      costPrice: product.costPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      lowStockThreshold: product.lowStockThreshold || 0,
      size: product.size || '',
      weight: product.weight || 0,
      volume: product.volume || '',
      format: product.format || '',
    } : {
      name: '',
      price: 0,
      stockQuantity: 0,
      customCategory: '',
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    // If using custom category, replace the category value with the custom one
    const finalValues = { ...values };
    
    if (useCustomCategory && values.customCategory) {
      finalValues.category = values.customCategory;
    }
    
    // In a real app, this would call a create/update API
    toast({
      title: isEditing ? "Prodotto aggiornato" : "Prodotto aggiunto",
      description: isEditing ? "Le modifiche sono state salvate con successo" : "Il prodotto è stato aggiunto al catalogo",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica prodotto' : 'Aggiungi nuovo prodotto'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica i dettagli del prodotto.' : 'Inserisci i dettagli del nuovo prodotto.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProductPrimaryFields form={form} brands={brands} />
            
            <CategoryField 
              form={form} 
              categories={categories} 
              useCustomCategory={useCustomCategory}
              setUseCustomCategory={setUseCustomCategory}
            />
            
            <ProductDetailsFields form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <Button type="submit">
                {isEditing ? 'Aggiorna prodotto' : 'Aggiungi prodotto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
