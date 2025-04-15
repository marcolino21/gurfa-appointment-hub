
import React, { useState } from 'react';
import { useProductsData } from '@/features/warehouse/hooks/useProductsData';
import { CsvImportModal } from '@/features/warehouse/components/CsvImportModal';
import { FileUpload } from '@/features/warehouse/components/FileUpload';
import { OrdersTable } from '@/features/warehouse/components/OrdersTable';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ProductOrder } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Orders = () => {
  const { products, updateProduct } = useProductsData();
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const handleFileUpload = (file: File) => {
    // In a real application, this would send the file to a backend API
    toast({
      title: "File caricato con successo",
      description: `Il file ${file.name} è stato caricato. Le giacenze verranno aggiornate.`
    });

    // Simulate stock update after file processing
    setTimeout(() => {
      toast({
        title: "Giacenze aggiornate",
        description: "Le giacenze del magazzino sono state aggiornate in base all'ordine."
      });
    }, 2000);
  };

  const handleImportSuccess = (updatedProducts: any[]) => {
    // Update products in the store
    updatedProducts.forEach(product => {
      updateProduct(product);
    });
    
    toast({
      title: "Importazione completata",
      description: `${updatedProducts.length} prodotti aggiornati con successo.`
    });
    
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordini</h1>
          <p className="text-muted-foreground">
            Gestisci gli ordini di prodotti e aggiorna le giacenze automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFileUploadOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Carica PDF
          </Button>
          <Button onClick={() => setIsImportModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Importa CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="attivi">
        <TabsList>
          <TabsTrigger value="attivi">Ordini Attivi</TabsTrigger>
          <TabsTrigger value="completati">Ordini Completati</TabsTrigger>
        </TabsList>
        <TabsContent value="attivi" className="mt-4">
          {orders.length > 0 ? (
            <OrdersTable orders={orders.filter(order => order.status !== 'delivered')} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nessun ordine attivo</CardTitle>
                <CardDescription>
                  Non ci sono ordini attivi al momento. Carica un file PDF o importa un CSV per creare un nuovo ordine.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-6">
                <Button onClick={() => setIsImportModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crea nuovo ordine
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="completati" className="mt-4">
          {orders.filter(order => order.status === 'delivered').length > 0 ? (
            <OrdersTable orders={orders.filter(order => order.status === 'delivered')} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nessun ordine completato</CardTitle>
                <CardDescription>
                  Non ci sono ordini completati da visualizzare.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CsvImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImportSuccess={handleImportSuccess}
      />

      <FileUpload
        open={isFileUploadOpen}
        onOpenChange={setIsFileUploadOpen}
        onFileUpload={handleFileUpload}
        acceptedFileTypes=".pdf"
        title="Carica PDF dell'ordine"
        description="Carica il PDF dell'ordine per aggiornare automaticamente le giacenze del magazzino."
      />
    </div>
  );
};

export default Orders;
