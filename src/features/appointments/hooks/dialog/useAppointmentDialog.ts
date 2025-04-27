
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAppointmentForm } from './useAppointmentForm';
import { useAppointmentTime } from './useAppointmentTime';
import { useAppointmentSubmit } from './useAppointmentSubmit';
import { useAppointmentDialogState } from './useAppointmentDialogState';
import { useAppointmentDelete } from './useAppointmentDelete';
import { useAppointmentFormHandlers } from './useAppointmentFormHandlers';

export const useAppointmentDialog = (onClose: () => void) => {
  const { currentAppointment } = useAppointments();
  const {
    error,
    setError,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isSubmitting,
    setIsSubmitting
  } = useAppointmentDialogState();
  
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
    setDuration,
    resetForm
  } = useAppointmentForm(currentAppointment);

  useAppointmentTime(date, startTime, duration, setEndTime, setFormData);

  const { handleSubmit } = useAppointmentSubmit(onClose, setError, setIsSubmitting);
  
  const { handleDelete } = useAppointmentDelete(
    onClose,
    setIsSubmitting,
    setShowDeleteConfirm,
    setError
  );

  const {
    handleInputChange,
    handleStatusChange,
    handleDurationChange
  } = useAppointmentFormHandlers({
    setFormData,
    setDuration,
    setError
  });

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
    handleDelete: () => handleDelete(formData.id),
    resetForm
  };
};
