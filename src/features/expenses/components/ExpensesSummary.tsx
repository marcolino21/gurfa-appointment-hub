
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExpenseSummary } from '../types';
import { Euro, TrendingDown, TrendingUp, PieChart, BarChart } from 'lucide-react';

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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Costi Fissi</p>
              <h3 className="text-2xl font-bold">€ {summary.totalFixedCosts.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Costi Variabili</p>
              <h3 className="text-2xl font-bold">€ {summary.totalVariableCosts.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Costi Totali</p>
              <h3 className="text-2xl font-bold">€ {summary.totalCosts.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <PieChart className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Valore Produzione</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">€ {summary.totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <button
                  onClick={() => {
                    const newValue = parseFloat(prompt("Inserisci il nuovo valore di produzione:", summary.totalRevenue.toString()) || summary.totalRevenue.toString());
                    if (!isNaN(newValue)) {
                      onRevenueChange(newValue);
                    }
                  }}
                  className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                >
                  Modifica
                </button>
              </div>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Euro className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Margine Lordo</p>
              <h3 className={`text-2xl font-bold ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                € {summary.grossProfit.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Margine %</p>
              <h3 className={`text-2xl font-bold ${summary.profitMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.profitMarginPercentage.toFixed(2)}%
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <PieChart className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
