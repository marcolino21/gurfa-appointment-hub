
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { it } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ open, onOpenChange }) => {
  const { currentAppointment, addAppointment, updateAppointment, deleteAppointment, setCurrentAppointment, isSlotAvailable } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: '',
    clientName: '',
    clientPhone: '',
    service: '',
    notes: '',
    status: 'pending',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString() // +1 ora
  });
  
  // Time state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60); // in minutes
  
  const { currentSalonId } = useAuth();
  
  useEffect(() => {
    if (currentAppointment) {
      const startDate = new Date(currentAppointment.start);
      const endDate = new Date(currentAppointment.end);
      
      setFormData({
        ...currentAppointment
      });
      
      setDate(startDate);
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(endDate, 'HH:mm'));
      
      // Calcola la durata in minuti
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      setDuration(diffMins);
    }
  }, [currentAppointment]);
  
  useEffect(() => {
    if (date && startTime) {
      try {
        // Parse del tempo di inizio
        const parsedStartTime = parse(startTime, 'HH:mm', new Date());
        
        // Combina la data con l'orario di inizio
        const startDateTime = new Date(date);
        startDateTime.setHours(parsedStartTime.getHours());
        startDateTime.setMinutes(parsedStartTime.getMinutes());
        
        // Calcola l'orario di fine in base alla durata
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
        
        // Aggiorna il form data
        setFormData(prev => ({
          ...prev,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString()
        }));
        
        // Aggiorna anche il campo endTime per la visualizzazione
        setEndTime(format(endDateTime, 'HH:mm'));
      } catch (e) {
        console.error('Errore nel parsing della data/ora:', e);
      }
    }
  }, [date, startTime, duration]);
  
  const handleDurationChange = (newDuration: string) => {
    const durationMinutes = parseInt(newDuration, 10);
    setDuration(durationMinutes);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Appointment['status'] }));
  };
  
  const handleSubmit = async () => {
    if (!formData.clientName || !formData.start || !formData.end || !currentSalonId) {
      setError('Compila tutti i campi richiesti');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Verifica se lo slot è disponibile
      const isAvailable = isSlotAvailable(
        new Date(formData.start!), 
        new Date(formData.end!), 
        currentSalonId, 
        formData.id
      );
      
      if (!isAvailable) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      const appointmentData: Partial<Appointment> = {
        ...formData,
        title: formData.title || formData.service || 'Appuntamento',
        salonId: currentSalonId
      };
      
      if (formData.id) {
        // Aggiornamento
        await updateAppointment(appointmentData as Appointment);
      } else {
        // Creazione
        await addAppointment(appointmentData as Omit<Appointment, 'id'>);
      }
      
      onOpenChange(false);
      setCurrentAppointment(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!formData.id) return;
    
    setIsSubmitting(true);
    try {
      await deleteAppointment(formData.id);
      onOpenChange(false);
      setCurrentAppointment(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setCurrentAppointment(null);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px] appointment-form">
        <DialogHeader>
          <DialogTitle>
            {formData.id ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
          </DialogTitle>
        </DialogHeader>
        
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
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName || ''}
                onChange={handleInputChange}
                placeholder="Nome e cognome"
                required
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
        
        {showDeleteConfirm ? (
          <DialogFooter>
            <div className="w-full p-4 bg-red-50 rounded-md mb-4">
              <p className="text-red-600 font-semibold mb-2">Conferma eliminazione</p>
              <p className="text-sm text-red-600 mb-4">Sei sicuro di voler eliminare questo appuntamento? Questa azione non può essere annullata.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Annulla</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                  {isSubmitting ? 'Eliminazione...' : 'Elimina'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex justify-between">
            <div>
              {formData.id && (
                <Button variant="outline" onClick={() => setShowDeleteConfirm(true)}>
                  Elimina
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Annulla</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Salvataggio...' : formData.id ? 'Aggiorna' : 'Crea'}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
