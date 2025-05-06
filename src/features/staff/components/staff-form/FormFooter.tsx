
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../../types';

interface FormFooterProps {
  isEdit: boolean;
  form: UseFormReturn<StaffFormValues>;
}

const FormFooter: React.FC<FormFooterProps> = ({ isEdit, form }) => {
  const isFormValid = !Object.keys(form.formState.errors).length;
  const isSubmitting = form.formState.isSubmitting;
  
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">Annulla</Button>
      </DialogClose>
      <Button 
        type="submit" 
        disabled={isSubmitting || !isFormValid}
      >
        {isEdit ? 'Salva modifiche' : 'Aggiungi membro'}
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
