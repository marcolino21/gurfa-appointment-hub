
import React from 'react';
import { ExpenseSummary } from '../../types';
import { SummaryCard } from './SummaryCard';
import { RevenueCard } from './RevenueCard';
import { PieChart, TrendingDown, TrendingUp, BarChart } from 'lucide-react';

interface ExpensesSummaryProps {
  summary: ExpenseSummary;
  onRevenueChange: (value: number) => void;
}

export const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({
  summary,
  onRevenueChange,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Costi Fissi"
        value={`€ ${summary.totalFixedCosts.toLocaleString('it-IT', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`}
        icon={<BarChart className="h-6 w-6 text-purple-500" />}
      />

      <SummaryCard
        title="Costi Variabili"
        value={`€ ${summary.totalVariableCosts.toLocaleString('it-IT', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`}
        icon={<TrendingDown className="h-6 w-6 text-blue-500" />}
      />

      <SummaryCard
        title="Costi Totali"
        value={`€ ${summary.totalCosts.toLocaleString('it-IT', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`}
        icon={<PieChart className="h-6 w-6 text-red-500" />}
      />

      <RevenueCard 
        revenue={summary.totalRevenue} 
        onRevenueChange={onRevenueChange}
      />

      <SummaryCard
        title="Margine Lordo"
        value={`€ ${summary.grossProfit.toLocaleString('it-IT', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`}
        icon={<TrendingUp className="h-6 w-6 text-amber-500" />}
        valueClassName={summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}
      />

      <SummaryCard
        title="Margine %"
        value={`${summary.profitMarginPercentage.toFixed(2)}%`}
        icon={<PieChart className="h-6 w-6 text-indigo-500" />}
        valueClassName={summary.profitMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}
      />
    </div>
  );
};
