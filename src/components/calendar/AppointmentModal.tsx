
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAppointments } from '@/hooks/useAppointments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, addHours } from 'date-fns';
import { AppointmentFormData } from '@/types/appointments';

const AppointmentModal = () => {
  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  const activeSalonId = currentSalonId || 'sa1'; // Use sa1 consistently
  const { isModalOpen, closeModal, selectedSlot, selectedAppointment } = useAppointmentStore();
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments(activeSalonId);

  const isEditing = !!selectedAppointment;

  // Form state with proper type for status
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_name: '',
    client_phone: '',
    service_id: '',
    staff_id: '',
    start_time: '',
    end_time: '',
    notes: '',
    status: 'pending',
    salon_id: activeSalonId,
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ['services', activeSalonId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('salon_id', activeSalonId);

        if (error) {
          console.error('Error fetching services:', error);
          return [];
        }
        return data;
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    }
  });

  // Fetch staff members
  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff', activeSalonId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('salon_id', activeSalonId)
          .eq('is_active', true)
          .eq('show_in_calendar', true);

        if (error) {
          console.error('Error fetching staff:', error);
          return [];
        }
        
        console.log("Staff data fetched in AppointmentModal:", data);
        return data;
      } catch (error) {
        console.error('Unexpected error fetching staff:', error);
        return [];
      }
    }
  });

  // Set initial form data based on selected slot or appointment
  useEffect(() => {
    if (isModalOpen) {
      if (selectedAppointment) {
        // Editing existing appointment
        console.log("Editing appointment:", selectedAppointment);
        setFormData({
          client_name: selectedAppointment.client_name || '',
          client_phone: selectedAppointment.client_phone || '',
          service_id: selectedAppointment.service_id || '',
          staff_id: selectedAppointment.staff_id || '',
          start_time: format(new Date(selectedAppointment.start_time), "yyyy-MM-dd'T'HH:mm"),
          end_time: format(new Date(selectedAppointment.end_time), "yyyy-MM-dd'T'HH:mm"),
          notes: selectedAppointment.notes || '',
          status: (selectedAppointment.status as "confirmed" | "completed" | "cancelled" | "pending") || 'pending',
          salon_id: activeSalonId,
        });
      } else if (selectedSlot) {
        // Creating new appointment
        console.log("Creating new appointment with slot:", selectedSlot);
        setFormData({
          client_name: '',
          client_phone: '',
          service_id: '',
          staff_id: '',
          start_time: format(selectedSlot.start, "yyyy-MM-dd'T'HH:mm"),
          end_time: format(selectedSlot.end || addHours(selectedSlot.start, 1), "yyyy-MM-dd'T'HH:mm"),
          notes: '',
          status: 'pending',
          salon_id: activeSalonId,
        });
      }
    }
  }, [isModalOpen, selectedAppointment, selectedSlot, activeSalonId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // For the status field, ensure we only accept valid values
    if (name === 'status') {
      const validStatus = value as "confirmed" | "completed" | "cancelled" | "pending";
      setFormData(prev => ({ ...prev, [name]: validStatus }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedAppointment) {
        await updateAppointment.mutateAsync({
          id: selectedAppointment.id,
          ...formData,
        });
        toast({
          title: "Appuntamento aggiornato",
          description: "L'appuntamento è stato aggiornato con successo",
        });
      } else {
        await createAppointment.mutateAsync(formData);
        toast({
          title: "Appuntamento creato",
          description: "L'appuntamento è stato creato con successo",
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dell'appuntamento",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await deleteAppointment.mutateAsync(selectedAppointment.id);
      toast({
        title: "Appuntamento eliminato",
        description: "L'appuntamento è stato eliminato con successo",
      });
      closeModal();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'appuntamento",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica appuntamento" : "Nuovo appuntamento"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Cliente *</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Nome cliente"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client_phone">Telefono</Label>
              <Input
                id="client_phone"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleChange}
                placeholder="Telefono"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service">Servizio</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => handleSelectChange('service_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona servizio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff">Staff</Label>
              <Select
                value={formData.staff_id}
                onValueChange={(value) => handleSelectChange('staff_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona membro" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.first_name} {staff.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Data e ora inizio *</Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_time">Data e ora fine *</Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Stato</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "confirmed" | "completed" | "cancelled" | "pending") => handleSelectChange('status', value)}
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Note aggiuntive"
              className="h-20"
            />
          </div>
          
          <DialogFooter className="mt-4">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={handleDelete}
              >
                Elimina
              </Button>
            )}
            <Button type="button" variant="outline" onClick={closeModal}>
              Annulla
            </Button>
            <Button type="submit">
              {isEditing ? "Salva modifiche" : "Crea appuntamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
