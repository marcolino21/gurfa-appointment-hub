
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Expense } from '../../types';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDeleteClick: (id: string) => void;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  onEdit,
  onDeleteClick,
}) => {
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Mensile';
      case 'quarterly': return 'Trimestrale';
      case 'annually': return 'Annuale';
      case 'one-time': return 'Una tantum';
      default: return frequency;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{expense.name}</TableCell>
      <TableCell>
        <Badge variant={expense.category === 'fixed' ? 'outline' : 'secondary'}>
          {expense.category === 'fixed' ? 'Fisso' : 'Variabile'}
        </Badge>
      </TableCell>
      <TableCell>€ {expense.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
      <TableCell>{getFrequencyLabel(expense.frequency)}</TableCell>
      <TableCell>{new Date(expense.date).toLocaleDateString('it-IT')}</TableCell>
      <TableCell className="max-w-xs truncate">{expense.description || '-'}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Apri menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(expense)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifica
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(expense.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Elimina
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
