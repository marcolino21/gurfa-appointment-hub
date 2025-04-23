
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Appointment } from '@/types';

export const useAddAppointment = (
  dispatch: React.Dispatch<any>, 
  isSlotAvailable: (start: Date, end: Date, salonId: string) => boolean
) => {
  const { toast } = useToast();

  const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let processedStaffId: string | undefined = undefined;
      
      if (appointment.staffId) {
        if (typeof appointment.staffId === 'string') {
          processedStaffId = appointment.staffId;
        } else if (typeof appointment.staffId === 'object' && appointment.staffId !== null) {
          if ('value' in appointment.staffId) {
            const value = appointment.staffId.value;
            processedStaffId = value === 'undefined' ? undefined : String(value);
          }
        }
      }
      
      const newAppointment: Appointment = {
        ...appointment,
        staffId: processedStaffId,
        id: `app_${Date.now()}`
      };
      
      if (!isSlotAvailable(
        new Date(appointment.start), 
        new Date(appointment.end), 
        appointment.salonId
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      dispatch({ type: 'ADD_TO_FILTERED_APPOINTMENTS', payload: newAppointment });
      
      toast({
        title: 'Appuntamento creato',
        description: `Appuntamento con ${newAppointment.clientName} aggiunto per il ${format(new Date(newAppointment.start), 'PPP', { locale: it })}`
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return newAppointment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      throw error;
    }
  };

  return addAppointment;
};
