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
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AppointmentModal = () => {
  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  const activeSalonId = currentSalonId || 'sa1'; // Use sa1 consistently
  const { isModalOpen, closeModal, selectedSlot, selectedAppointment } = useAppointmentStore();
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments(activeSalonId);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'completed' | 'cancelled' | 'pending'>('pending');

  // Fetch services from Supabase
  const { data: services = [] } = useQuery({
    queryKey: ['services', activeSalonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('salon_id', activeSalonId);
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      return data;
    }
  });

  // Fetch staff from Supabase
  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff', activeSalonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('salon_id', activeSalonId);
      
      if (error) {
        console.error('Error fetching staff:', error);
        return [];
      }
      
      console.log("Staff data fetched in AppointmentModal:", data);
      return data;
    }
  });

  // Initialize form when modal opens or selected appointment changes
  useEffect(() => {
    if (selectedAppointment) {
      // Edit mode
      setClientName(selectedAppointment.client_name || '');
      setClientPhone(selectedAppointment.client_phone || '');
      setServiceId(selectedAppointment.service_id || '');
      setStaffId(selectedAppointment.staff_id || '');
      setStartTime(selectedAppointment.start_time || '');
      setEndTime(selectedAppointment.end_time || '');
      setNotes(selectedAppointment.notes || '');
      setStatus(selectedAppointment.status || 'pending');
    } else if (selectedSlot) {
      // Create mode with selected slot
      setClientName('');
      setClientPhone('');
      setServiceId('');
      setStaffId('');
      setStartTime(selectedSlot.start.toISOString());
      setEndTime(selectedSlot.end.toISOString());
      setNotes('');
      setStatus('pending');
    } else {
      // Default create mode
      setClientName('');
      setClientPhone('');
      setServiceId('');
      setStaffId('');
      setStartTime(new Date().toISOString());
      setEndTime(new Date(Date.now() + 30 * 60 * 1000).toISOString());
      setNotes('');
      setStatus('pending');
    }
  }, [selectedAppointment, selectedSlot, isModalOpen]);

  // Calculate end time when service changes
  useEffect(() => {
    if (serviceId && startTime) {
      const selectedService = services.find(s => s.id === serviceId);
      if (selectedService) {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + selectedService.duration * 60 * 1000);
        setEndTime(end.toISOString());
      }
    }
  }, [serviceId, startTime, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !startTime || !endTime) {
      toast({
        title: 'Dati mancanti',
        description: 'Inserisci tutti i campi richiesti',
        variant: 'destructive',
      });
      return;
    }
    
    const appointmentData: AppointmentFormData = {
      salon_id: activeSalonId,
      client_name: clientName,
      client_phone: clientPhone,
      service_id: serviceId,
      staff_id: staffId,
      start_time: startTime,
      end_time: endTime,
      notes,
      status,
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
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Input 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome cliente"
            />
          </div>
          
          {/* Telefono Cliente */}
          <div>
            <label className="block text-sm font-medium mb-1">Telefono</label>
            <Input 
              value={clientPhone} 
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Telefono cliente"
            />
          </div>
          
          {/* Servizio */}
          <div>
            <label className="block text-sm font-medium mb-1">Servizio</label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - €{service.price} ({service.duration}min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Staff */}
          <div>
            <label className="block text-sm font-medium mb-1">Staff</label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona staff" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
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
              onValueChange={(value) => setStatus(value as 'confirmed' | 'completed' | 'cancelled' | 'pending')}
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
