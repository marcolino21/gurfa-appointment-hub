import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, Salon } from '../types';
import { authReducer, initialState } from '../reducers/authReducer';
import { useAuthService } from '../hooks/useAuthService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentSalon: (salonId: string) => void;
  resetPassword: (email: string) => Promise<boolean>;
  addSalon: (salon: Salon) => void;
  updateSalonInfo: (salonId: string, updatedSalon: Salon) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login: loginService, logout: logoutService, resetPassword: resetPasswordService } = useAuthService();

  useEffect(() => {
    // Check if there's a saved session
    const savedSession = localStorage.getItem('gurfa_session');
    
    if (savedSession) {
      try {
        const { user, token } = JSON.parse(savedSession);
        dispatch({ 
          type: 'LOGIN', 
          payload: { user, token } 
        });
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('gurfa_session');
        localStorage.removeItem('gurfa_user');
        localStorage.removeItem('gurfa_token');
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage when salon changes
    if (state.currentSalonId) {
      const currentSalon = state.salons.find(salon => salon.id === state.currentSalonId);
      if (currentSalon?.name) {
        localStorage.setItem('salon_business_name', currentSalon.name);
      }
    }
  }, [state.currentSalonId, state.salons]);

  const login = async (email: string, password: string): Promise<void> => {
    return loginService(email, password, dispatch);
  };

  const logout = () => {
    logoutService(dispatch);
    // Clear business name from localStorage on logout
    localStorage.removeItem('salon_business_name');
  };

  const setCurrentSalon = (salonId: string) => {
    dispatch({ type: 'SET_CURRENT_SALON', payload: salonId });
    
    // Update the business name in localStorage when changing salons
    const salon = state.salons.find(s => s.id === salonId);
    if (salon) {
      localStorage.setItem('salon_business_name', salon.name);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return resetPasswordService(email, dispatch);
  };

  const addSalon = (salon: Salon) => {
    // Aggiungiamo un ID univoco se non presente
    const salonToAdd = {
      ...salon,
      id: salon.id || `salon-${Date.now()}`,
    };
    dispatch({ type: 'ADD_SALON', payload: salonToAdd });
  };

  const updateSalonInfo = (salonId: string, updatedSalon: Salon) => {
    // Update the salon in the state
    dispatch({ 
      type: 'UPDATE_SALON', 
      payload: { 
        salonId,
        updatedSalon
      } 
    });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      setCurrentSalon,
      resetPassword,
      addSalon,
      updateSalonInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};
