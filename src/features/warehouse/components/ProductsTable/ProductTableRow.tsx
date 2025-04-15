
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Product, ProductBrand, ProductCategory } from '@/types';
import { ProductActionsMenu } from './ProductActionsMenu';
import { StockIndicator } from './StockIndicator';

interface ProductTableRowProps {
  product: Product;
  getBrandName: (brandId: string | undefined) => string;
  getCategoryName: (categoryId: string | undefined) => string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  getBrandName,
  getCategoryName,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow>
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
        <StockIndicator 
          quantity={product.stockQuantity} 
          threshold={product.lowStockThreshold} 
        />
      </TableCell>
      <TableCell>
        <ProductActionsMenu 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};
