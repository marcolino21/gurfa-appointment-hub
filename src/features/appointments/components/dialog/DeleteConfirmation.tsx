
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface DeleteConfirmationProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isSubmitting,
  onCancel,
  onDelete
}) => {
  return (
    <DialogFooter>
      <div className="w-full p-4 bg-red-50 rounded-md mb-4">
        <p className="text-red-600 font-semibold mb-2">Conferma eliminazione</p>
        <p className="text-sm text-red-600 mb-4">Sei sicuro di voler eliminare questo appuntamento? Questa azione non può essere annullata.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Annulla</Button>
          <Button variant="destructive" onClick={onDelete} disabled={isSubmitting}>
            {isSubmitting ? 'Eliminazione...' : 'Elimina'}
          </Button>
        </div>
      </div>
    </DialogFooter>
  );
};

export default DeleteConfirmation;
