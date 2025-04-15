
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Search, Receipt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expense } from '@/features/expenses/types';
import { useExpensesData } from '@/features/expenses/hooks/useExpensesData';
import { ExpensesTable } from '@/features/expenses/components/ExpensesTable';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { ExpensesSummary } from '@/features/expenses/components/ExpensesSummary';
import { useAuth } from '@/contexts/AuthContext';

const Expenses: React.FC = () => {
  const { currentSalonId } = useAuth();
  const {
    filteredExpenses,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedExpense,
    setSelectedExpense,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    handleRevenueChange,
    summary,
  } = useExpensesData();
  
  const salonId = currentSalonId || '1'; // Fallback to '1' if currentSalonId is null

  const fixedExpenses = filteredExpenses.filter(e => e.category === 'fixed');
  const variableExpenses = filteredExpenses.filter(e => e.category === 'variable');

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Receipt className="h-8 w-8 mr-2" />
          Gestione Spese
        </h1>
        <p className="text-muted-foreground mt-1">
          Tieni traccia delle tue spese fisse e variabili e monitora i margini di profitto
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-0">
          <CardTitle>Sintesi finanziaria</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ExpensesSummary 
            summary={summary} 
            onRevenueChange={handleRevenueChange} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Spese</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca spesa..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi spesa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tutte</TabsTrigger>
              <TabsTrigger value="fixed">Costi Fissi</TabsTrigger>
              <TabsTrigger value="variable">Costi Variabili</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ExpensesTable 
                expenses={filteredExpenses} 
                onEdit={(expense) => {
                  setSelectedExpense(expense);
                  setIsEditDialogOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </TabsContent>
            <TabsContent value="fixed">
              <ExpensesTable 
                expenses={fixedExpenses} 
                onEdit={(expense) => {
                  setSelectedExpense(expense);
                  setIsEditDialogOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </TabsContent>
            <TabsContent value="variable">
              <ExpensesTable 
                expenses={variableExpenses} 
                onEdit={(expense) => {
                  setSelectedExpense(expense);
                  setIsEditDialogOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuova spesa</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli della nuova spesa
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm onSubmit={handleAddExpense} salonId={salonId} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica spesa</DialogTitle>
            <DialogDescription>
              Modifica i dettagli della spesa
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <ExpenseForm 
              onSubmit={handleEditExpense} 
              defaultValues={selectedExpense}
              salonId={selectedExpense.salonId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
