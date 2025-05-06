
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

const FormFooter: React.FC<{ isEdit: boolean }> = ({ isEdit }) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">Annulla</Button>
      </DialogClose>
      <Button type="submit">{isEdit ? 'Salva modifiche' : 'Aggiungi membro'}</Button>
    </DialogFooter>
  );
};

export default FormFooter;
