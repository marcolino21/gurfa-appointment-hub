
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../../types';

interface FormFooterProps {
  isEdit: boolean;
  form: UseFormReturn<StaffFormValues>;
}

const FormFooter: React.FC<FormFooterProps> = ({ isEdit, form }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const isSubmitting = form.formState.isSubmitting;
  const { errors, isDirty } = form.formState;
  
  // Check form validity whenever form state changes
  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    // In edit mode, also check if form has been modified (isDirty)
    const shouldDisable = isSubmitting || (isEdit && !isDirty) || hasErrors;
    setIsFormDisabled(shouldDisable);
    
    // Debug logs
    console.log('Form state:', { 
      hasErrors, 
      isSubmitting, 
      isDirty,
      shouldDisable,
      errors
    });
  }, [errors, isSubmitting, isDirty, isEdit]);
  
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">Annulla</Button>
      </DialogClose>
      <Button 
        type="submit" 
        disabled={isFormDisabled}
      >
        {isEdit ? 'Salva modifiche' : 'Aggiungi membro'}
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
