
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '@/types';

interface ServiceFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  visibleStaff: Staff[];
}

export const ServiceFields = ({
  formData,
  handleInputChange,
  visibleStaff
}: ServiceFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="service">Servizio *</Label>
        <Input
          id="service"
          name="service"
          value={formData.service || ''}
          onChange={handleInputChange}
          placeholder="Tipo di servizio"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffId">Operatore</Label>
        <Select 
          value={formData.staffId ? String(formData.staffId) : ''} 
          onValueChange={(value) => {
            handleInputChange({
              target: { name: 'staffId', value }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona operatore" />
          </SelectTrigger>
          <SelectContent>
            {visibleStaff.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.firstName} {staff.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
