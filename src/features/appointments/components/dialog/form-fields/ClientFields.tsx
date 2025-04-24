
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Client } from '@/types/clients';
import { useState, useEffect } from 'react';

interface ClientFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  availableClients: Client[];
  clientSearchTerm: string;
  setClientSearchTerm: (term: string) => void;
  openClientCombobox: boolean;
  setOpenClientCombobox: (open: boolean) => void;
  handleSelectClient: (clientName: string) => void;
  filteredClients: Client[];
}

export const ClientFields = ({
  formData,
  handleInputChange,
  availableClients,
  clientSearchTerm,
  setClientSearchTerm,
  openClientCombobox,
  setOpenClientCombobox,
  handleSelectClient,
  filteredClients
}: ClientFieldsProps) => {

  // Debug log to see available clients
  useEffect(() => {
    console.log("Available clients:", availableClients);
    console.log("Filtered clients:", filteredClients);
  }, [availableClients, filteredClients]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome Cliente *</Label>
        <Popover 
          open={openClientCombobox} 
          onOpenChange={setOpenClientCombobox}
        >
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName || ''}
                onChange={(e) => {
                  handleInputChange(e);
                  setClientSearchTerm(e.target.value);
                  // Always open dropdown when typing
                  if (e.target.value) {
                    setOpenClientCombobox(true);
                  }
                }}
                placeholder="Cerca cliente..."
                className="pl-8"
                onClick={() => setOpenClientCombobox(true)}
                autoComplete="off"
                required
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>Nessun cliente trovato</CommandEmpty>
                <CommandGroup>
                  {filteredClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={`${client.firstName} ${client.lastName}`}
                      onSelect={(value) => {
                        handleSelectClient(value);
                        setOpenClientCombobox(false);
                      }}
                      className="cursor-pointer"
                    >
                      {client.firstName} {client.lastName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientPhone">Telefono</Label>
        <Input
          id="clientPhone"
          name="clientPhone"
          value={formData.clientPhone || ''}
          onChange={handleInputChange}
          placeholder="Numero di telefono"
        />
      </div>
    </div>
  );
};
