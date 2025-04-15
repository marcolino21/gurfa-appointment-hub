
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const BillingSettings = () => {
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
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-medium">Carta di credito</h3>
                <p className="text-muted-foreground">VISA •••• 4242</p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline">Modifica</Button>
                <Button variant="destructive">Rimuovi</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingSettings;
