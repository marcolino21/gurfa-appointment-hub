
import React from 'react';
import { ProductsTable } from '@/features/warehouse/components/ProductsTable';
import { Product, ProductBrand, ProductCategory } from '@/types';

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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProductsTable products={filteredProducts} brands={brands} categories={categories} />
  );
};
