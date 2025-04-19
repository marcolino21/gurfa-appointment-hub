
import { saveSalonProfileToLocalStorage, mapFormDataToProfileData, saveSalonProfile } from '../../utils/profileUtils';
import { Salon } from '@/types';
import { ProfileFormData } from '../../types/profileTypes';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, addSalon } = useAuth();

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let salonId = currentSalonId;
      let salon = currentSalon;
      
      // Se non esiste un salonId, significa che è la prima volta che si salvano i dati
      // quindi creiamo una nuova attività
      if (!salonId) {
        // Verifica che user esista prima di utilizzarlo
        if (!user || !user.id) {
          throw new Error('Utente non autenticato');
        }
        
        // Crea una nuova attività
        const newSalon: Salon = {
          id: `salon-${Date.now()}`,
          name: formData.businessName,
          ownerId: user.id,
          address: formData.address || undefined,
          phone: formData.phone || undefined
        };
        
        // Aggiungi il salone al contesto
        addSalon(newSalon);
        
        // Aggiorna le variabili locali
        salonId = newSalon.id;
        salon = newSalon;
        
        // Notifica all'utente
        console.log('Nuova attività creata:', newSalon);
        
        toast({
          title: 'Attività creata',
          description: `L'attività ${formData.businessName} è stata creata con successo.`,
        });
      }

      // Se ancora non abbiamo un salonId, qualcosa è andato storto
      if (!salonId) {
        throw new Error('Impossibile creare o trovare un\'attività');
      }

      const profileData = mapFormDataToProfileData(formData, salonId);
      
      const { error: saveError } = await saveSalonProfile(profileData);
      
      if (saveError) {
        throw saveError;
      }
      
      // Salva nel localStorage come backup
      saveSalonProfileToLocalStorage(formData);
      
      // Aggiorna il salone nel context se esiste
      if (salon) {
        const updatedSalon = {
          ...salon,
          name: formData.businessName,
          phone: formData.phone,
          address: formData.address
        };
        
        updateSalonInfo(salonId, updatedSalon);
      }
      
      // Dispatch custom event to notify that business name changed
      const event = new CustomEvent('business_name_changed', { 
        detail: { businessName: formData.businessName }
      });
      window.dispatchEvent(event);
      
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
