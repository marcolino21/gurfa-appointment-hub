
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsersData } from './hooks/useUsersData';
import { useUserActions } from './hooks/useUserActions';
import { UsersTable, UserFormDialog, UserActions } from './components/users';
import PaymentMethodDialog from "@/components/PaymentMethodDialog";

const UsersSettings = () => {
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

  // Stato per gestire il dialog del metodo di pagamento
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <UserActions onAddUser={() => handleOpenDialog()} />
          <Button
            variant="outline"
            onClick={() => setIsPaymentDialogOpen(true)}
            className="ml-auto"
          >
            Aggiungi Metodo di Pagamento
          </Button>
        </div>
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

      {/* Dialog per la gestione del metodo di pagamento, come in Freelance */}
      <PaymentMethodDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onSubmit={(data) => {
          // Qui si potranno gestire i dati inseriti dall'utente nel modulo
          console.log("Dati carta utente:", data);
        }}
      />
    </div>
  );
};

export default UsersSettings;

