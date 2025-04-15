
import { useState, useMemo } from 'react';
import { Product } from '@/types';

export const useProductFilters = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all_brands');
  const [selectedCategory, setSelectedCategory] = useState<string>('all_categories');
  const [selectedFormat, setSelectedFormat] = useState<string>('all_formats');

  // Get unique formats for the filter dropdown
  const uniqueFormats = useMemo(() => {
    return [...new Set(products.map(p => p.format).filter(Boolean))];
  }, [products]);

  // Apply all filters to the products list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          false;
      
      const matchesBrand = selectedBrand === 'all_brands' || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all_categories' || product.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all_formats' || product.format === selectedFormat;
      
      return matchesSearch && matchesBrand && matchesCategory && matchesFormat;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedFormat]);

  return {
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
  };
};
