
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle } from 'lucide-react';
import { Client } from '@/types/clients';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClientFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  availableClients: Client[];
  clientSearchTerm: string;
  setClientSearchTerm: (term: string) => void;
  handleSelectClient: (clientName: string) => void;
  filteredClients: Client[];
  error?: string | null;
}

export const ClientFields = ({
  formData,
  handleInputChange,
  availableClients,
  clientSearchTerm,
  setClientSearchTerm,
  handleSelectClient,
  filteredClients,
  error
}: ClientFieldsProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="font-medium">Nome Cliente *</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName || ''}
              onChange={(e) => {
                handleInputChange(e);
                setClientSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              placeholder="Cerca cliente..."
              className="pl-8"
              onFocus={() => setDropdownOpen(true)}
              autoComplete="off"
            />
            {clientSearchTerm && dropdownOpen && filteredClients.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                <ul className="py-1">
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        handleSelectClient(`${client.firstName} ${client.lastName}`);
                        setDropdownOpen(false);
                      }}
                    >
                      {client.firstName} {client.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientPhone" className="font-medium">Telefono</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone || ''}
            onChange={handleInputChange}
            placeholder="Numero di telefono"
            className="pl-3"
          />
        </div>
      </div>
    </div>
  );
};
