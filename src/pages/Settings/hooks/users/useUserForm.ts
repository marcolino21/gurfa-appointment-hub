
import { useState } from 'react';
import { UserFormData } from '../useUsersData';
import { STAFF_ROLES, DEFAULT_ROLE_PERMISSIONS, StaffRole, SystemFeature } from '@/features/staff/types/permissions';

export const useUserForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: STAFF_ROLES.EMPLOYEE,
    permissions: DEFAULT_ROLE_PERMISSIONS[STAFF_ROLES.EMPLOYEE],
  });
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: STAFF_ROLES.EMPLOYEE,
      permissions: DEFAULT_ROLE_PERMISSIONS[STAFF_ROLES.EMPLOYEE],
    });
    setIsEditMode(false);
    setEditingUserId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePermissionsChange = (role: StaffRole, permissions: SystemFeature[]) => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      permissions 
    }));
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    setIsEditMode,
    editingUserId,
    setEditingUserId,
    formData,
    setFormData,
    resetForm,
    handleChange,
    handlePermissionsChange
  };
};
