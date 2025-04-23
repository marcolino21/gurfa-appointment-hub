
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Appointment } from '@/types';

export const useUpdateAppointment = (
  dispatch: React.Dispatch<any>,
  isSlotAvailable: (start: Date, end: Date, salonId: string, excludeAppointmentId?: string) => boolean
) => {
  const { toast } = useToast();

  const updateAppointment = async (appointment: Appointment): Promise<Appointment> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isSlotAvailable(
        new Date(appointment.start), 
        new Date(appointment.end), 
        appointment.salonId, 
        appointment.id
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
      
      toast({
        title: 'Appuntamento aggiornato',
        description: `Appuntamento con ${appointment.clientName} aggiornato per il ${format(new Date(appointment.start), 'PPP', { locale: it })}`
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return appointment;
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

  return updateAppointment;
};
