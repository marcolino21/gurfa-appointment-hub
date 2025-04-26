
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

  useEffect(() => {
    console.log("ClientFields - filteredClients count:", filteredClients.length);
    console.log("Available clients:", availableClients.length);
  }, [filteredClients, availableClients]);

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

  const selectClient = (client: Client, event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const fullName = `${client.firstName} ${client.lastName}`;
    console.log("Selecting client:", fullName);
    
    // Direttamente aggiorna il formData nel genitore
    handleSelectClient(fullName);
    
    // Chiudi il dropdown
    setDropdownOpen(false);
    
    // Auto-compila il telefono se disponibile
    if (client.phone) {
      console.log("Auto-filling phone:", client.phone);
      handleInputChange({
        target: { name: 'clientPhone', value: client.phone }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    
    // Focus sull'input dopo un breve ritardo
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent, client: Client) => {
    if (e.key === 'Enter' || e.key === ' ') {
      selectClient(client, e);
    }
  };

  // Ensure there's always at least one dummy client if no clients are available
  const displayedClients = filteredClients.length > 0 ? filteredClients : [
    { id: 'dummy-1', firstName: 'Cliente', lastName: 'Di Prova', phone: '3331234567', gender: 'M' as 'M', isPrivate: true, salonId: 'dummy' }
  ];

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
                if (e.target.value) {
                  setDropdownOpen(true);
                }
              }}
              placeholder="Cerca cliente..."
              className="pl-8 bg-white"
              onFocus={() => setDropdownOpen(true)}
              autoComplete="off"
              aria-expanded={dropdownOpen}
            />
            {dropdownOpen && displayedClients.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <ul className="py-1">
                  {displayedClients.map((client) => {
                    const fullName = `${client.firstName} ${client.lastName}`;
                    return (
                      <li
                        key={client.id}
                        className="px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center"
                        onClick={(e) => selectClient(client, e)}
                        onKeyDown={(e) => handleKeyDown(e, client)}
                        tabIndex={0}
                        role="option"
                        aria-selected={formData.clientName === fullName}
                      >
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        {fullName}
                      </li>
                    );
                  })}
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
