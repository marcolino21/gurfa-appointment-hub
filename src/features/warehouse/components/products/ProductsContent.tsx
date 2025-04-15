
import React, { useState } from 'react';
import { ProductsTable } from '@/features/warehouse/components/ProductsTable';
import { ProductForm } from '@/features/warehouse/components/ProductForm';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductsContentProps {
  loading: boolean;
  filteredProducts: Product[];
  brands: ProductBrand[];
  categories: ProductCategory[];
}

export const ProductsContent: React.FC<ProductsContentProps> = ({ 
  loading, 
  filteredProducts, 
  brands,
  categories 
}) => {
  const [showProductForm, setShowProductForm] = useState(false);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Prodotto
        </Button>
      </div>
      
      <ProductsTable products={filteredProducts} brands={brands} categories={categories} />
      
      <ProductForm 
        open={showProductForm}
        onOpenChange={setShowProductForm}
        brands={brands}
        categories={categories}
      />
    </>
  );
};
