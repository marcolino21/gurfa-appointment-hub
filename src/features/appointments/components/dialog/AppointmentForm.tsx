
import React, { useState, useEffect } from 'react';
import { Appointment } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStaffAppointments } from '../../hooks/useStaffAppointments';
import { MOCK_CLIENTS } from '@/data/mock/clients';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface AppointmentFormProps {
  formData: Partial<Appointment>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDurationChange: (value: string) => void;
  error: string | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  formData,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  handleInputChange,
  handleStatusChange,
  handleDurationChange,
  error
}) => {
  const { visibleStaff } = useStaffAppointments();
  const { currentSalonId } = useAuth();
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [openClientCombobox, setOpenClientCombobox] = useState(false);

  useEffect(() => {
    if (currentSalonId) {
      // Filter clients by salon ID
      const salonClients = MOCK_CLIENTS[currentSalonId] || [];
      setAvailableClients(salonClients);
    }
  }, [currentSalonId]);
  
  const filteredClients = clientSearchTerm === ''
    ? availableClients
    : availableClients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(clientSearchTerm.toLowerCase());
      });

  const handleSelectClient = (clientName: string) => {
    handleInputChange({
      target: { name: 'clientName', value: clientName }
    } as React.ChangeEvent<HTMLInputElement>);
    setOpenClientCombobox(false);
    
    // Find the selected client to get their phone
    const selectedClient = availableClients.find(client => 
      `${client.firstName} ${client.lastName}` === clientName
    );
    
    if (selectedClient?.phone) {
      handleInputChange({
        target: { name: 'clientPhone', value: selectedClient.phone }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };
  
  const durations = [
    { label: '15 minuti', value: '15' },
    { label: '30 minuti', value: '30' },
    { label: '45 minuti', value: '45' },
    { label: '1 ora', value: '60' },
    { label: '1.5 ore', value: '90' },
    { label: '2 ore', value: '120' }
  ];

  return (
    <div className="grid gap-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome Cliente *</Label>
          <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
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
                  }}
                  placeholder="Cerca cliente..."
                  className="pl-8"
                  onClick={() => setOpenClientCombobox(true)}
                  autoComplete="off"
                  required
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>Nessun cliente trovato</CommandEmpty>
                  <CommandGroup>
                    {filteredClients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={`${client.firstName} ${client.lastName}`}
                        onSelect={handleSelectClient}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service">Servizio *</Label>
          <Input
            id="service"
            name="service"
            value={formData.service || ''}
            onChange={handleInputChange}
            placeholder="Tipo di servizio"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="staffId">Operatore</Label>
          <Select 
            value={formData.staffId ? String(formData.staffId) : ''} 
            onValueChange={(value) => {
              handleInputChange({
                target: { name: 'staffId', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona operatore" />
            </SelectTrigger>
            <SelectContent>
              {visibleStaff.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.firstName} {staff.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: it }) : <span>Seleziona data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Stato</Label>
          <Select 
            value={formData.status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">In attesa</SelectItem>
              <SelectItem value="confirmed">Confermato</SelectItem>
              <SelectItem value="completed">Completato</SelectItem>
              <SelectItem value="cancelled">Cancellato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Ora inizio *</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona ora" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeOptions().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Durata *</Label>
          <Select value={duration.toString()} onValueChange={handleDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Durata" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Note</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleInputChange}
          placeholder="Note aggiuntive"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AppointmentForm;
