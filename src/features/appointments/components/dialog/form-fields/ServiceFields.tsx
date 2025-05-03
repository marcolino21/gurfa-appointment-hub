import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StaffMember, Service } from '@/types';
import { ServiceAlert } from './service/ServiceAlert';
import { ServiceEntry } from './service/ServiceEntry';
import { useServiceFieldsState } from '../../../hooks/dialog/useServiceFieldsState';
import { useForm } from 'react-hook-form';
import { ServiceEntry as NewServiceEntry } from './service/ServiceEntry';

interface ServiceFieldsProps {
  allStaff: StaffMember[];
  services: Service[];
  onServiceChange: (index: number, field: 'serviceId' | 'staffId', value: string) => void;
}

export const ServiceFields: React.FC<ServiceFieldsProps> = ({
  allStaff,
  services,
  onServiceChange
}) => {
  const [entries, setEntries] = useState([{ serviceId: '', staffId: '' }]);

  const handleRemoveEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <ServiceAlert
        hasServices={services.length > 0}
        hasStaff={allStaff.length > 0}
      />
      {entries.map((entry, index) => (
        <ServiceEntry
          key={index}
          entry={entry}
          index={index}
          services={services}
          visibleStaff={allStaff}
          hasServices={services.length > 0}
          hasStaff={allStaff.length > 0}
          onServiceChange={onServiceChange}
          onRemove={handleRemoveEntry}
        />
      ))}
    </div>
  );
};
