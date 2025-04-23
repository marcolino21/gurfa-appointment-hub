
import { useState, useEffect } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { format, parse } from 'date-fns';

export const useAppointmentDialog = (onClose: () => void) => {
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
    end: new Date(Date.now() + 3600000).toISOString(), // +1 ora
    staffId: ''
  });
  
  // Time state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60); // in minutes
  
  const { currentSalonId } = useAuth();
  
  // Helper function to normalize staffId
  const normalizeStaffId = (rawStaffId: any): string | undefined => {
    if (rawStaffId === null || rawStaffId === undefined) {
      return undefined;
    }
    
    if (typeof rawStaffId === 'object' && rawStaffId !== null && 'value' in rawStaffId) {
      return rawStaffId.value === 'undefined' ? undefined : String(rawStaffId.value);
    }
    
    return String(rawStaffId);
  };
  
  useEffect(() => {
    if (currentAppointment) {
      const startDate = new Date(currentAppointment.start);
      const endDate = new Date(currentAppointment.end);
      
      // Normalize staffId
      const normalizedStaffId = normalizeStaffId(currentAppointment.staffId);
      
      console.log("Appointment dialog - Original staffId:", currentAppointment.staffId);
      console.log("Appointment dialog - Normalized staffId:", normalizedStaffId);

      setFormData({
        ...currentAppointment,
        staffId: normalizedStaffId
      });
      
      setDate(startDate);
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(endDate, 'HH:mm'));
      
      // Calculate duration in minutes
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      setDuration(diffMins);
    }
  }, [currentAppointment]);
  
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
      
      // Ensure staffId is a plain string value before saving
      const appointmentData: Partial<Appointment> = {
        ...formData,
        title: formData.title || formData.service || 'Appuntamento',
        salonId: currentSalonId,
        staffId: formData.staffId // This should already be normalized
      };
      
      console.log("Saving appointment with staffId:", appointmentData.staffId);
      
      if (formData.id) {
        // Update
        await updateAppointment(appointmentData as Appointment);
      } else {
        // Create
        await addAppointment(appointmentData as Omit<Appointment, 'id'>);
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
    handleDelete
  };
};
