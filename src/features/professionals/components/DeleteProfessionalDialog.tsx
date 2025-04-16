
import React from 'react';
import { StaffMember } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  professional: StaffMember | null;
  onConfirm: () => void;
}

const DeleteProfessionalDialog: React.FC<DeleteProfessionalDialogProps> = ({
  isOpen,
  onOpenChange,
  professional,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro di voler eliminare questo professionista?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non può essere annullata. Tutti i dati associati a questo professionista saranno eliminati permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProfessionalDialog;
