
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_SERVICE_CATEGORIES, MOCK_STAFF } from '@/data/mockData';
import { Service, ServiceCategory, StaffMember } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing the state of services, categories, and staff data
 */
export const useServicesState = () => {
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>(
    currentSalonId ? MOCK_SERVICE_CATEGORIES[currentSalonId] || [] : []
  );
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    currentSalonId ? MOCK_STAFF[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('dettagli');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!currentSalonId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      console.log('Fetching services for salon ID:', currentSalonId);
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('salon_id', currentSalonId);
          
        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }
        
        console.log('Services fetched from Supabase:', data);
        
        // Transform the data from database format to app format
        const transformedServices: Service[] = data?.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          duration: item.duration,
          tempoDiPosa: item.tempo_di_posa,
          price: item.price,
          color: item.color,
          salonId: item.salon_id,
          assignedStaffIds: item.assigned_staff_ids || [],
          assignedServiceIds: item.assigned_service_ids || [],
        })) || [];
        
        setServices(transformedServices);
      } catch (error) {
        console.error('Errore durante il recupero dei servizi:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare i servizi.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [currentSalonId, toast]);

  return {
    services,
    setServices,
    categories,
    staffMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedService,
    setSelectedService,
    activeTab,
    setActiveTab,
    currentSalonId,
    isLoading
  };
};
