import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormData } from '../types/profileTypes';
import { useLoadSalonProfile } from './profile/useLoadSalonProfile';
import { useSaveSalonProfile } from './profile/useSaveSalonProfile';

export const useProfileSettings = () => {
  const { currentSalonId, salons, updateSalonInfo } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('salon_profile_image') || null
  );
  
  const [formData, setFormData] = useState<ProfileFormData>({
    businessName: currentSalon?.name || '',
    phone: currentSalon?.phone || '',
    address: currentSalon?.address || '',
    ragioneSociale: '',
    email: '',
    piva: '',
    iban: '',
    codiceFiscale: '',
    sedeLegale: '',
    businessHours: {}
  });
  
  const { 
    isInitialLoading, 
    loadSalonProfile 
  } = useLoadSalonProfile({
    currentSalonId,
    currentSalon,
    setFormData,
    updateSalonInfo,
    setError,
    toast
  });

  const { handleSaveProfile: saveProfile } = useSaveSalonProfile({
    currentSalonId,
    currentSalon,
    formData,
    setIsLoading,
    setError,
    updateSalonInfo,
    toast
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'businessHours' ? JSON.parse(value) : value
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
  
  const handleSaveProfile = async () => {
    await saveProfile();
  };
  
  useEffect(() => {
    console.log('useProfileSettings effect triggered, currentSalonId:', currentSalonId);
    // Load profile data regardless of whether a salon is selected
    loadSalonProfile();
  }, [currentSalonId]);
  
  return {
    currentSalon,
    formData,
    isLoading,
    isInitialLoading,
    profileImage,
    error,
    handleChange,
    handleFileUpload,
    handleSaveProfile
  };
};
