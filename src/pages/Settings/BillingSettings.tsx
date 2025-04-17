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
import { CreditCardFormData } from './types/paymentTypes';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatTwoDigits = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value || 0;
  return numValue.toString().padStart(2, '0');
};

const BillingSettings = () => {
  const { 
    paymentMethods, 
    fetchPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod 
  } = usePaymentMethodOperations();
  const { toast } = useToast();

  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isRemoveCardDialogOpen, setIsRemoveCardDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    card_type: '',
    last_four: '',
    holder_name: '',
    expiry_month: 0,
    expiry_year: 0,
    card_number: ''
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
        window.location.href = 'https://www.paypal.com/connect';
        break;
      case 'apple-pay':
        // Implement Apple Pay functionality
        break;
    }
  };

  const handleSubmitPaymentMethod = async (formData: any) => {
    try {
      if (!formData.card_number) {
        toast({
          variant: 'destructive',
          title: 'Errore',
          description: 'Inserisci il numero della carta.',
        });
        return;
      }
      
      const last_four = formData.card_number.slice(-4);
      
      const paymentMethod = {
        type: 'credit-card' as PaymentMethodType,
        card_type: 'credit-card',
        last_four,
        holder_name: formData.holder_name,
        expiry_month: parseInt(formData.expiry_month.toString()),
        expiry_year: parseInt(formData.expiry_year.toString().slice(-2))
      };
  
      console.log('Saving payment method:', paymentMethod);
      await addPaymentMethod(paymentMethod);
      
      toast({
        title: 'Metodo di pagamento salvato',
        description: 'La carta di credito è stata salvata con successo.',
      });
      
      setIsAddCardDialogOpen(false);
    } catch (error) {
      console.error('Error submitting payment method:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile salvare il metodo di pagamento.',
      });
    }
  };

  const handleRemovePaymentMethod = () => {
    if (selectedPaymentMethod && selectedPaymentMethod.id) {
      removePaymentMethod(selectedPaymentMethod.id);
      setIsRemoveCardDialogOpen(false);
      setSelectedPaymentMethod(null);
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
              <Label htmlFor="holder_name" className="text-right">Titolare della Carta</Label>
              <Input 
                id="holder_name" 
                value={newPaymentMethod.holder_name || ''} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, holder_name: e.target.value }))} 
                className="col-span-3" 
                placeholder="Nome del titolare"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card_number" className="text-right">N. della Carta</Label>
              <Input 
                id="card_number" 
                value={newPaymentMethod.card_number || ''} 
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, card_number: e.target.value }))} 
                className="col-span-3" 
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvc" className="text-right">CVC</Label>
              <Input 
                id="cvc" 
                type="password" 
                maxLength={4}
                className="col-span-3" 
                placeholder="123"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry_month" className="text-right">Mese Scadenza</Label>
              <Select
                value={newPaymentMethod.expiry_month ? newPaymentMethod.expiry_month.toString() : ''}
                onValueChange={(value) => {
                  setNewPaymentMethod(prev => ({ 
                    ...prev, 
                    expiry_month: parseInt(value) 
                  }));
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {formatTwoDigits(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry_year" className="text-right">Anno Scadenza</Label>
              <Input 
                id="expiry_year" 
                type="text"
                maxLength={4}
                value={newPaymentMethod.expiry_year ? formatTwoDigits(newPaymentMethod.expiry_year) : ''} 
                onChange={(e) => {
                  if (!e.target.value) {
                    setNewPaymentMethod(prev => ({ ...prev, expiry_year: 0 }));
                    return;
                  }
                  
                  let year = parseInt(e.target.value);
                  if (isNaN(year)) year = 0;
                  
                  if (year > 100) {
                    year = year % 100;
                  }
                  
                  setNewPaymentMethod(prev => ({ 
                    ...prev, 
                    expiry_year: year 
                  }));
                }}
                className="col-span-3" 
                placeholder="YY"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>Annulla</Button>
            <Button 
              type="submit" 
              onClick={() => handleSubmitPaymentMethod(newPaymentMethod)}
            >
              Salva
            </Button>
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
