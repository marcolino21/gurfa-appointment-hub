
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { ProductForm } from '../ProductForm';
import { toast } from '@/hooks/use-toast';
import { ProductTableRow } from './ProductTableRow';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

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

  const confirmDelete = () => {
    if (deletingProductId) {
      // In a real app, this would call a delete API
      toast({
        title: "Prodotto eliminato",
        description: "Il prodotto è stato rimosso dal catalogo",
      });
      setDeletingProductId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead className="text-right">Prezzo</TableHead>
              <TableHead className="text-right">Qtà</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
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
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nessun prodotto trovato
                </TableCell>
              </TableRow>
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
        onConfirm={confirmDelete}
      />
    </>
  );
};
