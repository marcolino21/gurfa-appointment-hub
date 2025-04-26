
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { StaffMember, Service } from '@/types';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

interface ServiceEntryProps {
  entry: ServiceEntry;
  index: number;
  services: Service[];
  visibleStaff: StaffMember[];
  hasServices: boolean;
  hasStaff: boolean;
  onServiceChange: (index: number, field: 'serviceId' | 'staffId', value: string) => void;
  onRemove: (index: number) => void;
}

export const ServiceEntry = ({
  entry,
  index,
  services,
  visibleStaff,
  hasServices,
  hasStaff,
  onServiceChange,
  onRemove
}: ServiceEntryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 border rounded-md bg-gray-50 shadow-sm">
      <div className="space-y-2">
        <Label className="font-medium text-gray-700">Servizio {index + 1} *</Label>
        <select
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={entry.serviceId || ''}
          onChange={(e) => onServiceChange(index, 'serviceId', e.target.value)}
        >
          <option value="" disabled>Seleziona servizio</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-medium text-gray-700">Operatore {index + 1} *</Label>
          {index > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <select
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={entry.staffId || ''}
          onChange={(e) => onServiceChange(index, 'staffId', e.target.value)}
        >
          <option value="" disabled>Seleziona operatore</option>
          {visibleStaff.map(staff => (
            <option key={staff.id} value={staff.id}>
              {staff.firstName} {staff.lastName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
