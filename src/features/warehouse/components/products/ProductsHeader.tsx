
import React from 'react';
import { PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface ProductsHeaderProps {
  onAddProduct: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onAddProduct }) => {
  const handleExportCsv = () => {
    toast({
      title: "Esportazione avviata",
      description: "Il file CSV verrà scaricato a breve",
    });
    // In a real app, this would trigger a CSV download
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-900">Prodotti</h1>
      <div className="flex gap-2">
        <Button onClick={onAddProduct} className="bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi nuovo prodotto
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Scarica
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Esporta dati</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportCsv}>
              <Download className="mr-2 h-4 w-4" /> Esporta CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCsv}>
              <Download className="mr-2 h-4 w-4" /> Esporta Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
