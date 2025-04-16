
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffProvider } from '../hooks/useStaffProvider';
import { StaffContextType } from './StaffContextType';

// Create the context with default values
const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Provider component that wraps the part of your app that needs the context
export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentSalonId } = useAuth();
  const value = useStaffProvider(currentSalonId);

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};

// Custom hook to use our Staff context
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
