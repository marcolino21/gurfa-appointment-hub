
import React from 'react';
import { Label } from '@/components/ui/label';

interface DurationOption {
  label: string;
  value: string;
}

interface DurationFieldsProps {
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  handleDurationChange: (value: string) => void;
  generateTimeOptions: () => string[];
  durations: DurationOption[];
}

export const DurationFields = ({
  startTime,
  duration,
  handleDurationChange,
  durations
}: DurationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration" className="font-medium">Durata *</Label>
          <select
            id="duration"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={duration.toString()}
            onChange={(e) => handleDurationChange(e.target.value)}
          >
            {durations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
