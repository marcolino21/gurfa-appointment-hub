
import { User } from './useUsersData';
import { useUserForm } from './users/useUserForm';
import { useUserOperations } from './users/useUserOperations';

export const useUserActions = (
  currentSalonId: string | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const {
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
  } = useUserForm();

  const {
    isSaving,
    handleSaveUser,
    handleDeleteUser
  } = useUserOperations(currentSalonId, users, setUsers);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setEditingUserId(user.id);
      
      const names = user.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: user.email,
        role: user.role as StaffRole,
        permissions: user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role as StaffRole || STAFF_ROLES.EMPLOYEE]
      });
    } else {
      resetForm();
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSaveUserWrapper = async () => {
    await handleSaveUser(formData, isEditMode, editingUserId);
    handleCloseDialog();
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
    handlePermissionsChange,
    handleSaveUser: handleSaveUserWrapper,
    handleDeleteUser
  };
};
