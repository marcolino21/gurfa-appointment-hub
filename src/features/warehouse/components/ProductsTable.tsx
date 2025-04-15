
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { cn } from '@/lib/utils';
import { ProductForm } from './ProductForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';

interface ProductsTableProps {
  products: Product[];
  brands: ProductBrand[];
  categories: ProductCategory[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ products, brands, categories }) => {
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
                <TableRow key={product.id}>
                  <TableCell>{getBrandName(product.brand)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{getCategoryName(product.category)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell className="text-right">€ {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="text-right">
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs font-medium rounded-full",
                        product.stockQuantity <= 0 ? "bg-red-100 text-red-800" :
                        product.stockQuantity <= (product.lowStockThreshold || 1) ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      )}>
                        {product.stockQuantity} pz.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Apri menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)}className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
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

      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il prodotto verrà eliminato definitivamente dal sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
