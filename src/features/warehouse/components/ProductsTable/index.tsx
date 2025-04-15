
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { ProductForm } from '../ProductForm';
import { ProductTableRow } from './ProductTableRow';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EmptyTableRow } from './EmptyTableRow';
import { ProductsTableHeader } from './ProductsTableHeader';
import { useProductsTable } from './useProductsTable';

interface ProductsTableProps {
  products: Product[];
  brands: ProductBrand[];
  categories: ProductCategory[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  brands, 
  categories 
}) => {
  const {
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
  } = useProductsTable(brands, categories);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <ProductsTableHeader />
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  getBrandName={getBrandName}
                  getCategoryName={getCategoryName}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyTableRow />
            )}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <ProductForm 
          open={showEditForm} 
          onOpenChange={setShowEditForm}
          brands={brands}
          categories={categories}
          product={editingProduct}
        />
      )}

      <DeleteConfirmDialog
        open={!!deletingProductId}
        onOpenChange={() => setDeletingProductId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
