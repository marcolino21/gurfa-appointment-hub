
import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/types/clients';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_CLIENTS } from '@/data/mock/clients';
import { useToast } from '@/hooks/use-toast';

export const useAppointmentClients = () => {
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Funzione per caricare i clienti del salone
  const loadClients = useCallback(async () => {
    if (!currentSalonId || isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log("Loading clients for salon:", currentSalonId);
      let salonClients = MOCK_CLIENTS[currentSalonId] || [];
      
      // Se non ci sono clienti, creiamo un cliente di prova
      if (salonClients.length === 0) {
        salonClients = [
          {
            id: 'default-client-1',
            firstName: 'Cliente',
            lastName: 'Di Prova',
            gender: 'M' as 'M',
            salonId: currentSalonId,
            isPrivate: true,
            phone: '3331234567'
          }
        ];
        
        toast({
          title: "Clienti di prova caricati",
          description: "È stato aggiunto un cliente di prova per poter creare appuntamenti.",
        });
      }
      
      setAvailableClients(salonClients);
      console.log("Loaded clients:", salonClients.length);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Errore nel caricamento clienti",
        description: "Non è stato possibile caricare l'elenco dei clienti.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSalonId, toast, isLoading]);

  // Carica clienti all'avvio o quando cambia il salone
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Filtra i clienti in base al termine di ricerca
  const filteredClients = clientSearchTerm === ''
    ? availableClients
    : availableClients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(clientSearchTerm.toLowerCase());
      });

  return {
    availableClients,
    clientSearchTerm,
    setClientSearchTerm,
    validationError,
    setValidationError,
    filteredClients,
    isLoading,
    refreshClients: loadClients
  };
};
