
import { Appointment } from '@/types';
import { ChangeEvent } from 'react';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

interface FormHandlersProps {
  setFormData: (data: (prev: Partial<Appointment> & { serviceEntries?: ServiceEntry[] }) => Partial<Appointment> & { serviceEntries?: ServiceEntry[] }) => void;
  setDuration: (duration: number) => void;
  setError: (error: string | null) => void;
}

export const useAppointmentFormHandlers = ({ setFormData, setDuration, setError }: FormHandlersProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    
    console.log(`Input changed: ${name} = `, value);
    
    if (name === 'clientName' && !value.trim()) {
      setError('Il nome del cliente è obbligatorio');
    } else {
      setError(null);
    }
    
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
    console.log("Status changed:", value);
    setFormData(prev => ({ ...prev, status: value as Appointment['status'] }));
  };
  
  const handleDurationChange = (newDuration: string) => {
    const durationMinutes = parseInt(newDuration, 10);
    console.log("Duration changed to:", durationMinutes);
    setDuration(durationMinutes);
  };

  return {
    handleInputChange,
    handleStatusChange,
    handleDurationChange
  };
};
