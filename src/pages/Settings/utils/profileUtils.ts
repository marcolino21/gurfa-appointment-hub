
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
    businessName: currentSalon?.name || '',
    phone: currentSalon?.phone || '',
    address: currentSalon?.address || '',
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
  const { data, error } = await supabase
    .from('salon_profiles')
    .select('*') // Select all columns instead of just 'id'
    .eq('salon_id', salonId)
    .single();
  
  return { data, error };
};

export const saveSalonProfile = async (profileData: SalonProfile): Promise<{ error: any }> => {
  const { data: existingProfile } = await checkProfileExists(profileData.salon_id);
  
  let saveError;
  
  if (existingProfile) {
    // Aggiorna il profilo esistente
    const { error } = await supabase
      .from('salon_profiles')
      .update(profileData)
      .eq('salon_id', profileData.salon_id);
    
    saveError = error;
  } else {
    // Crea un nuovo profilo
    const { error } = await supabase
      .from('salon_profiles')
      .insert(profileData);
    
    saveError = error;
  }
  
  return { error: saveError };
};
