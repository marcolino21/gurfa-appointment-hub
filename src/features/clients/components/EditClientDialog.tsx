
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../types';
import { Client } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ClientForm from './ClientForm';

interface EditClientDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientForm: UseFormReturn<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClient: Client | null;
}

const EditClientDialog: React.FC<EditClientDialogProps> = ({
  isOpen,
  setIsOpen,
  clientForm,
  onSubmit,
  activeTab,
  setActiveTab,
  selectedClient,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] w-[95%] max-h-[85vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Modifica cliente</DialogTitle>
          <DialogDescription>
            Modifica i dati del cliente
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          clientForm={clientForm}
          onSubmit={onSubmit}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedClient={selectedClient}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
