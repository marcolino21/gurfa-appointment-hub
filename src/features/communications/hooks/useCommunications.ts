
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Communication } from '../types';

// Mock data for communications
const MOCK_COMMUNICATIONS: Communication[] = [
  {
    id: '1',
    type: 'email',
    sender: 'Gurfa Beauty Concept',
    subject: 'Promozione Estiva 2023',
    content: 'Approfitta delle nostre promozioni estive con sconti fino al 30%!',
    recipientCount: 145,
    openRate: 35,
    clickRate: 12,
    sentAt: '2023-06-05T10:30:00Z',
    salonId: 'salon1',
  },
  {
    id: '2',
    type: 'sms',
    sender: 'Gurfa Beauty Concept',
    subject: 'Promemoria appuntamento',
    content: 'Gentile cliente, le ricordiamo l\'appuntamento di domani alle 15:30.',
    recipientCount: 20,
    openRate: 100,
    clickRate: 0,
    sentAt: '2023-06-12T14:20:00Z',
    salonId: 'salon1',
  },
  {
    id: '3',
    type: 'email',
    sender: 'Gurfa Beauty Concept',
    subject: 'Nuovi servizi disponibili',
    content: 'Scopri i nostri nuovi servizi di trattamento viso con prodotti biologici!',
    recipientCount: 164,
    openRate: 42,
    clickRate: 20,
    sentAt: '2023-07-01T09:15:00Z',
    salonId: 'salon1',
  },
  {
    id: '4',
    type: 'whatsapp',
    sender: 'Gurfa Beauty Concept',
    subject: 'Buon compleanno!',
    content: 'Tanti auguri! Per il tuo compleanno, ti regaliamo uno sconto del 15% su tutti i nostri servizi.',
    recipientCount: 1,
    openRate: 100,
    clickRate: 100,
    sentAt: '2023-07-22T08:45:00Z',
    salonId: 'salon1',
  },
];

export const useCommunications = (type: 'all' | 'email' | 'sms' | 'whatsapp') => {
  const { currentSalonId } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchCommunications = async () => {
      // In a real scenario, we would fetch from an API
      setIsLoading(true);
      try {
        // Filter by salon ID and type if specified
        let filteredCommunications = MOCK_COMMUNICATIONS;
        
        if (currentSalonId) {
          filteredCommunications = filteredCommunications.filter(
            comm => comm.salonId === currentSalonId
          );
        }
        
        if (type !== 'all') {
          filteredCommunications = filteredCommunications.filter(
            comm => comm.type === type
          );
        }
        
        // Sort by sent date (newest first)
        filteredCommunications.sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        
        setCommunications(filteredCommunications);
      } catch (error) {
        console.error('Error fetching communications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunications();
  }, [currentSalonId, type]);

  return { communications, isLoading };
};
