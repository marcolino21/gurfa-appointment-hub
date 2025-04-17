
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useUsersData } from './hooks/useUsersData';
import { useUserActions } from './hooks/useUserActions';
import { UsersTable, UserFormDialog, UserActions } from './components/users';

const UsersSettings = () => {
  // Use the custom hooks to manage state and actions
  const { users, setUsers, isLoading, currentSalonId } = useUsersData();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
    handlePermissionsChange,
    handleSaveUser,
    handleDeleteUser
  } = useUserActions(currentSalonId, users, setUsers);
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <UserActions onAddUser={() => handleOpenDialog()} />
        
        <Card>
          <CardContent className="p-0">
            <UsersTable
              users={users}
              isLoading={isLoading}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteUser}
            />
          </CardContent>
        </Card>
      </div>

      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        formData={formData}
        isSaving={isSaving}
        onChange={handleChange}
        onPermissionsChange={handlePermissionsChange}
        onSave={handleSaveUser}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default UsersSettings;
