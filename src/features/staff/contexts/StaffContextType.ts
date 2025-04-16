
import { StaffMember, Service } from '@/types';
import { StaffFormValues } from '../types';

/**
 * Type definition for the StaffContext
 */
export interface StaffContextType {
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
