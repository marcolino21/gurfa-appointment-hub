
import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useAppointmentHandlers = (visibleStaff: StaffMember[]) => {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'>('timeGridWeek');
  const { toast } = useToast();
  
  const { 
    filteredAppointments, 
    currentAppointment,
    setCurrentAppointment
  } = useAppointments();
  
  const { currentSalonId } = useAuth();
  
  const handleDateSelect = (selectInfo: any) => {
    if (currentSalonId) {
      // If it's a view with staff, determine staffId
      let staffId = undefined;
      
      if (selectInfo.resource) {
        staffId = selectInfo.resource.id;
      }
      
      const newAppointment: Partial<Appointment> = {
        title: '',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        clientName: '',
        salonId: currentSalonId,
        staffId: staffId,
        status: 'pending'
      };
      
      setCurrentAppointment(newAppointment as Appointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleEventClick = (clickInfo: any) => {
    const appointment = filteredAppointments.find(app => app.id === clickInfo.event.id);
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleEventDrop = (dropInfo: any) => {
    const appointment = filteredAppointments.find(app => app.id === dropInfo.event.id);
    if (appointment) {
      // Update staff if event is dragged to a different resource
      const staffId = dropInfo.newResource ? dropInfo.newResource.id : appointment.staffId;
      
      // Gestisci lo spostamento dell'appuntamento
      toast({
        title: "Appuntamento spostato",
        description: "L'appuntamento è stato riposizionato. Conferma per salvare.",
      });
      
      const updatedAppointment = {
        ...appointment,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr,
        staffId
      };
      setCurrentAppointment(updatedAppointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  // Aggiungiamo la funzione per gestire il resize degli appuntamenti
  const handleEventResize = (resizeInfo: any) => {
    const appointment = filteredAppointments.find(app => app.id === resizeInfo.event.id);
    if (appointment) {
      toast({
        title: "Durata modificata",
        description: "La durata dell'appuntamento è stata modificata. Conferma per salvare.",
      });
      
      const updatedAppointment = {
        ...appointment,
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr
      };
      
      setCurrentAppointment(updatedAppointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleAddAppointment = () => {
    if (!currentSalonId) return;
    
    const date = new Date();
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(10, 0, 0, 0);

    // Assegna un membro dello staff di default, se disponibile
    const defaultStaffId = visibleStaff.length > 0 ? visibleStaff[0].id : undefined;
    
    const newAppointment: Partial<Appointment> = {
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      clientName: '',
      salonId: currentSalonId,
      staffId: defaultStaffId, // Ora impostiamo correttamente lo staffId
      status: 'pending'
    };
    
    setCurrentAppointment(newAppointment as Appointment);
    setIsAppointmentDialogOpen(true);
  };
  
  return {
    isAppointmentDialogOpen,
    setIsAppointmentDialogOpen,
    calendarView,
    setCalendarView,
    handleDateSelect,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleAddAppointment
  };
};
