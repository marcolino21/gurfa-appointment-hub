
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StaffMember, Service } from '@/types';
import { StaffFormValues } from '../types';
import { useStaffData } from '../hooks/useStaffData';
import { useAuth } from '@/contexts/AuthContext';

// Define the shape of our context
interface StaffContextType {
  staffMembers: StaffMember[];
  services: Service[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedStaff: StaffMember | null;
  setSelectedStaff: (staff: StaffMember | null) => void;
  handleAddStaff: (data: StaffFormValues) => void;
  handleEditStaff: (data: StaffFormValues) => void;
  handleDeleteStaff: (staffId: string) => void;
  handleToggleStatus: (staffId: string, isActive: boolean) => void;
  handleToggleCalendarVisibility: (staffId: string, showInCalendar: boolean) => void;
  hasSalon: boolean;
}

// Create the context with default values
const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Provider component that wraps the part of your app that needs the context
export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentSalonId } = useAuth();
  const { staffMembers, services, addStaff, editStaff, deleteStaff, toggleStaffStatus, toggleCalendarVisibility, hasSalon } = useStaffData(currentSalonId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Handle Add Staff
  const handleAddStaff = (data: StaffFormValues) => {
    addStaff(data);
    setIsAddDialogOpen(false);
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

  const value = {
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
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};

// Custom hook to use our Staff context
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
