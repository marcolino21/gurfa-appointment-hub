
import { useState, useMemo } from 'react';
import { Expense, ExpenseSummary } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for initial development
const initialExpenses: Expense[] = [
  {
    id: '1',
    name: 'Affitto',
    category: 'fixed',
    amount: 1200,
    frequency: 'monthly',
    description: 'Affitto mensile del locale',
    date: '2023-01-01',
    salonId: '1',
  },
  {
    id: '2',
    name: 'Stipendi',
    category: 'fixed',
    amount: 3000,
    frequency: 'monthly',
    description: 'Stipendi del personale',
    date: '2023-01-01',
    salonId: '1',
  },
  {
    id: '3',
    name: 'Prodotti',
    category: 'variable',
    amount: 500,
    frequency: 'monthly',
    description: 'Acquisto prodotti',
    date: '2023-01-15',
    salonId: '1',
  },
  {
    id: '4',
    name: 'Marketing',
    category: 'variable',
    amount: 300,
    frequency: 'monthly',
    description: 'Spese di marketing',
    date: '2023-01-20',
    salonId: '1',
  },
];

// Mock revenue data
const mockRevenue = 7500;

export const useExpensesData = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(mockRevenue);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: uuidv4(),
    };
    setExpenses([...expenses, newExpense]);
    setIsAddDialogOpen(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)));
    setIsEditDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleRevenueChange = (value: number) => {
    setTotalRevenue(value);
  };

  const summary: ExpenseSummary = useMemo(() => {
    const totalFixedCosts = expenses
      .filter((e) => e.category === 'fixed')
      .reduce((acc, expense) => acc + expense.amount, 0);

    const totalVariableCosts = expenses
      .filter((e) => e.category === 'variable')
      .reduce((acc, expense) => acc + expense.amount, 0);

    const totalCosts = totalFixedCosts + totalVariableCosts;
    const grossProfit = totalRevenue - totalCosts;
    const profitMarginPercentage = totalRevenue > 0 
      ? (grossProfit / totalRevenue) * 100 
      : 0;

    return {
      totalFixedCosts,
      totalVariableCosts,
      totalCosts,
      totalRevenue,
      grossProfit,
      profitMarginPercentage,
    };
  }, [expenses, totalRevenue]);

  return {
    expenses,
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
    totalRevenue,
    handleRevenueChange,
    summary,
  };
};
