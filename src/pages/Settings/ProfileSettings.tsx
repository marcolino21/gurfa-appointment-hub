
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import SubscriptionsList from './components/SubscriptionsList';
import { supabase } from '@/integrations/supabase/client';

// Define an interface for the salon_profiles table
interface SalonProfile {
  id?: string;
  salon_id: string;
  business_name: string;
  phone?: string;
  address?: string;
  ragione_sociale?: string;
  email?: string;
  piva?: string;
  iban?: string;
  codice_fiscale?: string;
  sede_legale?: string;
  created_at?: string;
  updated_at?: string;
}

const ProfileSettings = () => {
  const { user, currentSalonId, salons, setCurrentSalon, updateSalonInfo } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('salon_profile_image') || null
  );
  
  // Form state
  const [formData, setFormData] = useState({
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
  
  useEffect(() => {
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
          setFormData({
            businessName: currentSalon?.name || '',
            phone: currentSalon?.phone || '',
            address: currentSalon?.address || '',
            ragioneSociale: localStorage.getItem('salon_ragione_sociale') || '',
            email: localStorage.getItem('salon_email') || '',
            piva: localStorage.getItem('salon_piva') || '',
            iban: localStorage.getItem('salon_iban') || '',
            codiceFiscale: localStorage.getItem('salon_codice_fiscale') || '',
            sedeLegale: localStorage.getItem('salon_sede_legale') || ''
          });
        }
      } catch (error) {
        console.error('Errore inaspettato:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadSalonProfile();
  }, [currentSalonId, currentSalon]);
  
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
      const profileData: SalonProfile = {
        salon_id: currentSalonId,
        business_name: formData.businessName,
        phone: formData.phone,
        address: formData.address,
        ragione_sociale: formData.ragioneSociale,
        email: formData.email,
        piva: formData.piva,
        iban: formData.iban,
        codice_fiscale: formData.codiceFiscale,
        sede_legale: formData.sedeLegale,
        updated_at: new Date().toISOString()
      };
      
      // Verifica se esiste già un record per questo salone
      const { data: existingProfile, error: checkError } = await supabase
        .from('salon_profiles')
        .select('id')
        .eq('salon_id', currentSalonId)
        .single();
      
      let saveError;
      
      if (existingProfile) {
        // Aggiorna il profilo esistente
        const { error } = await supabase
          .from('salon_profiles')
          .update(profileData)
          .eq('salon_id', currentSalonId);
        
        saveError = error;
      } else {
        // Crea un nuovo profilo
        const { error } = await supabase
          .from('salon_profiles')
          .insert(profileData);
        
        saveError = error;
      }
      
      if (saveError) {
        throw saveError;
      }
      
      // Salva anche nel localStorage come backup
      localStorage.setItem('salon_business_name', formData.businessName);
      localStorage.setItem('salon_ragione_sociale', formData.ragioneSociale);
      localStorage.setItem('salon_email', formData.email);
      localStorage.setItem('salon_piva', formData.piva);
      localStorage.setItem('salon_iban', formData.iban);
      localStorage.setItem('salon_codice_fiscale', formData.codiceFiscale);
      localStorage.setItem('salon_sede_legale', formData.sedeLegale);
      
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
  
  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2 text-muted-foreground">Caricamento profilo...</span>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProfileSettings;

