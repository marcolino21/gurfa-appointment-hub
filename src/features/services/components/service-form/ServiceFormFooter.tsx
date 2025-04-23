
import React from 'react';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ServiceFormFooterProps {
  isEditing: boolean;
  isSubmitting?: boolean;
}

export const ServiceFormFooter: React.FC<ServiceFormFooterProps> = ({ 
  isEditing,
  isSubmitting = false 
}) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline">Annulla</Button>
      </DialogClose>
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? 'Salva modifiche' : 'Aggiungi servizio'}
      </Button>
    </DialogFooter>
  );
};
