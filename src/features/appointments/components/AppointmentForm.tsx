
import React from 'react';
import { useStaffAppointments } from '../hooks/useStaffAppointments';
import { useDefaultResources } from '../hooks/dialog/useDefaultResources';
import { useAppointmentClients } from '../hooks/dialog/useAppointmentClients';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface AppointmentFormProps {
  formData: any;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  duration: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDurationChange: (value: string) => void;
  error: string | null;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
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
  // Caricamento dello staff e dei servizi
  const { visibleStaff, refreshVisibleStaff } = useStaffAppointments();
  const { displayedStaff, displayedServices, isLoaded: resourcesLoaded, refreshResources } = useDefaultResources(visibleStaff, []);
  const { availableClients, isLoaded: clientsLoaded, refreshClients } = useAppointmentClients();
  
  // Forza il caricamento dei dati se necessario
  React.useEffect(() => {
    if (!resourcesLoaded || !clientsLoaded) {
      console.log("Forcing data load for appointment form");
      refreshVisibleStaff();
      refreshResources();
      refreshClients();
    }
  }, [resourcesLoaded, clientsLoaded, refreshVisibleStaff, refreshResources, refreshClients]);
  
  // Stato di caricamento complessivo
  const isLoading = !resourcesLoaded || !clientsLoaded;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Caricamento dati in corso...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 py-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome cliente</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName || ''}
            onChange={handleInputChange}
            placeholder="Nome del cliente"
          />
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
      
      <div className="space-y-2">
        <Label htmlFor="service">Servizio</Label>
        <Input
          id="service"
          name="service"
          value={formData.service || ''}
          onChange={handleInputChange}
          placeholder="Nome del servizio"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'd MMMM yyyy', { locale: it }) : 'Seleziona data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Ora</Label>
          <Input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Durata (minuti)</Label>
          <Select value={duration.toString()} onValueChange={handleDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Durata" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minuti</SelectItem>
              <SelectItem value="30">30 minuti</SelectItem>
              <SelectItem value="45">45 minuti</SelectItem>
              <SelectItem value="60">1 ora</SelectItem>
              <SelectItem value="90">1 ora e 30</SelectItem>
              <SelectItem value="120">2 ore</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Stato</Label>
          <Select
            value={formData.status || 'pending'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stato" />
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

      <div className="space-y-2">
        <Label htmlFor="staffId">Operatore</Label>
        <Select
          value={(formData.staffId || '')}
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
            {displayedStaff.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.firstName} {staff.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
