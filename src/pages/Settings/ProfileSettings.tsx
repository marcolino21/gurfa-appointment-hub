
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import SubscriptionsList from './components/SubscriptionsList';

const ProfileSettings = () => {
  const { user, currentSalonId, salons, setCurrentSalon } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    businessName: currentSalon?.name || '',
    phone: currentSalon?.phone || '',
    address: currentSalon?.address || '',
    ragioneSociale: 'Terea Srls',
    email: 'silvestrellimaro@hotmail.it',
    piva: '17187741008',
    iban: '',
    codiceFiscale: '',
    sedeLegale: 'Via Fiume Giallo, 405, 00143 Roma RM, Italy'
  });
  
  // Store the business name in localStorage when component mounts or salon changes
  useEffect(() => {
    if (currentSalon?.name) {
      localStorage.setItem('salon_business_name', currentSalon.name);
      
      // Update form data when the salon changes
      setFormData(prev => ({
        ...prev,
        businessName: currentSalon.name || '',
        phone: currentSalon.phone || '',
        address: currentSalon.address || ''
      }));
    }
  }, [currentSalon]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // Qui potremmo implementare un vero salvataggio delle info sul backend
    localStorage.setItem('salon_business_name', formData.businessName);
    
    toast({
      title: "Profilo salvato",
      description: "Le modifiche al profilo sono state salvate con successo."
    });
  };
  
  return (
    <div className="space-y-8">
      <ProfileHeader 
        businessName={formData.businessName} 
        address={formData.address}
        handleSaveProfile={handleSaveProfile}
      />
      
      <div className="flex-1 space-y-6">
        <ProfileForm 
          formData={formData}
          handleChange={handleChange}
          handleSaveProfile={handleSaveProfile}
        />
      </div>

      <SubscriptionsList />
    </div>
  );
};

export default ProfileSettings;
