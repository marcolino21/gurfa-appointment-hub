
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const useFreelanceData = () => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('freelancers') // Make sure this table exists and you have permissions to access it
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedData: User[] = data.map((freelancer) => ({
          id: freelancer.id,
          name: `${freelancer.first_name} ${freelancer.last_name}`,
          email: freelancer.email,
          role: 'freelance',
          isActive: freelancer.is_active || false
        }));
        
        setFreelancers(formattedData);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei freelance:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile caricare i freelance.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFreelancerStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('freelancers')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setFreelancers(freelancers.map(freelancer => 
        freelancer.id === id 
          ? { ...freelancer, isActive: !isActive } 
          : freelancer
      ));

      toast({
        title: 'Stato aggiornato',
        description: `Il freelance è stato ${!isActive ? 'attivato' : 'disattivato'} con successo.`
      });
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile aggiornare lo stato del freelance.'
      });
    }
  };

  return {
    freelancers,
    isLoading,
    toggleFreelancerStatus,
    fetchFreelancers
  };
};
