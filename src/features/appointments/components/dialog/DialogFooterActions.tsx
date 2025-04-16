
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

interface DialogFooterActionsProps {
  isExistingAppointment: boolean;
  isSubmitting: boolean;
  onShowDeleteConfirm: () => void;
  onSubmit: () => void;
}

const DialogFooterActions: React.FC<DialogFooterActionsProps> = ({
  isExistingAppointment,
  isSubmitting,
  onShowDeleteConfirm,
  onSubmit
}) => {
  return (
    <DialogFooter className="flex justify-between">
      <div>
        {isExistingAppointment && (
          <Button variant="outline" onClick={onShowDeleteConfirm}>
            Elimina
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="outline">Annulla</Button>
        </DialogClose>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : isExistingAppointment ? 'Aggiorna' : 'Crea'}
        </Button>
      </div>
    </DialogFooter>
  );
};

export default DialogFooterActions;
