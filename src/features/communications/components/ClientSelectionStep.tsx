
import React, { useState } from 'react';
import { useClientsData } from '@/features/clients/hooks/useClientsData';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserRound, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientSelectionStepProps {
  selectedClients: string[];
  onSelectClients: (clients: string[]) => void;
  communicationType: 'email' | 'sms' | 'whatsapp';
}

const ClientSelectionStep: React.FC<ClientSelectionStepProps> = ({
  selectedClients,
  onSelectClients,
  communicationType
}) => {
  const { clients } = useClientsData();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clients based on communication type and search term
  const filteredClients = clients.filter(client => {
    const nameMatch = `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter based on available contact information
    if (communicationType === 'email') {
      return nameMatch && client.email;
    } else if (communicationType === 'sms' || communicationType === 'whatsapp') {
      return nameMatch && client.phone;
    }
    
    return nameMatch;
  });

  const handleToggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      onSelectClients(selectedClients.filter(id => id !== clientId));
    } else {
      onSelectClients([...selectedClients, clientId]);
    }
  };

  const handleSelectAll = () => {
    onSelectClients(filteredClients.map(client => client.id));
  };

  const handleDeselectAll = () => {
    onSelectClients([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="px-2">
          {selectedClients.length} clienti selezionati
        </Badge>
        
        <div className="flex ml-auto space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeselectAll}
            disabled={selectedClients.length === 0}
          >
            Deseleziona tutti
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
            disabled={filteredClients.length === 0 || filteredClients.length === selectedClients.length}
          >
            Seleziona tutti
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca cliente..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[400px] border rounded-md p-2">
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <UserRound className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Nessun cliente trovato con questi criteri di ricerca." 
                : `Nessun cliente trovato con ${communicationType === 'email' ? 'email' : 'numero di telefono'}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredClients.map((client) => (
              <div 
                key={client.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => handleToggleClient(client.id)}
              >
                <Checkbox 
                  id={`client-${client.id}`} 
                  checked={selectedClients.includes(client.id)}
                  onCheckedChange={() => handleToggleClient(client.id)}
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`client-${client.id}`}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{client.firstName} {client.lastName}</div>
                      <div className="text-sm text-muted-foreground">
                        {communicationType === 'email' ? client.email : client.phone}
                      </div>
                    </div>
                    {selectedClients.includes(client.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ClientSelectionStep;
