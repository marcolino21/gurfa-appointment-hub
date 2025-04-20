
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BusinessHoursByDay } from '../types/profileTypes';

const DAYS = [
  { value: 'monday', label: 'Lunedì' },
  { value: 'tuesday', label: 'Martedì' },
  { value: 'wednesday', label: 'Mercoledì' },
  { value: 'thursday', label: 'Giovedì' },
  { value: 'friday', label: 'Venerdì' },
  { value: 'saturday', label: 'Sabato' },
  { value: 'sunday', label: 'Domenica' },
] as const;

interface BusinessHoursProps {
  value: BusinessHoursByDay;
  onChange: (value: BusinessHoursByDay) => void;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ value, onChange }) => {
  const [openDays, setOpenDays] = useState<string[]>(
    Object.keys(value).filter(day => value[day as keyof BusinessHoursByDay])
  );

  const handleDayToggle = (day: string) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter(d => d !== day));
      const newValue = { ...value };
      delete newValue[day as keyof BusinessHoursByDay];
      onChange(newValue);
    } else {
      setOpenDays([...openDays, day]);
      onChange({
        ...value,
        [day]: { openTime: '09:00', closeTime: '18:00' }
      });
    }
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', timeValue: string) => {
    const dayKey = day as keyof BusinessHoursByDay;
    const currentDayValue = value[dayKey] || { openTime: '09:00', closeTime: '18:00' };
    
    onChange({
      ...value,
      [day]: {
        ...currentDayValue,
        [field]: timeValue
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label>Orari di apertura</Label>
      <div className="space-y-2">
        {DAYS.map((day) => (
          <Collapsible 
            key={day.value}
            open={openDays.includes(day.value)}
            onOpenChange={() => handleDayToggle(day.value)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
              <span className="font-medium">{day.label}</span>
              <div className={`h-3 w-3 rounded-full ${openDays.includes(day.value) ? 'bg-primary' : 'bg-muted'}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${day.value}-open`}>Orario apertura</Label>
                  <Input
                    id={`${day.value}-open`}
                    type="time"
                    value={value[day.value as keyof BusinessHoursByDay]?.openTime || '09:00'}
                    onChange={(e) => handleTimeChange(day.value, 'openTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${day.value}-close`}>Orario chiusura</Label>
                  <Input
                    id={`${day.value}-close`}
                    type="time"
                    value={value[day.value as keyof BusinessHoursByDay]?.closeTime || '18:00'}
                    onChange={(e) => handleTimeChange(day.value, 'closeTime', e.target.value)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
