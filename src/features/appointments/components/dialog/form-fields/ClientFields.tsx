
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, User } from 'lucide-react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gestione del click fuori dal dropdown per chiuderlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug per la selezione del cliente
  useEffect(() => {
    console.log("ClientFields - formData.clientName:", formData.clientName);
    console.log("ClientFields - availableClients:", availableClients.length);
    console.log("ClientFields - filteredClients:", filteredClients.length);
  }, [formData.clientName, availableClients, filteredClients]);

  return (
    <div className="space-y-4">
      <div className="font-medium text-lg text-gray-800 mb-3 border-b pb-2">Informazioni Cliente</div>
      
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-700" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="font-medium text-gray-700">Nome Cliente *</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            <Input
              ref={inputRef}
              id="clientName"
              name="clientName"
              value={formData.clientName || ''}
              onChange={(e) => {
                handleInputChange(e);
                setClientSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              placeholder="Cerca cliente..."
              className="pl-8 bg-white"
              onFocus={() => setDropdownOpen(true)}
              autoComplete="off"
            />
            {dropdownOpen && filteredClients.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <ul className="py-1">
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center"
                      onClick={() => {
                        handleSelectClient(`${client.firstName} ${client.lastName}`);
                        setDropdownOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      {client.firstName} {client.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientPhone" className="font-medium text-gray-700">Telefono</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone || ''}
            onChange={handleInputChange}
            placeholder="Numero di telefono"
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};
