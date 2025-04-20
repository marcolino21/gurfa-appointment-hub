
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BusinessHours from './BusinessHours';
import { BusinessHoursByDay } from '../types/profileTypes';

interface ProfileFormProps {
  formData: {
    businessName: string;
    phone: string;
    address: string;
    ragioneSociale: string;
    email: string;
    piva: string;
    iban: string;
    codiceFiscale: string;
    sedeLegale: string;
    businessHours?: BusinessHoursByDay;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: () => void;
  isLoading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  formData, 
  handleChange, 
  handleSaveProfile,
  isLoading = false 
}) => {
  const handleBusinessHoursChange = (businessHours: BusinessHoursByDay) => {
    // We simulate the event object to use the existing handleChange function
    handleChange({
      target: {
        id: 'businessHours',
        value: JSON.stringify(businessHours)
      }
    } as any);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="ragioneSociale">RAGIONE SOCIALE</Label>
        <Input 
          id="ragioneSociale" 
          value={formData.ragioneSociale} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">TELEFONO</Label>
        <Input 
          id="phone" 
          value={formData.phone} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">EMAIL</Label>
        <Input 
          id="email" 
          value={formData.email} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="piva">P.IVA</Label>
        <Input 
          id="piva" 
          value={formData.piva} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input 
          id="iban" 
          value={formData.iban} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="codiceFiscale">CODICE FISCALE</Label>
        <Input 
          id="codiceFiscale" 
          value={formData.codiceFiscale} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2 col-span-2">
        <Label htmlFor="sedeLegale">SEDE LEGALE</Label>
        <Input 
          id="sedeLegale" 
          value={formData.sedeLegale} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2 col-span-2">
        <Label htmlFor="businessName">NOME ATTIVITÀ</Label>
        <Input 
          id="businessName" 
          value={formData.businessName} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2 col-span-2">
        <Label htmlFor="address">INDIRIZZO ATTIVITÀ</Label>
        <Textarea 
          id="address" 
          value={formData.address} 
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="col-span-2">
        <BusinessHours
          value={formData.businessHours || {}}
          onChange={handleBusinessHoursChange}
        />
      </div>
      
      <div className="col-span-2">
        <Button 
          onClick={handleSaveProfile} 
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Salvataggio..." : "Salva modifiche"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
