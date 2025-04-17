
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PermissionsSelector from '../../components/permissions/PermissionsSelector';
import { UserFormData } from '../../hooks/useUsersData';
import { SystemFeature, StaffRole } from '@/features/staff/types/permissions';

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: UserFormData;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPermissionsChange: (role: StaffRole, permissions: SystemFeature[]) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  onOpenChange,
  isEditMode,
  formData,
  isSaving,
  onChange,
  onPermissionsChange,
  onSave,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'MODIFICA UTENTE' : 'NUOVO UTENTE'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">NOME *</Label>
            <Input 
              id="firstName" 
              placeholder="Nome utente" 
              value={formData.firstName}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">COGNOME</Label>
            <Input 
              id="lastName" 
              placeholder="Cognome utente" 
              value={formData.lastName}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">EMAIL *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email utente" 
              value={formData.email}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <Label>PERMESSI E RUOLO</Label>
            <PermissionsSelector 
              initialRole={formData.role}
              initialPermissions={formData.permissions}
              onChange={onPermissionsChange}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annulla
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              'Salva'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
