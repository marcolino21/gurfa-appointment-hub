import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard, Edit, Trash2 } from "lucide-react";
import { usePaymentMethodOperations } from './hooks/usePaymentMethodOperations';
import PaymentMethodSelector from './components/payment-methods/PaymentMethodSelector';
import { PaymentMethodType } from './types/paymentTypes';

const BillingSettings = () => {
  const { 
    paymentMethods, 
    fetchPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod 
  } = usePaymentMethodOperations();

  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isRemoveCardDialogOpen, setIsRemoveCardDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    card_type: '',
    last_four: '',
    holder_name: '',
    expiry_month: 0,
    expiry_year: 0
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const pendingInvoice = {
    number: "IT100043935-40",
    amount: "€453,33",
    dueDate: "01 apr 2025"
  };

  const previousInvoices = [
    { date: "17 mar 2025", number: "IT100043935-39" },
    { date: "03 mar 2025", number: "IT100043935-38" },
    { date: "17 feb 2025", number: "IT100043935-37" },
    { date: "03 feb 2025", number: "IT100043935-36" },
    { date: "16 gen 2025", number: "IT100043935-35" },
    { date: "02 gen 2025", number: "IT100043935-34" },
    { date: "16 dic 2024", number: "IT100043935-33" },
    { date: "02 dic 2024", number: "IT100043935-32" },
    { date: "01 nov 2024", number: "IT100043935-31" }
  ];

  const handleAddPaymentMethod = (method: PaymentMethodType) => {
    switch (method) {
      case 'credit-card':
        setIsAddCardDialogOpen(true);
        break;
      case 'paypal':
        window.location.href = 'https://www.paypal.com/connect'; // Replace with your PayPal connect URL
        break;
      case 'apple-pay':
        // Implement Apple Pay functionality
        break;
    }
  };

  const handleSubmitPaymentMethod = () => {
    addPaymentMethod(newPaymentMethod);
    setIsAddCardDialogOpen(false);
    setNewPaymentMethod({
      card_type: '',
      last_four: '',
      holder_name: '',
      expiry_month: 0,
      expiry_year: 0
    });
  };

  const handleRemovePaymentMethod = () => {
    if (selectedPaymentMethod) {
      removePaymentMethod(selectedPaymentMethod.id);
      setIsRemoveCardDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fatture da pagare</h2>
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden">
              <div className="bg-red-50 text-red-500 p-6 flex flex-col justify-center">
                <p className="text-sm font-medium mb-1">ADDEBITI</p>
                <p className="text-3xl font-bold">{pendingInvoice.amount}</p>
              </div>
              
              <div className="p-6 border-t md:border-t-0 md:border-l">
                <p className="text-sm text-muted-foreground mb-1">NUM. FATTURA</p>
                <p className="font-medium">{pendingInvoice.number}</p>
              </div>
              
              <div className="p-6 border-t md:border-t-0 md:border-l">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">SCADENZA DEL PAGAMENTO</p>
                    <p className="font-medium">{pendingInvoice.dueDate}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm">SCARICA LA FATTURA</Button>
                    <Button size="sm">PAGA ORA</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Fatture precedenti</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATA</TableHead>
                  <TableHead>NUM. FATTURA</TableHead>
                  <TableHead className="text-right">FATTURA IN PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previousInvoices.map((invoice) => (
                  <TableRow key={invoice.number}>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Metodo di pagamento</h2>
        {paymentMethods.length > 0 ? (
          <Card>
            {paymentMethods.map((method) => (
              <CardContent key={method.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="text-lg font-medium">{method.card_type.toUpperCase()}</h3>
                    <p className="text-muted-foreground">•••• {method.last_four}</p>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setNewPaymentMethod(method);
                        setIsAddCardDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Modifica
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setSelectedPaymentMethod(method);
                        setIsRemoveCardDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Rimuovi
                    </Button>
                  </div>
                </div>
              </CardContent>
            ))}
          </Card>
        ) : (
          <PaymentMethodSelector onSelect={handleAddPaymentMethod} />
        )}
      </div>

      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi/Modifica Metodo di Pagamento</DialogTitle>
            <DialogDescription>Inserisci i dettagli della tua carta di credito</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card_type" className="text-right">Tipo Carta</Label>
              <Input 
                id="card_type" 
                value={newPaymentMethod.card_type} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, card_type: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_four" className="text-right">Ultimi 4 Numeri</Label>
              <Input 
                id="last_four" 
                value={newPaymentMethod.last_four} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, last_four: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="holder_name" className="text-right">Nome Intestatario</Label>
              <Input 
                id="holder_name" 
                value={newPaymentMethod.holder_name} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, holder_name: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry_month" className="text-right">Mese Scadenza</Label>
              <Input 
                id="expiry_month" 
                type="number" 
                value={newPaymentMethod.expiry_month} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiry_month: parseInt(e.target.value) }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry_year" className="text-right">Anno Scadenza</Label>
              <Input 
                id="expiry_year" 
                type="number" 
                value={newPaymentMethod.expiry_year} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiry_year: parseInt(e.target.value) }))} 
                className="col-span-3" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>Annulla</Button>
            <Button type="submit" onClick={handleSubmitPaymentMethod}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveCardDialogOpen} onOpenChange={setIsRemoveCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Rimozione</DialogTitle>
            <DialogDescription>Sei sicuro di voler rimuovere questo metodo di pagamento?</DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRemoveCardDialogOpen(false)}>Annulla</Button>
            <Button type="submit" variant="destructive" onClick={handleRemovePaymentMethod}>Rimuovi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingSettings;
