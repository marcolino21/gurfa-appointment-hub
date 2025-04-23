
import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAppointmentForm } from './useAppointmentForm';
import { useAppointmentTime } from './useAppointmentTime';
import { useAppointmentSubmit } from './useAppointmentSubmit';
import { Appointment } from '@/types';

export const useAppointmentDialog = (onClose: () => void) => {
  const { currentAppointment, deleteAppointment, setCurrentAppointment } = useAppointments();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    setFormData,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    duration,
    setDuration
  } = useAppointmentForm(currentAppointment);

  useAppointmentTime(date, startTime, duration, setEndTime, setFormData);

  const { handleSubmit } = useAppointmentSubmit(onClose, setError, setIsSubmitting);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Appointment['status'] }));
  };
  
  const handleDurationChange = (newDuration: string) => {
    const durationMinutes = parseInt(newDuration, 10);
    setDuration(durationMinutes);
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
    handleSubmit: () => handleSubmit(formData),
    handleDelete
  };
};
