
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { StaffMember, Service } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    console.log("Available services:", services);
    console.log("Available staff:", visibleStaff);
  }, [serviceEntries, services, visibleStaff]);

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

  const hasServices = services && services.length > 0;
  const hasStaff = visibleStaff && visibleStaff.length > 0;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="font-medium text-lg text-gray-800 mb-3 border-b pb-2">Servizi e Operatori</div>
      
      {(!hasServices || !hasStaff) && (
        <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-700">
            {!hasServices && "Nessun servizio disponibile. Aggiungi servizi dalla sezione Servizi."}
            {!hasStaff && "Nessuno staff visibile. Aggiungi operatori dalla sezione Staff."}
          </AlertDescription>
        </Alert>
      )}
      
      {serviceEntries.map((entry, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 border rounded-md bg-gray-50 shadow-sm">
          <div className="space-y-2">
            <Label className="font-medium text-gray-700">Servizio {index + 1} *</Label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <Label className="font-medium text-gray-700">Operatore {index + 1} *</Label>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeServiceEntry(index)}
                  className="h-6 w-6 text-destructive hover:text-destructive hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
        className="w-full mt-2 flex items-center justify-center border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        onClick={addServiceEntry}
      >
        <Plus className="w-4 h-4 mr-2 text-blue-600" />
        Aggiungi servizio
      </Button>
    </div>
  );
};
