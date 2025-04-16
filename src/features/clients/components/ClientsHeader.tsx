
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { ClientFormValues } from '../types';

interface ClientsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  openAddDialog: () => void;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  openAddDialog
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Rubrica Clienti</CardTitle>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca cliente..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" /> Aggiungi cliente
        </Button>
      </div>
    </div>
  );
};

export default ClientsHeader;
