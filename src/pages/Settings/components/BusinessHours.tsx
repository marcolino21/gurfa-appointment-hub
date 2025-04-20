
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DAYS = [
  { value: 'monday', label: 'Lunedì' },
  { value: 'tuesday', label: 'Martedì' },
  { value: 'wednesday', label: 'Mercoledì' },
  { value: 'thursday', label: 'Giovedì' },
  { value: 'friday', label: 'Venerdì' },
  { value: 'saturday', label: 'Sabato' },
  { value: 'sunday', label: 'Domenica' },
];

interface BusinessHoursProps {
  value: {
    openDays: string[];
    openTime: string;
    closeTime: string;
  };
  onChange: (value: { openDays: string[]; openTime: string; closeTime: string; }) => void;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ value, onChange }) => {
  const handleDayChange = (selectedDay: string) => {
    const newOpenDays = value.openDays.includes(selectedDay)
      ? value.openDays.filter(day => day !== selectedDay)
      : [...value.openDays, selectedDay];
    
    onChange({
      ...value,
      openDays: newOpenDays
    });
  };

  return (
    <div className="space-y-4">
      <Label>Giorni di apertura</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {DAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => handleDayChange(day.value)}
            className={`p-2 text-sm rounded-md transition-colors ${
              value.openDays.includes(day.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openTime">Orario di apertura</Label>
          <Input
            id="openTime"
            type="time"
            value={value.openTime}
            onChange={(e) => onChange({ ...value, openTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeTime">Orario di chiusura</Label>
          <Input
            id="closeTime"
            type="time"
            value={value.closeTime}
            onChange={(e) => onChange({ ...value, closeTime: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessHours;
