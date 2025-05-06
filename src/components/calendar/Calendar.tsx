
import React, { useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

// Setup the localizer for date-fns
const locales = { 'it': it };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: it }),
  getDay,
  locales,
});

const Calendar = () => {
  const { 
    selectedDate, 
    view, 
    setSelectedDate, 
    setView, 
    openModal, 
    setSelectedAppointment 
  } = useAppointmentStore();
  
  const { user, currentSalonId } = useAuth();
  const activeSalonId = currentSalonId || 'salon1'; // Default to salon1 for testing
  const { appointments, isLoading } = useAppointments(activeSalonId);
  
  // Fetch active staff members
  const { staffMembers, isLoading: isLoadingStaff } = useStaffData(activeSalonId);
  
  // Debug staff members data
  console.log("All staff members:", staffMembers);
  
  // Filter to get active staff that should show in calendar
  const activeStaff = staffMembers.filter(staff => {
    console.log("Staff member:", staff.firstName, staff.lastName, "isActive:", staff.isActive, "showInCalendar:", staff.showInCalendar);
    return staff.isActive && staff.showInCalendar;
  });

  console.log("Active staff in Calendar component:", activeStaff);

  // Event handlers
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    openModal({ start, end });
  }, [openModal]);

  const handleSelectEvent = useCallback((event: any) => {
    setSelectedAppointment(event);
    openModal();
  }, [setSelectedAppointment, openModal]);

  const handleNavigate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [setSelectedDate]);

  const handleViewChange = useCallback((newView: string) => {
    setView(newView as 'day' | 'week' | 'month');
  }, [setView]);

  // Custom components for the calendar
  const components = {
    week: {
      header: ({ date, localizer }: { date: Date; localizer: any }) => {
        if (view !== 'week') {
          // For non-week views, use the default date formatting
          return format(date, 'EEE dd', { locale: it });
        }
        
        // Get the weekday index (0-6, where 0 is Sunday)
        const dayIndex = date.getDay();
        
        // Find the corresponding staff member for this column
        // Make sure we only try to access staff members that exist
        if (activeStaff.length > 0) {
          // Use modulo to loop through staff if we have fewer staff than days
          const staffIndex = dayIndex % activeStaff.length;
          const staff = activeStaff[staffIndex];
          
          if (staff) {
            return (
              <div className="staff-header">
                <div className="staff-name">{staff.firstName} {staff.lastName}</div>
                {staff.color && (
                  <div 
                    className="staff-color-indicator" 
                    style={{ backgroundColor: staff.color }}
                  />
                )}
              </div>
            );
          }
        }
        
        // Fallback to normal day format if no staff for this position
        return format(date, 'EEE dd', { locale: it });
      }
    }
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      {(isLoading || isLoadingStaff) ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <BigCalendar
          localizer={localizer}
          events={appointments.map(appointment => ({
            ...appointment,
            title: appointment.client_name || 'Appuntamento',
            start: appointment.start || new Date(appointment.start_time),
            end: appointment.end || new Date(appointment.end_time),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          date={selectedDate}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          components={components}
          messages={{
            today: 'Oggi',
            previous: 'Indietro',
            next: 'Avanti',
            month: 'Mese',
            week: 'Settimana',
            day: 'Giorno',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Ora',
            event: 'Evento',
            noEventsInRange: 'Nessun appuntamento in questo periodo',
            allDay: 'Tutto il giorno',
            work_week: 'Settimana lavorativa',
            yesterday: 'Ieri',
            tomorrow: 'Domani',
            showMore: (total) => `+ ${total} altri`
          }}
          eventPropGetter={(event) => {
            const style: React.CSSProperties = {
              backgroundColor: '#3174ad',
              borderRadius: '4px',
            };
            
            // Status-based styling
            if (event.status === 'completed') {
              style.backgroundColor = '#10b981';
            } else if (event.status === 'cancelled') {
              style.backgroundColor = '#ef4444';
              style.textDecoration = 'line-through';
            } else if (event.status === 'pending') {
              style.backgroundColor = '#f59e0b';
            } else if (event.status === 'confirmed') {
              style.backgroundColor = '#3b82f6';
            }
            
            // Use staff color if present
            if (event.staff_id && activeStaff.length > 0) {
              const staffMember = activeStaff.find(staff => staff.id === event.staff_id);
              if (staffMember?.color) {
                style.backgroundColor = staffMember.color;
              }
            }
            
            return { style };
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
