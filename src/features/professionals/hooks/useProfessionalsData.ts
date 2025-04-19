
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getSalonStaff, updateStaffData } from '@/features/staff/utils/staffDataUtils';

export const useProfessionalsData = (salonId: string | null) => {
  const [professionals, setProfessionals] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update professionals when salonId changes or global staff data changes
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (salonId) {
        try {
          // Get fresh data from the database
          const staffData = await getSalonStaff(salonId);
          console.log("Professionals data refreshed on salonId change:", staffData);
          setProfessionals(staffData);
        } catch (error) {
          console.error("Error fetching professionals:", error);
        }
      } else {
        setProfessionals([]);
      }
    };

    fetchProfessionals();
  }, [salonId]);

  // Listen for custom staffDataUpdated event
  useEffect(() => {
    const handleStaffDataUpdate = async (event: CustomEvent) => {
      if (salonId && event.detail.salonId === salonId) {
        try {
          const freshData = await getSalonStaff(salonId);
          console.log("Professionals data updated via event:", freshData);
          setProfessionals(freshData);
        } catch (error) {
          console.error("Error refreshing professional data:", error);
        }
      }
    };

    // Add event listener
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Regular polling as a fallback
    const intervalId = setInterval(async () => {
      if (salonId) {
        try {
          const freshData = await getSalonStaff(salonId);
          if (JSON.stringify(freshData) !== JSON.stringify(professionals)) {
            console.log("Professionals data updated via polling:", freshData);
            setProfessionals(freshData);
          }
        } catch (error) {
          console.error("Error polling professional data:", error);
        }
      }
    }, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, [salonId, professionals]);

  const filteredProfessionals = professionals.filter(professional => {
    const fullName = `${professional.firstName} ${professional.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleToggleActive = async (professionalId: string) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato: salonId non definito',
        variant: 'destructive',
      });
      return;
    }
    
    const professional = professionals.find(p => p.id === professionalId);
    if (!professional) return;
    
    const newStatus = !professional.isActive;
    
    try {
      // Update in the database
      await updateStaffData(salonId, { 
        id: professionalId, 
        isActive: newStatus 
      });
      
      // Update in local state
      setProfessionals(prev => prev.map(pro => {
        if (pro.id === professionalId) {
          return { ...pro, isActive: newStatus };
        }
        return pro;
      }));
      
      toast({
        title: newStatus ? 'Professionista attivato' : 'Professionista disattivato',
        description: `Il professionista è stato ${newStatus ? 'attivato' : 'disattivato'} con successo`
      });
    } catch (error) {
      console.error("Error updating professional status:", error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiornare lo stato del professionista',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProfessional || !salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il professionista: informazioni mancanti',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Delete from database (this will trigger an update event)
      await updateStaffData(salonId, {
        id: selectedProfessional.id,
        isActive: false  // Instead of deleting, we just mark as inactive
      });
      
      // Update local state
      setProfessionals(prev => prev.map(pro => 
        pro.id === selectedProfessional.id ? { ...pro, isActive: false } : pro
      ));
      
      toast({
        title: 'Professionista disattivato',
        description: 'Il professionista è stato disattivato con successo'
      });
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il professionista',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProfessional(null);
    }
  };

  const handleEdit = (professional: StaffMember) => {
    navigate('/staff');
    toast({
      title: 'Modifica professionista',
      description: 'Stai modificando i dettagli del professionista'
    });
  };

  const openDeleteDialog = (professional: StaffMember) => {
    setSelectedProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  return {
    professionals: filteredProfessionals,
    searchTerm,
    setSearchTerm,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProfessional,
    handleToggleActive,
    handleDelete,
    handleEdit,
    openDeleteDialog
  };
};
