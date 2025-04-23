
import { useAppointments } from '@/contexts/AppointmentContext';

export const useAppointmentDelete = (
  onClose: () => void,
  setIsSubmitting: (value: boolean) => void,
  setShowDeleteConfirm: (value: boolean) => void,
  setError: (error: string | null) => void
) => {
  const { deleteAppointment, setCurrentAppointment } = useAppointments();

  const handleDelete = async (appointmentId?: string) => {
    if (!appointmentId) return;
    
    setIsSubmitting(true);
    try {
      await deleteAppointment(appointmentId);
      onClose();
      setCurrentAppointment(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return { handleDelete };
};
