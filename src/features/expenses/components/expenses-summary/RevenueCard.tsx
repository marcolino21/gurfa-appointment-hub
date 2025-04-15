
import React from 'react';
import { SummaryCard } from './SummaryCard';
import { Euro } from 'lucide-react';

interface RevenueCardProps {
  revenue: number;
  onRevenueChange: (value: number) => void;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  revenue,
  onRevenueChange,
}) => {
  const handleEditClick = () => {
    const newValue = parseFloat(prompt("Inserisci il nuovo valore di produzione:", revenue.toString()) || revenue.toString());
    if (!isNaN(newValue)) {
      onRevenueChange(newValue);
    }
  };

  return (
    <div className="relative">
      <SummaryCard
        title="Valore Produzione"
        value={`€ ${revenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<Euro className="h-6 w-6 text-green-500" />}
      />
      <button
        onClick={handleEditClick}
        className="absolute top-6 right-20 text-xs text-blue-500 hover:text-blue-700"
      >
        Modifica
      </button>
    </div>
  );
};
