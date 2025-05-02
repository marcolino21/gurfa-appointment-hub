import { useState } from 'react';
import { Plus } from 'lucide-react';
import CommunicationsList from '@/features/communications/components/CommunicationsList';
import NewCommunicationDialog from '@/features/communications/components/NewCommunicationDialog';

export const Communications = () => {
  const [isNewCommunicationDialogOpen, setIsNewCommunicationDialogOpen] = useState(false);

  return (
    <div className="communications">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Comunicazioni</h1>
        <button
          onClick={() => setIsNewCommunicationDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md"
        >
          <Plus size={20} />
          Nuova Comunicazione
        </button>
      </div>

      <CommunicationsList type="all" />

      <NewCommunicationDialog
        open={isNewCommunicationDialogOpen}
        onOpenChange={setIsNewCommunicationDialogOpen}
      />
    </div>
  );
};

export default Communications;
