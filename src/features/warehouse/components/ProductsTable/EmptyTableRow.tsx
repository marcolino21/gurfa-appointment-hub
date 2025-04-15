
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

export const EmptyTableRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
        Nessun prodotto trovato
      </TableCell>
    </TableRow>
  );
};
