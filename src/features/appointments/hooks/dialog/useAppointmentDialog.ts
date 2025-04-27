
import { useState, useEffect, useCallback } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { format, parse, addMinutes } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useStaffIdNormalization } from './useStaffIdNormalization';

export const useAppointmentDialog = (onClose: () => void) => {
  const { currentAppointment, addAppointment, updateAppointment, deleteAppointment, setCurrentAppointment, isSlotAvailable } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { normalizeStaffId } = useStaffIdNormalization();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Appointment> & { serviceEntries?: { serviceId?: string; staffId?: string }[] }>({
    title: '',
    clientName: '',
    clientPhone: '',
    service: '',
    notes: '',
    status: 'pending',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(), // +1 ora
    staffId: '',
    serviceEntries: [{ serviceId: '', staffId: '' }]
  });
  
  // Time state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60); // in minutes
  
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  
  // Initialize form from current appointment when it changes
  useEffect(() => {
    if (currentAppointment) {
      try {
        console.log("Initializing form from appointment:", currentAppointment);
        
        // Ensure we have valid dates
        const startDate = new Date(currentAppointment.start || new Date());
        const endDate = new Date(currentAppointment.end || new Date(startDate.getTime() + 60 * 60000));
        
        // Normalize staffId
        const normalizedStaffId = normalizeStaffId(currentAppointment.staffId);
        
        console.log("Appointment dialog - Original staffId:", currentAppointment.staffId);
        console.log("Appointment dialog - Normalized staffId:", normalizedStaffId);
        
        // Handle serviceEntries initialization
        let serviceEntries = currentAppointment.serviceEntries || [];
        
        // If no service entries but we have staffId and service, create a default entry
        if (serviceEntries.length === 0 && normalizedStaffId && currentAppointment.service) {
          serviceEntries = [{ 
            staffId: normalizedStaffId, 
            serviceId: currentAppointment.service 
          }];
          console.log("Created default service entry from staffId:", serviceEntries);
        }
        
        // Ensure we have at least one service entry
        if (serviceEntries.length === 0) {
          serviceEntries = [{ staffId: normalizedStaffId || '', serviceId: '' }];
          console.log("Created empty service entry", serviceEntries);
        }

        // Update form data
        setFormData({
          ...currentAppointment,
          staffId: normalizedStaffId,
          serviceEntries
        });
        
        // Set date and time fields
        setDate(startDate);
        setStartTime(format(startDate, 'HH:mm'));
        setEndTime(format(endDate, 'HH:mm'));
        
        // Calculate duration
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffMins = Math.round(diffMs / 60000);
        setDuration(diffMins);
      } catch (error) {
        console.error("Error initializing form from appointment:", error);
      }
    }
  }, [currentAppointment, normalizeStaffId]);
  
  // Update start and end times when date, startTime or duration changes
  useEffect(() => {
    if (date && startTime) {
      try {
        // Parse start time
        const parsedStartTime = parse(startTime, 'HH:mm', new Date());
        
        // Combine date with start time
        const startDateTime = new Date(date);
        startDateTime.setHours(parsedStartTime.getHours());
        startDateTime.setMinutes(parsedStartTime.getMinutes());
        
        // Calculate end time based on duration
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString()
        }));
        
        // Update endTime display
        setEndTime(format(endDateTime, 'HH:mm'));
      } catch (e) {
        console.error('Error parsing date/time:', e);
      }
    }
  }, [date, startTime, duration]);
  
  // Reset form to defaults for new appointments - ora preserva staffId e orari da slot
  const resetForm = useCallback(() => {
    console.log("Resetting appointment form, preserving staff and time if present");
    
    const now = new Date();
    
    // Usa la data/ora esistente se presente, altrimenti usa i valori predefiniti
    const defaultStart = currentAppointment?.start ? new Date(currentAppointment.start) : new Date(now);
    if (!currentAppointment?.start) {
      defaultStart.setHours(9, 0, 0, 0); // 9:00 AM solo se non c'è un currentAppointment.start
    }
    
    const defaultEnd = currentAppointment?.end ? new Date(currentAppointment.end) : addMinutes(defaultStart, 30);
    
    // Normalizza lo staffId dall'appuntamento corrente se presente
    const existingStaffId = currentAppointment?.staffId ? normalizeStaffId(currentAppointment.staffId) : '';
    
    console.log("Reset form using staffId:", existingStaffId);
    console.log("Reset form using startTime:", format(defaultStart, 'HH:mm'));
    
    setFormData({
      title: '',
      clientName: '',
      clientPhone: '',
      service: '',
      notes: '',
      status: 'pending',
      start: defaultStart.toISOString(),
      end: defaultEnd.toISOString(),
      staffId: existingStaffId,
      serviceEntries: [{ serviceId: '', staffId: existingStaffId }]
    });
    
    setDate(defaultStart);
    setStartTime(format(defaultStart, 'HH:mm'));
    setEndTime(format(defaultEnd, 'HH:mm'));
    setDuration(Math.round((defaultEnd.getTime() - defaultStart.getTime()) / 60000));
    setError(null);
  }, [currentAppointment, normalizeStaffId]);
  
  const handleDurationChange = (newDuration: string) => {
    const durationMinutes = parseInt(newDuration, 10);
    setDuration(durationMinutes);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} =`, value);
    
    if (name === 'clientName' && !value.trim()) {
      setError('Il nome del cliente è obbligatorio');
    } else {
      setError(null);
    }
    
    setFormData(prev => {
      if (name === 'serviceEntries') {
        return { ...prev, [name]: [...value] };
      }
      return { ...prev, [name]: value };
    });
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
      // Check if slot is available
      const isAvailable = isSlotAvailable(
        new Date(formData.start!), 
        new Date(formData.end!), 
        currentSalonId, 
        formData.id
      );
      
      if (!isAvailable) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      // Process service entries
      let serviceEntries = formData.serviceEntries || [];
      if (serviceEntries.length === 0 && formData.staffId && formData.service) {
        serviceEntries = [{ staffId: String(formData.staffId), serviceId: formData.service }];
      }
      
      // Ensure staffId is consistently formatted
      const appointmentData: Partial<Appointment> = {
        ...formData,
        title: formData.title || formData.service || 'Appuntamento',
        salonId: currentSalonId,
        staffId: formData.staffId,
        serviceEntries
      };
      
      console.log("Saving appointment with data:", appointmentData);
      
      if (formData.id) {
        // Update
        await updateAppointment(appointmentData as Appointment);
        toast({
          title: "Appuntamento aggiornato",
          description: "L'appuntamento è stato modificato con successo"
        });
      } else {
        // Create
        await addAppointment(appointmentData as Omit<Appointment, 'id'>);
        toast({
          title: "Appuntamento creato",
          description: "L'appuntamento è stato creato con successo"
        });
      }
      
      onClose();
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
      toast({
        title: "Appuntamento eliminato", 
        description: "L'appuntamento è stato eliminato con successo"
      });
      onClose();
      setCurrentAppointment(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return {
    formData,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    duration,
    error,
    isSubmitting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleInputChange,
    handleStatusChange,
    handleDurationChange,
    handleSubmit,
    handleDelete,
    resetForm
  };
};
