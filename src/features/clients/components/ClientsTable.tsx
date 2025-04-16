
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Client } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import CreateProjectButton from '@/features/projects/components/CreateProjectButton';

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Genere</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length > 0 ? (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                {client.firstName} {client.lastName}
              </TableCell>
              <TableCell>{client.phone || '-'}</TableCell>
              <TableCell>{client.email || '-'}</TableCell>
              <TableCell>{client.gender}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CreateProjectButton clientId={client.id} />
                  <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Nessun cliente disponibile
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
