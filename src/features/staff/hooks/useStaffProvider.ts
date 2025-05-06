import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { StaffFormValues } from '../types';
import { useStaffData } from './useStaffData';

/**
 * Hook for providing staff context functionality
 */
export const useStaffProvider = (salonId: string | null) => {
  const { staffMembers, services, addStaff, editStaff, deleteStaff, toggleStaffStatus, toggleCalendarVisibility, hasSalon } = useStaffData(salonId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  // Get business name from localStorage
  useEffect(() => {
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
  }, []);

  // Handle Add Staff
  const handleAddStaff = async (data: StaffFormValues) => {
    try {
      await addStaff(data);
      setIsAddDialogOpen(false);
    } catch (error: any) {
      // Il toast di errore viene già gestito dentro addStaff
      console.error("Errore durante l'aggiunta dello staff:", error);
    }
  };

  // Handle Edit Staff
  const handleEditStaff = (data: StaffFormValues) => {
    if (selectedStaff) {
      editStaff(selectedStaff.id, data);
      setIsEditDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  // Handle Delete Staff
  const handleDeleteStaff = (staffId: string) => {
    deleteStaff(staffId);
  };

  // Toggle staff active status
  const handleToggleStatus = (staffId: string, isActive: boolean) => {
    toggleStaffStatus(staffId, isActive);
  };

  // Toggle calendar visibility
  const handleToggleCalendarVisibility = (staffId: string, showInCalendar: boolean) => {
    toggleCalendarVisibility(staffId, showInCalendar);
  };

  return {
    staffMembers,
    services,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedStaff,
    setSelectedStaff,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    handleToggleStatus,
    handleToggleCalendarVisibility,
    hasSalon,
    businessName,
  };
};
