
import React from 'react';
import Calendar from '@/components/calendar/Calendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CalendarPage = () => {
  const { openModal } = useAppointmentStore();
  const { currentSalonId } = useAuth();
  const activeSalonId = currentSalonId || 'sa1'; // Changed default from 'salon1' to 'sa1'
  const { staffMembers, isLoading } = useStaffData(activeSalonId);
  
  // Count active staff members that are displayed in calendar
  const activeStaffCount = staffMembers.filter(staff => 
    staff.isActive && staff.showInCalendar
  ).length;

  console.log("Active staff count:", activeStaffCount);
  console.log("Staff members in CalendarPage:", staffMembers);
  console.log("Staff with showInCalendar enabled:", staffMembers.filter(s => s.showInCalendar));

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
      <CalendarHeader onCreateAppointment={() => openModal()} />
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-250px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : activeStaffCount === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center">
          <p className="text-muted-foreground mb-2">Non ci sono membri del team attivi e visibili in agenda.</p>
          <p className="text-muted-foreground mb-6">Vai alla sezione <b>Staff</b> per aggiungere o attivare membri del team.</p>
          <Button asChild>
            <Link to="/staff">Vai alla sezione Staff</Link>
          </Button>
        </div>
      ) : (
        <Calendar />
      )}
      <AppointmentModal />
    </div>
  );
};

export default CalendarPage;
