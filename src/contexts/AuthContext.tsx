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
  const { 
    login: loginService, 
    logout: logoutService, 
    resetPassword: resetPasswordService 
  } = useAuthService();

  // Enhanced session restoration with error handling
  useEffect(() => {
    const restoreSession = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const savedSession = localStorage.getItem('gurfa_session');
        const savedToken = localStorage.getItem('gurfa_token');
        if (!savedSession || !savedToken) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        const { user, salons } = JSON.parse(savedSession);
        if (!user || !user.id) throw new Error('Invalid user data in session');
        if (!salons || salons.length === 0) throw new Error('No salons available for user');
        const savedSalonId = localStorage.getItem('currentSalonId');
        let effectiveSalonId = null;
        if (savedSalonId && salons.some((s: any) => s.id === savedSalonId)) {
          effectiveSalonId = savedSalonId;
        } else {
          effectiveSalonId = salons[0].id;
          localStorage.setItem('currentSalonId', salons[0].id);
          localStorage.setItem('salon_business_name', salons[0].business_name);
        }
        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            token: savedToken,
            salons,
            currentSalonId: effectiveSalonId,
          },
        });
        if (effectiveSalonId) {
          dispatch({ type: 'SET_CURRENT_SALON', payload: effectiveSalonId });
        }
      } catch (error) {
        localStorage.removeItem('gurfa_session');
        localStorage.removeItem('gurfa_user');
        localStorage.removeItem('gurfa_token');
        localStorage.removeItem('currentSalonId');
        localStorage.removeItem('salon_business_name');
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const loginResult = await loginService(email, password, dispatch, true);
      if (!loginResult?.user?.id) throw new Error('Invalid login result');
      if (!loginResult.salons || loginResult.salons.length === 0) throw new Error('No salons available for user');
      const salonToUse = loginResult.salons[0];
      dispatch({ type: 'SET_CURRENT_SALON', payload: salonToUse.id });
      localStorage.setItem('currentSalonId', salonToUse.id);
      localStorage.setItem('salon_business_name', salonToUse.business_name);
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    console.log('Logging out, clearing all session data');
    logoutService(dispatch);
    // Clear all salon-related data
    localStorage.removeItem('salon_business_name');
    localStorage.removeItem('currentSalonId');
  };

  const setCurrentSalon = (salonId: string) => {
    console.log('Setting current salon:', salonId);
    if (!state.salons.some(s => s.id === salonId)) {
      console.error('Attempted to set invalid salon ID:', salonId);
      return;
    }
    
    dispatch({ type: 'SET_CURRENT_SALON', payload: salonId });
    
    // Store the current salon ID in localStorage
    localStorage.setItem('currentSalonId', salonId);
    
    // Update the business name in localStorage when changing salons
    const salon = state.salons.find(s => s.id === salonId);
    if (salon) {
      localStorage.setItem('salon_business_name', salon.business_name);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return resetPasswordService(email, dispatch);
  };

  const addSalon = (salon: Salon) => {
    dispatch({ type: 'ADD_SALON', payload: salon });
  };

  const updateSalonInfo = (salonId: string, updatedSalon: Salon) => {
    dispatch({ 
      type: 'UPDATE_SALON', 
      payload: { salonId, updatedSalon } 
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        setCurrentSalon,
        resetPassword,
        addSalon,
        updateSalonInfo
      }}
    >
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

export default AuthContext;
