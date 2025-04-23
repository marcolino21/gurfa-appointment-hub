
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Appointment } from '@/types';
import { useAppointmentFormState } from './useAppointmentFormState';
import { useStaffIdNormalization } from './useStaffIdNormalization';

export const useAppointmentForm = (currentAppointment: Appointment | null) => {
  const formState = useAppointmentFormState();
  const { normalizeStaffId } = useStaffIdNormalization();
  
  useEffect(() => {
    if (currentAppointment) {
      const startDate = new Date(currentAppointment.start);
      const endDate = new Date(currentAppointment.end);
      
      const normalizedStaffId = normalizeStaffId(currentAppointment.staffId);
      
      formState.setFormData({
        ...currentAppointment,
        staffId: normalizedStaffId
      });
      
      formState.setDate(startDate);
      formState.setStartTime(format(startDate, 'HH:mm'));
      formState.setEndTime(format(endDate, 'HH:mm'));
      
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      formState.setDuration(diffMins);
    }
  }, [currentAppointment]);

  return {
    ...formState
  };
};
