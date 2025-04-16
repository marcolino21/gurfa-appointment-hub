
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login: loginService, logout: logoutService, resetPassword: resetPasswordService } = useAuthService();

  useEffect(() => {
    // Check if there's a saved session
    const savedUser = localStorage.getItem('gurfa_user');
    const savedToken = localStorage.getItem('gurfa_token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser) as User;
        dispatch({ 
          type: 'LOGIN', 
          payload: { 
            user, 
            token: savedToken 
          } 
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('gurfa_user');
        localStorage.removeItem('gurfa_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return loginService(email, password, dispatch);
  };

  const logout = () => {
    logoutService(dispatch);
  };

  const setCurrentSalon = (salonId: string) => {
    dispatch({ type: 'SET_CURRENT_SALON', payload: salonId });
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

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      setCurrentSalon,
      resetPassword,
      addSalon
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
