
export type ExpenseCategory = 'fixed' | 'variable';

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  description?: string;
  date: string;
  salonId: string;
}

export interface ExpenseSummary {
  totalFixedCosts: number;
  totalVariableCosts: number;
  totalCosts: number;
  totalRevenue: number;
  grossProfit: number;
  profitMarginPercentage: number;
}
