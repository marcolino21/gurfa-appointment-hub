
import { useState } from 'react';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useProductsTable = (brands: ProductBrand[], categories: ProductCategory[]) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const getBrandName = (brandId: string | undefined) => {
    if (!brandId) return '';
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return '';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const handleDelete = (productId: string) => {
    setDeletingProductId(productId);
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      // In a real app, this would call a delete API
      toast({
        title: "Prodotto eliminato",
        description: "Il prodotto è stato rimosso dal catalogo",
      });
      setDeletingProductId(null);
    }
  };

  return {
    editingProduct,
    showEditForm,
    deletingProductId,
    getBrandName,
    getCategoryName,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    setShowEditForm,
    setDeletingProductId
  };
};
