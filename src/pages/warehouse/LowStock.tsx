
import React from 'react';
import { useProductsData } from '@/features/warehouse/hooks/useProductsData';
import { LowStockTable } from '@/features/warehouse/components/LowStockTable';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LowStock = () => {
  const { products, loading } = useProductsData();
  
  // Filter products below their low stock threshold
  const lowStockProducts = products.filter(
    product => product.lowStockThreshold && product.stockQuantity <= product.lowStockThreshold
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prodotti Sotto Scorta</h1>
          <p className="text-muted-foreground">
            Visualizza e gestisci i prodotti che hanno raggiunto o superato la soglia di scorta minima.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/magazzino/ordini'}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crea Ordine
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : lowStockProducts.length > 0 ? (
        <LowStockTable products={lowStockProducts} />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-green-600">Tutto a posto!</CardTitle>
            <AlertTriangle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <CardDescription>
              Non ci sono prodotti sotto la soglia di scorta minima. Tutte le giacenze sono a livelli adeguati.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LowStock;
