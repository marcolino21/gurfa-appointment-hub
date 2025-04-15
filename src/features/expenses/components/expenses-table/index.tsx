
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Expense } from '../../types';
import { ExpenseRow } from './ExpenseRow';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      onDelete(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setExpenseToDelete(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessuna spesa trovata.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Importo</TableHead>
              <TableHead>Frequenza</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrizione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onEdit={onEdit}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DeleteConfirmDialog
        open={!!expenseToDelete}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
