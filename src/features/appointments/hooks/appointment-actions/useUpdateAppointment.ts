
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
      
      // Normalizza staffId se necessario
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
      
      // Crea una versione aggiornata con staffId normalizzato
      const updatedAppointment: Appointment = {
        ...appointment,
        staffId: processedStaffId
      };
      
      if (!isSlotAvailable(
        new Date(updatedAppointment.start), 
        new Date(updatedAppointment.end), 
        updatedAppointment.salonId, 
        updatedAppointment.id
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      console.log("Aggiornamento appuntamento:", updatedAppointment);
      console.log("Staff assegnato:", processedStaffId);
      
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      
      // Messaggio di conferma migliorato
      const formattedDate = format(new Date(updatedAppointment.start), 'EEEE d MMMM yyyy', { locale: it });
      const formattedTime = format(new Date(updatedAppointment.start), 'HH:mm', { locale: it });
      const staffInfo = processedStaffId ? ` con operatore assegnato` : '';
      
      toast({
        title: 'Appuntamento aggiornato con successo',
        description: `Appuntamento con ${updatedAppointment.clientName} aggiornato per ${formattedDate} alle ${formattedTime}${staffInfo}`,
        duration: 5000
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return updatedAppointment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore nell\'aggiornamento',
        description: error.message,
        duration: 5000
      });
      throw error;
    }
  };

  return updateAppointment;
};
