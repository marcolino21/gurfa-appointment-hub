
import { useEffect } from 'react';
import { parse } from 'date-fns';
import { Appointment } from '@/types';

export const useAppointmentTime = (
  date: Date | undefined,
  startTime: string,
  duration: number,
  setEndTime: (time: string) => void,
  setFormData: (data: Partial<Appointment>) => void
) => {
  useEffect(() => {
    if (date && startTime) {
      try {
        const parsedStartTime = parse(startTime, 'HH:mm', new Date());
        
        const startDateTime = new Date(date);
        startDateTime.setHours(parsedStartTime.getHours());
        startDateTime.setMinutes(parsedStartTime.getMinutes());
        
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
        
        setFormData(prev => ({
          ...prev,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString()
        }));
        
        setEndTime(format(endDateTime, 'HH:mm'));
      } catch (e) {
        console.error('Error parsing date/time:', e);
      }
    }
  }, [date, startTime, duration, setEndTime, setFormData]);
};
