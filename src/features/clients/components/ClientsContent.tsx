
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ClientsTable from './ClientsTable';
import ClientsHeader from './ClientsHeader';
import { Client } from '@/types';

interface ClientsContentProps {
  filteredClients: Client[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  openAddDialog: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const ClientsContent: React.FC<ClientsContentProps> = ({
  filteredClients,
  searchTerm,
  setSearchTerm,
  openAddDialog,
  onEditClient,
  onDeleteClient,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <ClientsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openAddDialog={openAddDialog}
        />
        <div className="mt-6">
          <ClientsTable
            clients={filteredClients}
            onEdit={onEditClient}
            onDelete={onDeleteClient}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsContent;
