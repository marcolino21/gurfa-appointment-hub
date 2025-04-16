
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
    if (salonId) {
      // Get fresh data from global storage
      const staffData = getSalonStaff(salonId);
      console.log("Professionals data refreshed on salonId change:", staffData);
      setProfessionals(staffData);
    } else {
      setProfessionals([]);
    }
  }, [salonId]);

  // Listen for custom staffDataUpdated event
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      if (salonId && event.detail.salonId === salonId) {
        const freshData = getSalonStaff(salonId);
        console.log("Professionals data updated via event:", freshData);
        setProfessionals(freshData);
      }
    };

    // Add event listener
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Regular polling as a fallback
    const intervalId = setInterval(() => {
      if (salonId) {
        const freshData = getSalonStaff(salonId);
        if (JSON.stringify(freshData) !== JSON.stringify(professionals)) {
          console.log("Professionals data updated via polling:", freshData);
          setProfessionals(freshData);
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

  const handleToggleActive = (professionalId: string) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato: salonId non definito',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedProfessionals = professionals.map(pro => {
      if (pro.id === professionalId) {
        return { ...pro, isActive: !pro.isActive };
      }
      return pro;
    });
    
    setProfessionals(updatedProfessionals);
    
    // Update global staff data
    updateStaffData(salonId, updatedProfessionals);
    
    const professional = professionals.find(p => p.id === professionalId);
    const newStatus = !professional?.isActive;
    
    toast({
      title: newStatus ? 'Professionista attivato' : 'Professionista disattivato',
      description: `Il professionista è stato ${newStatus ? 'attivato' : 'disattivato'} con successo`
    });
  };

  const handleDelete = () => {
    if (!selectedProfessional || !salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il professionista: informazioni mancanti',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedProfessionals = professionals.filter(pro => pro.id !== selectedProfessional.id);
    setProfessionals(updatedProfessionals);
    
    // Update global staff data
    updateStaffData(salonId, updatedProfessionals);
    
    toast({
      title: 'Professionista eliminato',
      description: 'Il professionista è stato eliminato con successo'
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedProfessional(null);
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
