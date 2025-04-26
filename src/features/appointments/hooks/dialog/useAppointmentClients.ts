
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (currentSalonId) {
      console.log("Loading clients for salon:", currentSalonId);
      let salonClients = MOCK_CLIENTS[currentSalonId] || [];
      
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
    }
  }, [currentSalonId, toast]);

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
    filteredClients
  };
};
