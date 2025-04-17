
import { saveSalonProfileToLocalStorage, mapFormDataToProfileData, saveSalonProfile } from '../../utils/profileUtils';
import { Salon } from '@/types';
import { ProfileFormData } from '../../types/profileTypes';
import { toast } from '@/hooks/use-toast';

interface UseSaveSalonProfileProps {
  currentSalonId: string | null;
  currentSalon: Salon | undefined;
  formData: ProfileFormData;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  updateSalonInfo: (salonId: string, updatedInfo: Salon) => void;
  toast: typeof toast;
}

export const useSaveSalonProfile = ({
  currentSalonId,
  currentSalon,
  formData,
  setIsLoading,
  setError,
  updateSalonInfo,
  toast
}: UseSaveSalonProfileProps) => {

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
    setError(null);
    console.log('Saving profile for salon ID:', currentSalonId);
    
    try {
      const profileData = mapFormDataToProfileData(formData, currentSalonId);
      console.log('Profile data to save:', profileData);
      
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
      setError(`Impossibile salvare il profilo: ${error?.message || 'Errore sconosciuto'}`);
      toast({
        variant: 'destructive',
        title: "Errore",
        description: `Impossibile salvare il profilo: ${error?.message || 'Errore sconosciuto'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSaveProfile };
};
