
import { useState, useEffect } from 'react';
import { Appointment } from '@/types';
import { format } from 'date-fns';

export const useAppointmentForm = (currentAppointment: Appointment | null) => {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: '',
    clientName: '',
    clientPhone: '',
    service: '',
    notes: '',
    status: 'pending',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    staffId: ''
  });

  // Time state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    if (currentAppointment) {
      const startDate = new Date(currentAppointment.start);
      const endDate = new Date(currentAppointment.end);
      
      const normalizedStaffId = normalizeStaffId(currentAppointment.staffId);
      
      setFormData({
        ...currentAppointment,
        staffId: normalizedStaffId
      });
      
      setDate(startDate);
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(endDate, 'HH:mm'));
      
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      setDuration(diffMins);
    }
  }, [currentAppointment]);

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
