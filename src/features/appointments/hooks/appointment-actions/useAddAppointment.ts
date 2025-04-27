
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
      
      // Normalizzazione dello staffId
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
      
      console.log("Original staffId:", appointment.staffId);
      console.log("Processed staffId:", processedStaffId);
      
      const newAppointment: Appointment = {
        ...appointment,
        staffId: processedStaffId,
        id: `app_${Date.now()}`
      };
      
      // Verifica disponibilità dello slot
      if (!isSlotAvailable(
        new Date(appointment.start), 
        new Date(appointment.end), 
        appointment.salonId
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      console.log("Creazione nuovo appuntamento:", newAppointment);
      console.log("Staff assegnato:", processedStaffId);
      
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      
      // Assicuriamoci che sia aggiunto anche alla lista filtrata
      dispatch({ type: 'ADD_TO_FILTERED_APPOINTMENTS', payload: newAppointment });
      
      // Messaggio di conferma migliorato
      const formattedDate = format(new Date(newAppointment.start), 'EEEE d MMMM yyyy', { locale: it });
      const formattedTime = format(new Date(newAppointment.start), 'HH:mm', { locale: it });
      const staffInfo = processedStaffId ? ` con operatore assegnato` : '';
      
      toast({
        title: 'Appuntamento creato con successo',
        description: `Appuntamento con ${newAppointment.clientName} aggiunto per ${formattedDate} alle ${formattedTime}${staffInfo}`,
        duration: 5000
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return newAppointment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore nella creazione dell\'appuntamento',
        description: error.message,
        duration: 5000
      });
      throw error;
    }
  };

  return addAppointment;
};
