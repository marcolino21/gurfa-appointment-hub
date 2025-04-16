
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ClientForm from './ClientForm';

interface AddClientDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientForm: UseFormReturn<ClientFormValues>;
  onSubmit: (data: ClientFormValues, createProject?: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  setIsOpen,
  clientForm,
  onSubmit,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Aggiungi nuovo cliente</DialogTitle>
          <DialogDescription>
            Inserisci i dati del nuovo cliente
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          clientForm={clientForm}
          onSubmit={onSubmit}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedClient={null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
