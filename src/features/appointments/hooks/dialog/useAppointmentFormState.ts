
import { useState } from 'react';
import { Appointment } from '@/types';

interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

export const useAppointmentFormState = () => {
  const [formData, setFormData] = useState<Partial<Appointment> & { serviceEntries?: ServiceEntry[] }>({
    title: '',
    clientName: '',
    clientPhone: '',
    service: '',
    notes: '',
    status: 'pending',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    staffId: '',
    serviceEntries: [{ serviceId: '', staffId: '' }]
  });

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60);

  return {
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
  };
};
