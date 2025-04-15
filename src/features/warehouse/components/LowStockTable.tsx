
import React from 'react';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { StockIndicator } from './ProductsTable/StockIndicator';

interface LowStockTableProps {
  products: Product[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {
  const getSeverity = (product: Product) => {
    if (!product.lowStockThreshold) return 'medium';
    
    // Calculate how critical the low stock situation is
    const ratio = product.stockQuantity / product.lowStockThreshold;
    
    if (ratio === 0) return 'critical'; // Out of stock
    if (ratio <= 0.5) return 'high'; // Less than 50% of threshold
    if (ratio <= 0.8) return 'medium'; // Between 50% and 80% of threshold
    return 'low'; // Between 80% and 100% of threshold
  };

  // Sort products by severity (critical first)
  const sortedProducts = [...products].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityA = getSeverity(a);
    const severityB = getSeverity(b);
    return severityOrder[severityA as keyof typeof severityOrder] - 
           severityOrder[severityB as keyof typeof severityOrder];
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prodotto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Giacenza</TableHead>
            <TableHead>Soglia minima</TableHead>
            <TableHead>Prezzo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => {
            const severity = getSeverity(product);
            
            return (
              <TableRow key={product.id} className={
                severity === 'critical' ? 'bg-red-50' : 
                severity === 'high' ? 'bg-orange-50' : ''
              }>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {severity === 'critical' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {product.name}
                  </div>
                </TableCell>
                <TableCell>{product.category || 'Non specificata'}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.lowStockThreshold}</TableCell>
                <TableCell>€ {product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <StockIndicator 
                    stockQuantity={product.stockQuantity} 
                    lowStockThreshold={product.lowStockThreshold || 0} 
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => window.location.href = '/magazzino/ordini'}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Ordina</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
