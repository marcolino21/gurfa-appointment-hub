
import React from 'react';
import { ProductsTable as ModularProductsTable } from './ProductsTable/index';
import { Product, ProductBrand, ProductCategory } from '@/types';

interface ProductsTableProps {
  products: Product[];
  brands: ProductBrand[];
  categories: ProductCategory[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ products, brands, categories }) => {
  return (
    <ModularProductsTable 
      products={products} 
      brands={brands} 
      categories={categories} 
    />
  );
};
