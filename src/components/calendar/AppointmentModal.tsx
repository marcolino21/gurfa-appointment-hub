
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Appointment, AppointmentFormData } from '@/types/appointments';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/contexts/AuthContext';

// We'll use temporary mock data until we connect to real data
const MOCK_CLIENTS = [
  { id: 'client1', name: 'Mario Rossi' },
  { id: 'client2', name: 'Laura Bianchi' },
];

const MOCK_SERVICES = [
  { id: 'service1', name: 'Taglio', duration: 30, price: 25 },
  { id: 'service2', name: 'Colorazione', duration: 60, price: 50 },
];

const MOCK_STAFF = [
  { id: 'staff1', name: 'Carlo', color: '#3b82f6' },
  { id: 'staff2', name: 'Francesca', color: '#8b5cf6' },
];

const AppointmentModal = () => {
  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  const { isModalOpen, closeModal, selectedSlot, selectedAppointment } = useAppointmentStore();
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments(currentSalonId);

  // Form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'completed' | 'cancelled' | 'pending'>('pending');

  // Initialize form when modal opens or selected appointment changes
  useEffect(() => {
    if (selectedAppointment) {
      // Edit mode
      setTitle(selectedAppointment.title || '');
      setClientName(selectedAppointment.clientName || '');
      setService(selectedAppointment.serviceName || '');
      setStartTime(selectedAppointment.start_time || '');
      setEndTime(selectedAppointment.end_time || '');
      setNotes(selectedAppointment.notes || '');
      setStatus(selectedAppointment.status || 'pending');
    } else if (selectedSlot) {
      // Create mode with selected slot
      setTitle('');
      setClientName('');
      setService('');
      setStartTime(selectedSlot.start.toISOString());
      setEndTime(selectedSlot.end.toISOString());
      setNotes('');
      setStatus('pending');
    } else {
      // Default create mode
      setTitle('');
      setClientName('');
      setService('');
      setStartTime(new Date().toISOString());
      setEndTime(new Date(Date.now() + 30 * 60 * 1000).toISOString());
      setNotes('');
      setStatus('pending');
    }
  }, [selectedAppointment, selectedSlot, isModalOpen]);

  // Calculate end time when service changes
  useEffect(() => {
    if (service && startTime) {
      const selectedService = MOCK_SERVICES.find(s => s.id === service);
      if (selectedService) {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + selectedService.duration * 60 * 1000);
        setEndTime(end.toISOString());
      }
    }
  }, [service, startTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !clientName || !startTime || !endTime) {
      toast({
        title: 'Dati mancanti',
        description: 'Inserisci tutti i campi richiesti',
        variant: 'destructive',
      });
      return;
    }
    
    const appointmentData: AppointmentFormData & { title: string; client_name: string } = {
      title,
      client_name: clientName,
      service,
      start_time: startTime,
      end_time: endTime,
      notes,
      status,
      client_id: '', // In this simplified version we're not using these
      service_id: '',
      staff_id: '',
    };
    
    try {
      if (selectedAppointment) {
        await updateAppointment.mutateAsync({ 
          ...appointmentData, 
          id: selectedAppointment.id 
        });
      } else {
        await createAppointment.mutateAsync(appointmentData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    
    if (confirm('Sei sicuro di voler eliminare questo appuntamento?')) {
      try {
        await deleteAppointment.mutateAsync(selectedAppointment.id);
        closeModal();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedAppointment ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Titolo */}
          <div>
            <label className="block text-sm font-medium mb-1">Titolo</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo appuntamento"
            />
          </div>
          
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Input 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome cliente"
            />
          </div>
          
          {/* Servizio */}
          <div>
            <label className="block text-sm font-medium mb-1">Servizio</label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SERVICES.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - €{service.price} ({service.duration}min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data e ora inizio</label>
              <Input
                type="datetime-local"
                value={startTime ? new Date(startTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setStartTime(date.toISOString());
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data e ora fine</label>
              <Input
                type="datetime-local"
                value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEndTime(date.toISOString());
                }}
              />
            </div>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Stato</label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="confirmed">Confermato</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="cancelled">Annullato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note aggiuntive"
            />
          </div>
          
          <DialogFooter className="mt-4 gap-2">
            {selectedAppointment && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
              >
                Elimina
              </Button>
            )}
            <div className="flex-1"></div>
            <Button type="button" variant="outline" onClick={closeModal}>
              Annulla
            </Button>
            <Button type="submit">
              {selectedAppointment ? 'Aggiorna' : 'Crea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
