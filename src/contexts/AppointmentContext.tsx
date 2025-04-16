
import React, { createContext, useContext } from 'react';
import { AppointmentContextType } from '@/features/appointments/types/appointmentContext';
import { useAppointmentProvider } from '@/features/appointments/hooks/useAppointmentProvider';

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appointmentContext = useAppointmentProvider();

  return (
    <AppointmentContext.Provider value={appointmentContext}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments deve essere usato all\'interno di un AppointmentProvider');
  }
  return context;
};
