
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppointmentStore, CalendarView } from '@/store/appointmentStore';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarHeaderProps {
  onCreateAppointment: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateAppointment }) => {
  const { selectedDate, view, setView } = useAppointmentStore();
  const { currentSalonId } = useAuth();
  const activeSalonId = currentSalonId || 'sa1';
  const { staffMembers } = useStaffData(activeSalonId);
  
  // Debug logs for staff data in header
  useEffect(() => {
    console.log("Staff data in CalendarHeader:", staffMembers);
  }, [staffMembers]);
  
  // Filter active staff members that should be displayed in the calendar
  const activeStaff = staffMembers.filter(staff => {
    console.log("CalendarHeader filtering staff:", staff.firstName, staff.lastName, staff.isActive, staff.showInCalendar);
    return staff.isActive === true && staff.showInCalendar === true;
  });
  
  useEffect(() => {
    console.log("Active staff for display in calendar tabs:", activeStaff);
  }, [activeStaff]);
  
  // Format the current selected date
  const formattedDate = format(selectedDate, 'MMMM yyyy', { locale: it });

  // Capitalize the first letter of the month
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{capitalizedDate}</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex rounded-md border">
          <Button
            variant={view === 'day' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('day')}
            className="rounded-r-none"
          >
            Giorno
          </Button>
          <Button
            variant={view === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="rounded-none border-l border-r"
          >
            Settimana
          </Button>
          <Button
            variant={view === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="rounded-l-none border-r"
          >
            Mese
          </Button>
          {activeStaff.length > 0 && (
            <Button
              variant={view === 'staff' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('staff')}
              className="rounded-l-none"
            >
              Staff
            </Button>
          )}
        </div>
        
        <Button onClick={onCreateAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Nuovo appuntamento
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
