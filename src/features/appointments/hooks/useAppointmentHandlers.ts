
import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { StaffMember } from '@/types';

export const useAppointmentHandlers = (visibleStaff: StaffMember[]) => {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'>('timeGridWeek');
  
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
      
      console.log("Date selected:", selectInfo);
      
      const newAppointment: Partial<Appointment> = {
        title: '',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        clientName: '',
        salonId: currentSalonId,
        staffId: staffId,
        status: 'pending'
      };
      
      console.log("Creating new appointment:", newAppointment);
      setCurrentAppointment(newAppointment as Appointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked:", clickInfo);
    console.log("Event ID:", clickInfo.event.id);
    console.log("Available appointments:", filteredAppointments);
    
    const appointment = filteredAppointments.find(app => app.id === clickInfo.event.id);
    console.log("Found appointment:", appointment);
    
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsAppointmentDialogOpen(true);
    } else {
      console.warn("No appointment found with ID:", clickInfo.event.id);
      
      // Debugging information
      console.log("Event extendedProps:", clickInfo.event.extendedProps);
      console.log("All appointment IDs:", filteredAppointments.map(a => a.id));
    }
  };
  
  const handleEventDrop = (dropInfo: any) => {
    console.log("Event dropped:", dropInfo);
    
    const appointment = filteredAppointments.find(app => app.id === dropInfo.event.id);
    if (appointment) {
      // Update staff if event is dragged to a different resource
      const staffId = dropInfo.newResource ? dropInfo.newResource.id : appointment.staffId;
      
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
  
  const handleAddAppointment = () => {
    if (!currentSalonId) return;
    
    const date = new Date();
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(10, 0, 0, 0);
    
    const newAppointment: Partial<Appointment> = {
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      clientName: '',
      salonId: currentSalonId,
      staffId: visibleStaff.length > 0 ? visibleStaff[0].id : undefined,
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
    handleAddAppointment
  };
};
