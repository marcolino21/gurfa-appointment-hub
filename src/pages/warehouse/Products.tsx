
import React, { useState } from 'react';
import { useProductsData } from '@/features/warehouse/hooks/useProductsData';
import { useProductFilters } from '@/features/warehouse/hooks/useProductFilters';
import { ProductsHeader } from '@/features/warehouse/components/products/ProductsHeader';
import { ProductsFilters } from '@/features/warehouse/components/products/ProductsFilters';
import { ProductsContent } from '@/features/warehouse/components/products/ProductsContent';
import { ProductForm } from '@/features/warehouse/components/ProductForm';
import { CsvImportModal } from '@/features/warehouse/components/CsvImportModal';

const Products: React.FC = () => {
  const { products, brands, categories, loading } = useProductsData();
  const {
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    selectedFormat,
    setSelectedFormat,
    uniqueFormats,
    filteredProducts
  } = useProductFilters(products);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  return (
    <div className="space-y-6">
      <ProductsHeader onAddProduct={handleAddProduct} />

      <ProductsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        brands={brands}
        categories={categories}
        uniqueFormats={uniqueFormats}
        onShowImportModal={() => setShowImportModal(true)}
      />

      <ProductsContent 
        loading={loading}
        filteredProducts={filteredProducts}
        brands={brands}
        categories={categories}
      />

      <ProductForm 
        open={showProductForm} 
        onOpenChange={setShowProductForm}
        brands={brands}
        categories={categories}
      />

      <CsvImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
      />
    </div>
  );
};

export default Products;
