
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormData, SalonProfile } from '../types/profileTypes';
import { 
  loadSalonProfileFromLocalStorage, 
  mapFormDataToProfileData,
  saveSalonProfile, 
  saveSalonProfileToLocalStorage 
} from '../utils/profileUtils';

export const useProfileSettings = () => {
  const { user, currentSalonId, salons, updateSalonInfo } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('salon_profile_image') || null
  );
  
  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    businessName: currentSalon?.name || '',
    phone: currentSalon?.phone || '',
    address: currentSalon?.address || '',
    ragioneSociale: '',
    email: '',
    piva: '',
    iban: '',
    codiceFiscale: '',
    sedeLegale: ''
  });
  
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
  
  const loadSalonProfile = async () => {
    if (!currentSalonId) return;
    
    setIsInitialLoading(true);
    try {
      // Verifica se esiste già un profilo per questo salone
      const { data, error } = await supabase
        .from('salon_profiles')
        .select('*')
        .eq('salon_id', currentSalonId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 è "No rows returned"
        console.error('Errore nel caricamento del profilo:', error);
        toast({
          variant: 'destructive',
          title: 'Errore',
          description: 'Impossibile caricare il profilo del salone.'
        });
        return;
      }
      
      if (data) {
        setFormData({
          businessName: data.business_name || currentSalon?.name || '',
          phone: data.phone || currentSalon?.phone || '',
          address: data.address || currentSalon?.address || '',
          ragioneSociale: data.ragione_sociale || '',
          email: data.email || '',
          piva: data.piva || '',
          iban: data.iban || '',
          codiceFiscale: data.codice_fiscale || '',
          sedeLegale: data.sede_legale || ''
        });
        
        // Aggiorna anche le informazioni nel context
        if (currentSalon && (
          currentSalon.name !== data.business_name ||
          currentSalon.phone !== data.phone ||
          currentSalon.address !== data.address
        )) {
          updateSalonInfo(currentSalonId, {
            ...currentSalon,
            name: data.business_name,
            phone: data.phone,
            address: data.address
          });
        }
      } else {
        // Carica i dati dal localStorage come fallback
        setFormData(loadSalonProfileFromLocalStorage(currentSalon));
      }
    } catch (error) {
      console.error('Errore inaspettato:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!currentSalonId) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Nessun salone selezionato.'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const profileData = mapFormDataToProfileData(formData, currentSalonId);
      
      const { error: saveError } = await saveSalonProfile(profileData);
      
      if (saveError) {
        throw saveError;
      }
      
      // Salva anche nel localStorage come backup
      saveSalonProfileToLocalStorage(formData);
      
      // Aggiorna il salone nel context
      if (currentSalon) {
        const updatedSalon = {
          ...currentSalon,
          name: formData.businessName,
          phone: formData.phone,
          address: formData.address
        };
        
        updateSalonInfo(currentSalonId, updatedSalon);
      }
      
      toast({
        title: "Profilo salvato",
        description: "Le modifiche al profilo sono state salvate con successo."
      });
      
    } catch (error: any) {
      console.error('Errore nel salvataggio del profilo:', error);
      toast({
        variant: 'destructive',
        title: "Errore",
        description: `Impossibile salvare il profilo: ${error.message || 'Errore sconosciuto'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadSalonProfile();
  }, [currentSalonId, currentSalon]);
  
  return {
    currentSalon,
    formData,
    isLoading,
    isInitialLoading,
    profileImage,
    handleChange,
    handleFileUpload,
    handleSaveProfile
  };
};
