
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { StaffMember, Service } from '@/types';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

interface ServiceFieldsProps {
  formData: any;
  handleInputChange: (e: any) => void;
  visibleStaff: StaffMember[];
  services: Service[];
}

export const ServiceFields = ({
  formData,
  handleInputChange,
  visibleStaff,
  services
}: ServiceFieldsProps) => {
  const serviceEntries: ServiceEntry[] = formData.serviceEntries || [{ serviceId: '', staffId: '' }];

  useEffect(() => {
    console.log("Current service entries:", serviceEntries);
  }, [serviceEntries]);

  const handleServiceEntryChange = (index: number, field: 'serviceId' | 'staffId', value: string) => {
    const newEntries = [...serviceEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    console.log(`Updating ${field} at index ${index} with value:`, value);
    
    // Update the main form data
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    // If this is the first service and serviceId is being changed, also update the legacy service field
    if (index === 0 && field === 'serviceId') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        handleInputChange({
          target: { name: 'service', value: selectedService.name }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
    
    // If this is the first staff and staffId is being changed, also update the legacy staffId field
    if (index === 0 && field === 'staffId') {
      handleInputChange({
        target: { name: 'staffId', value }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const addServiceEntry = () => {
    handleInputChange({
      target: { 
        name: 'serviceEntries', 
        value: [...serviceEntries, { serviceId: '', staffId: '' }]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const removeServiceEntry = (index: number) => {
    const newEntries = serviceEntries.filter((_, i) => i !== index);
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-base mb-2">Servizi e Operatori</div>
      
      {serviceEntries.map((entry, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 border rounded-md bg-slate-50">
          <div className="space-y-2">
            <Label className="font-medium">Servizio {index + 1}</Label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={entry.serviceId || ''}
              onChange={(e) => handleServiceEntryChange(index, 'serviceId', e.target.value)}
            >
              <option value="" disabled>Seleziona servizio</option>
              {services && services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-medium">Operatore</Label>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeServiceEntry(index)}
                  className="h-6 w-6 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={entry.staffId || ''}
              onChange={(e) => handleServiceEntryChange(index, 'staffId', e.target.value)}
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
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full mt-2 flex items-center justify-center"
        onClick={addServiceEntry}
      >
        <Plus className="w-4 h-4 mr-2" />
        Aggiungi servizio
      </Button>
    </div>
  );
};
