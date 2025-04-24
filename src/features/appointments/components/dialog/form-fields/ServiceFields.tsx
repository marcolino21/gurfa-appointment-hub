
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Debug log for services and staff
  useEffect(() => {
    console.log("Available services in ServiceFields:", services);
    console.log("Available staff in ServiceFields:", visibleStaff);
    console.log("Current service entries:", serviceEntries);
  }, [services, visibleStaff, serviceEntries]);

  const handleServiceEntryChange = (index: number, field: 'serviceId' | 'staffId', value: string) => {
    const newEntries = [...serviceEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    console.log(`Updating ${field} at index ${index} with value:`, value);
    console.log("New entries:", newEntries);
    
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

  const getAvailableStaffForService = (serviceId: string) => {
    if (!serviceId) return visibleStaff;
    
    const service = services.find(s => s.id === serviceId);
    if (!service?.assignedStaffIds?.length) return visibleStaff;
    
    return visibleStaff.filter(staff => 
      service.assignedStaffIds?.includes(staff.id)
    );
  };

  return (
    <div className="space-y-4">
      {serviceEntries.map((entry, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <Label>Servizio {index + 1}</Label>
            <Select 
              value={entry.serviceId || ''} 
              onValueChange={(value) => handleServiceEntryChange(index, 'serviceId', value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-services" disabled>
                    Nessun servizio disponibile
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Operatore</Label>
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
            <Select 
              value={entry.staffId || ''} 
              onValueChange={(value) => handleServiceEntryChange(index, 'staffId', value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleziona operatore" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {visibleStaff.length > 0 ? (
                  (entry.serviceId ? getAvailableStaffForService(entry.serviceId) : visibleStaff).map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-staff" disabled>
                    Nessun operatore disponibile
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full mt-2"
        onClick={addServiceEntry}
      >
        <Plus className="w-4 h-4 mr-2" />
        Aggiungi servizio
      </Button>
    </div>
  );
};
