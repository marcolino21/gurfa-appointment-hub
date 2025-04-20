
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FreelanceForm } from './FreelanceForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddFreelanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddFreelanceDialog = ({ isOpen, onClose, onSuccess }: AddFreelanceDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('freelancers')
        .insert([{
          ...data,
          is_active: true,
          subscription_status: 'inactive'
        }]);

      if (error) throw error;

      toast({
        title: 'Freelance aggiunto',
        description: 'Il freelance è stato aggiunto con successo',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile salvare il freelance',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95%] max-h-[85vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Aggiungi Freelance</DialogTitle>
        </DialogHeader>
        <FreelanceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};
