
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import SubscriptionsList from './components/SubscriptionsList';

const ProfileSettings = () => {
  const { user, currentSalonId, salons, setCurrentSalon, updateSalonInfo } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('salon_profile_image') || null
  );
  
  // Form state
  const [formData, setFormData] = useState({
    businessName: currentSalon?.name || '',
    phone: currentSalon?.phone || '',
    address: currentSalon?.address || '',
    ragioneSociale: localStorage.getItem('salon_ragione_sociale') || 'Terea Srls',
    email: localStorage.getItem('salon_email') || 'silvestrellimaro@hotmail.it',
    piva: localStorage.getItem('salon_piva') || '17187741008',
    iban: localStorage.getItem('salon_iban') || '',
    codiceFiscale: localStorage.getItem('salon_codice_fiscale') || '',
    sedeLegale: localStorage.getItem('salon_sede_legale') || 'Via Fiume Giallo, 405, 00143 Roma RM, Italy'
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImage(result);
      localStorage.setItem('salon_profile_image', result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Save all form fields to localStorage for persistence
    localStorage.setItem('salon_business_name', formData.businessName);
    localStorage.setItem('salon_ragione_sociale', formData.ragioneSociale);
    localStorage.setItem('salon_email', formData.email);
    localStorage.setItem('salon_piva', formData.piva);
    localStorage.setItem('salon_iban', formData.iban);
    localStorage.setItem('salon_codice_fiscale', formData.codiceFiscale);
    localStorage.setItem('salon_sede_legale', formData.sedeLegale);
    
    // Update the salon in context if available
    if (currentSalonId) {
      const updatedSalon = {
        ...currentSalon!,
        name: formData.businessName,
        phone: formData.phone,
        address: formData.address
      };
      
      // Update the salon in context (this will also update localStorage)
      updateSalonInfo(currentSalonId, updatedSalon);
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profilo salvato",
        description: "Le modifiche al profilo sono state salvate con successo."
      });
    }, 800);
  };
  
  return (
    <div className="space-y-8">
      <ProfileHeader 
        businessName={formData.businessName} 
        address={formData.address}
        handleSaveProfile={handleSaveProfile}
        profileImage={profileImage}
        onFileUpload={handleFileUpload}
      />
      
      <div className="flex-1 space-y-6">
        <ProfileForm 
          formData={formData}
          handleChange={handleChange}
          handleSaveProfile={handleSaveProfile}
          isLoading={isLoading}
        />
      </div>

      <SubscriptionsList />
    </div>
  );
};

export default ProfileSettings;
