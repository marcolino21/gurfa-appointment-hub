
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { loadSalonProfileFromLocalStorage } from '../../utils/profileUtils';
import { Salon } from '@/types';
import { ProfileFormData, BusinessHoursByDay, SalonProfile } from '../../types/profileTypes';
import { toast } from '@/hooks/use-toast';

interface UseLoadSalonProfileProps {
  currentSalonId: string | null;
  currentSalon: Salon | undefined;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  updateSalonInfo: (salonId: string, updatedInfo: Salon) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  toast: typeof toast;
}

export const useLoadSalonProfile = ({
  currentSalonId,
  currentSalon,
  setFormData,
  updateSalonInfo,
  setError,
  toast
}: UseLoadSalonProfileProps) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadSalonProfile = async () => {
    if (!currentSalonId) {
      console.log('No salon ID provided, using default empty profile');
      setIsInitialLoading(false);
      setFormData(loadSalonProfileFromLocalStorage(currentSalon));
      return;
    }
    
    setIsInitialLoading(true);
    setError(null);
    console.log(`Loading profile for salon ID: ${currentSalonId}`);
    
    try {
      const { data, error } = await supabase
        .from('salon_profiles')
        .select('*')
        .eq('salon_id', currentSalonId)
        .maybeSingle();
      
      if (error) {
        console.error('Error loading salon profile:', error);
        
        if (error.code === 'PGRST116') {
          console.log('No profile found for this salon, using localStorage fallback');
          setFormData(loadSalonProfileFromLocalStorage(currentSalon));
        } else {
          setError(`Impossibile caricare il profilo: ${error.message}`);
          toast({
            variant: 'destructive',
            title: 'Errore',
            description: `Impossibile caricare il profilo del salone: ${error.message}`
          });
          setFormData(loadSalonProfileFromLocalStorage(currentSalon));
        }
      } else if (data) {
        console.log('Profile found in database:', data);

        // Garantire sempre che business_hours sia presente e tipizzato
        // business_hours potrebbe non essere presente tra le colonne attuali del db, quindi lo gestiamo in modo sicuro
        let businessHours: BusinessHoursByDay = {};
        if ('business_hours' in data && data.business_hours) {
          businessHours = data.business_hours as BusinessHoursByDay;
        }
        
        setFormData({
          businessName: data.business_name || currentSalon?.name || '',
          phone: data.phone || currentSalon?.phone || '',
          address: data.address || currentSalon?.address || '',
          ragioneSociale: data.ragione_sociale || '',
          email: data.email || '',
          piva: data.piva || '',
          iban: data.iban || '',
          codiceFiscale: data.codice_fiscale || '',
          sedeLegale: data.sede_legale || '',
          businessHours
        });
        
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
        console.log('No profile data returned, using localStorage fallback');
        setFormData(loadSalonProfileFromLocalStorage(currentSalon));
      }
    } catch (error: any) {
      console.error('Unexpected error while loading profile:', error);
      setError(`Errore inaspettato: ${error?.message || 'Errore sconosciuto'}`);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore inaspettato: ${error?.message || 'Errore sconosciuto'}`
      });
      setFormData(loadSalonProfileFromLocalStorage(currentSalon));
    } finally {
      setIsInitialLoading(false);
    }
  };
  
  return { isInitialLoading, loadSalonProfile };
};
