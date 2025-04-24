
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
      console.log("Setting up form with appointment:", currentAppointment);
      console.log("Normalized staffId:", normalizedStaffId);
      
      // Create serviceEntries from staffId and service if not present
      let serviceEntries = currentAppointment.serviceEntries || [];
      if (serviceEntries.length === 0 && normalizedStaffId && currentAppointment.service) {
        serviceEntries = [{ 
          staffId: normalizedStaffId, 
          serviceId: currentAppointment.service
        }];
        console.log("Created default service entry from staffId:", serviceEntries);
      }
      
      formState.setFormData({
        ...currentAppointment,
        staffId: normalizedStaffId,
        serviceEntries
      });
      
      formState.setDate(startDate);
      formState.setStartTime(format(startDate, 'HH:mm'));
      formState.setEndTime(format(endDate, 'HH:mm'));
      
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      formState.setDuration(diffMins);
    }
  }, [currentAppointment, formState, normalizeStaffId]);

  return {
    ...formState
  };
};
