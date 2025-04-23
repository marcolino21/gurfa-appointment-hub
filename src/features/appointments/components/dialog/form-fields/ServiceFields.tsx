
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

  const handleServiceEntryChange = (index: number, field: 'serviceId' | 'staffId', value: string) => {
    const newEntries = [...serviceEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    // Use a custom event object that matches what handleInputChange expects
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    });
  };

  const addServiceEntry = () => {
    handleInputChange({
      target: { 
        name: 'serviceEntries', 
        value: [...serviceEntries, { serviceId: '', staffId: '' }]
      }
    });
  };

  const removeServiceEntry = (index: number) => {
    const newEntries = serviceEntries.filter((_, i) => i !== index);
    handleInputChange({
      target: { name: 'serviceEntries', value: newEntries }
    });
  };

  const getAvailableStaffForService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service?.assignedStaffIds) return visibleStaff;
    return visibleStaff.filter(staff => service.assignedStaffIds?.includes(staff.id));
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
              <SelectTrigger>
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
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
              <SelectTrigger>
                <SelectValue placeholder="Seleziona operatore" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStaffForService(entry.serviceId || '').map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </SelectItem>
                ))}
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
