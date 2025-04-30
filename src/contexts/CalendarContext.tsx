import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  extendedProps: {
    clientName: string;
    serviceType: string;
    staffMember: string;
  };
}

interface StaffMember {
  id: string;
  title: string;
}

interface CalendarContextType {
  appointments: Appointment[];
  staffMembers: StaffMember[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addStaffMember: (staffMember: StaffMember) => void;
  updateStaffMember: (staffMember: StaffMember) => void;
  deleteStaffMember: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: 'staff1', title: 'John Doe' },
    { id: 'staff2', title: 'Jane Smith' },
    { id: 'staff3', title: 'Mike Johnson' },
  ]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const updateAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(app => 
      app.id === appointment.id ? appointment : app
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const addStaffMember = (staffMember: StaffMember) => {
    setStaffMembers([...staffMembers, staffMember]);
  };

  const updateStaffMember = (staffMember: StaffMember) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === staffMember.id ? staffMember : staff
    ));
  };

  const deleteStaffMember = (id: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  return (
    <CalendarContext.Provider
      value={{
        appointments,
        staffMembers,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}; 