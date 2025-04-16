
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { MOCK_STAFF } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getSalonStaff, updateStaffData } from '@/features/staff/utils/staffDataUtils';

export const useProfessionalsData = (salonId: string | null) => {
  const [professionals, setProfessionals] = useState<StaffMember[]>(
    salonId ? getSalonStaff(salonId) : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update professionals when salonId changes
  useEffect(() => {
    if (salonId) {
      setProfessionals(getSalonStaff(salonId));
    }
  }, [salonId, window.globalStaffData[salonId || '']]);

  const filteredProfessionals = professionals.filter(professional => {
    const fullName = `${professional.firstName} ${professional.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleToggleActive = (professionalId: string) => {
    const updatedProfessionals = professionals.map(pro => {
      if (pro.id === professionalId) {
        return { ...pro, isActive: !pro.isActive };
      }
      return pro;
    });
    
    setProfessionals(updatedProfessionals);
    
    // Update global staff data
    if (salonId) {
      updateStaffData(salonId, updatedProfessionals);
    }
    
    const professional = professionals.find(p => p.id === professionalId);
    const newStatus = !professional?.isActive;
    
    toast({
      title: newStatus ? 'Professionista attivato' : 'Professionista disattivato',
      description: `Il professionista è stato ${newStatus ? 'attivato' : 'disattivato'} con successo`
    });
  };

  const handleDelete = () => {
    if (!selectedProfessional) return;
    
    const updatedProfessionals = professionals.filter(pro => pro.id !== selectedProfessional.id);
    setProfessionals(updatedProfessionals);
    
    // Update global staff data
    if (salonId) {
      updateStaffData(salonId, updatedProfessionals);
    }
    
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
