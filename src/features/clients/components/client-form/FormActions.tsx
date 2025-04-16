
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Link2 } from 'lucide-react';

interface FormActionsProps {
  selectedClient: any | null;
  onConnectProject: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ selectedClient, onConnectProject }) => {
  return (
    <DialogFooter className="flex justify-between">
      <Button 
        type="button" 
        variant="outline"
        className="flex items-center gap-2"
        onClick={onConnectProject}
      >
        <Link2 size={16} />
        Collega Progetto
      </Button>
      
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Annulla</Button>
        </DialogClose>
        <Button type="submit">{selectedClient ? 'Salva modifiche' : 'Aggiungi cliente'}</Button>
      </div>
    </DialogFooter>
  );
};

export default FormActions;
