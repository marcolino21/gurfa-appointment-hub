
import { Appointment } from '@/types';
import { ChangeEvent } from 'react';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

interface FormHandlersProps {
  setFormData: (data: (prev: Partial<Appointment> & { serviceEntries?: ServiceEntry[] }) => Partial<Appointment> & { serviceEntries?: ServiceEntry[] }) => void;
  setDuration: (duration: number) => void;
}

export const useAppointmentFormHandlers = ({ setFormData, setDuration }: FormHandlersProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    
    console.log(`Input changed: ${name} = `, value);
    
    setFormData(prev => {
      if (name === 'serviceEntries') {
        return { 
          ...prev, 
          [name]: [...value]
        };
      }
      
      return { ...prev, [name]: value };
    });
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
