
import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';

export const ProductsTableHeader: React.FC = () => {
  return (
    <TableRow>
      <TableHead>Brand</TableHead>
      <TableHead>Nome</TableHead>
      <TableHead>Barcode</TableHead>
      <TableHead className="text-right">Prezzo</TableHead>
      <TableHead className="text-right">Qtà</TableHead>
      <TableHead className="w-[100px]"></TableHead>
    </TableRow>
  );
};
