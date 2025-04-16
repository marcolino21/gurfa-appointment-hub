
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

interface StaffFormActionsProps {
  isEdit: boolean;
}

const StaffFormActions: React.FC<StaffFormActionsProps> = ({ isEdit }) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">Annulla</Button>
      </DialogClose>
      <Button type="submit">{isEdit ? 'Salva modifiche' : 'Aggiungi membro'}</Button>
    </DialogFooter>
  );
};

export default StaffFormActions;
