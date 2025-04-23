
import { Appointment } from '@/types';
import { ChangeEvent } from 'react';

interface FormHandlersProps {
  setFormData: (data: (prev: Partial<Appointment>) => Partial<Appointment>) => void;
  setDuration: (duration: number) => void;
}

export const useAppointmentFormHandlers = ({ setFormData, setDuration }: FormHandlersProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return {
    handleInputChange,
    handleStatusChange,
    handleDurationChange
  };
};
