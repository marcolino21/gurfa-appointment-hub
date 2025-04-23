
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/types';

interface FormActionsProps {
  selectedClient: Client | null;
  onConnectProject: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ selectedClient, onConnectProject }) => {
  const navigate = useNavigate();
  
  const handleConnectProject = () => {
    if (selectedClient) {
      // Se abbiamo già un cliente, andiamo direttamente alla pagina di creazione del progetto
      navigate(`/progetti/nuovo?clientId=${selectedClient.id}`);
    } else {
      // Se stiamo creando un nuovo cliente, avvisiamo il componente genitore
      onConnectProject();
    }
  };

  return (
    <DialogFooter className="flex justify-between">
      <Button 
        type="button" 
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleConnectProject}
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
