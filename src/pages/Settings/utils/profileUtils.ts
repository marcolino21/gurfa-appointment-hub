
import { ProfileFormData, SalonProfile } from '../types/profileTypes';
import { supabase } from '@/integrations/supabase/client';
import { Salon } from '@/types';

export const saveSalonProfileToLocalStorage = (formData: ProfileFormData): void => {
  localStorage.setItem('salon_business_name', formData.businessName);
  localStorage.setItem('salon_ragione_sociale', formData.ragioneSociale);
  localStorage.setItem('salon_email', formData.email);
  localStorage.setItem('salon_piva', formData.piva);
  localStorage.setItem('salon_iban', formData.iban);
  localStorage.setItem('salon_codice_fiscale', formData.codiceFiscale);
  localStorage.setItem('salon_sede_legale', formData.sedeLegale);
};

export const loadSalonProfileFromLocalStorage = (currentSalon?: Salon): ProfileFormData => {
  return {
    businessName: currentSalon?.name || localStorage.getItem('salon_business_name') || '',
    phone: currentSalon?.phone || localStorage.getItem('salon_phone') || '',
    address: currentSalon?.address || localStorage.getItem('salon_address') || '',
    ragioneSociale: localStorage.getItem('salon_ragione_sociale') || '',
    email: localStorage.getItem('salon_email') || '',
    piva: localStorage.getItem('salon_piva') || '',
    iban: localStorage.getItem('salon_iban') || '',
    codiceFiscale: localStorage.getItem('salon_codice_fiscale') || '',
    sedeLegale: localStorage.getItem('salon_sede_legale') || ''
  };
};

export const mapFormDataToProfileData = (formData: ProfileFormData, salonId: string): SalonProfile => {
  return {
    salon_id: salonId,
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
};

export const checkProfileExists = async (salonId: string): Promise<{ data: SalonProfile | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('salon_profiles')
      .select('*') 
      .eq('salon_id', salonId)
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('Error in checkProfileExists:', err);
    return { data: null, error: err };
  }
};

export const saveSalonProfile = async (profileData: SalonProfile): Promise<{ error: any }> => {
  try {
    console.log('Checking if profile exists for salon:', profileData.salon_id);
    const { data: existingProfile, error: checkError } = await checkProfileExists(profileData.salon_id);
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking profile existence:', checkError);
      return { error: checkError };
    }
    
    let saveError;
    
    if (existingProfile) {
      console.log('Updating existing profile');
      // Aggiorna il profilo esistente
      const { error } = await supabase
        .from('salon_profiles')
        .update(profileData)
        .eq('salon_id', profileData.salon_id);
      
      saveError = error;
    } else {
      console.log('Creating new profile');
      // Crea un nuovo profilo
      const { error } = await supabase
        .from('salon_profiles')
        .insert(profileData);
      
      saveError = error;
    }
    
    if (saveError) {
      console.error('Error saving profile:', saveError);
    } else {
      console.log('Profile saved successfully');
    }
    
    return { error: saveError };
  } catch (err) {
    console.error('Unexpected error in saveSalonProfile:', err);
    return { error: err };
  }
};
