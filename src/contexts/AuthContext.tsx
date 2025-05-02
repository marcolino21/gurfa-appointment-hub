import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, Salon } from '../types';
import { authReducer, initialState } from '../reducers/authReducer';
import { useAuthService } from '../hooks/useAuthService';
import { MOCK_SALONS } from '../data/mock/auth';

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
        
        console.log('Attempting to restore session...', {
          hasSession: Boolean(localStorage.getItem('gurfa_session')),
          hasToken: Boolean(localStorage.getItem('gurfa_token')),
          savedSalonId: localStorage.getItem('currentSalonId')
        });
        
        // Check for saved session
        const savedSession = localStorage.getItem('gurfa_session');
        const savedToken = localStorage.getItem('gurfa_token');
        
        if (!savedSession || !savedToken) {
          console.log('No saved session found');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        try {
          const { user } = JSON.parse(savedSession);
          
          if (!user || !user.id) {
            throw new Error('Invalid user data in session');
          }

          console.log('Found valid session for user:', {
            userId: user.id,
            email: user.email,
            role: user.role
          });
          
          // Get user's salons
          const userSalons = MOCK_SALONS[user.id] || [];
          console.log('Available salons for user:', userSalons.map(s => ({ id: s.id, name: s.name })));
          
          if (userSalons.length === 0) {
            throw new Error('No salons available for user');
          }

          // Get saved salon ID
          const savedSalonId = localStorage.getItem('currentSalonId');
          console.log('Saved salon ID:', savedSalonId);
          
          // Determine the correct salon ID to use
          let effectiveSalonId = null;
          if (savedSalonId && userSalons.some(s => s.id === savedSalonId)) {
            console.log('Using saved salon ID:', savedSalonId);
            effectiveSalonId = savedSalonId;
          } else {
            console.log('Using default salon ID:', userSalons[0].id);
            effectiveSalonId = userSalons[0].id;
            localStorage.setItem('currentSalonId', userSalons[0].id);
            localStorage.setItem('salon_business_name', userSalons[0].name);
          }
          
          // Dispatch login with all necessary data
          dispatch({ 
            type: 'LOGIN', 
            payload: { 
              user, 
              token: savedToken,
              salons: userSalons,
              currentSalonId: effectiveSalonId
            } 
          });
          
          if (effectiveSalonId) {
            dispatch({ type: 'SET_CURRENT_SALON', payload: effectiveSalonId });
          }
        } catch (parseError) {
          console.error('Error parsing session data:', parseError);
          throw parseError;
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear potentially corrupted session data
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
      console.log('Starting login process for:', email);
      const loginResult = await loginService(email, password, dispatch, true);
      console.log('Login successful, checking salons');
      
      if (!loginResult?.user?.id) {
        throw new Error('Invalid login result');
      }

      // After successful login, ensure salon is selected
      const userSalons = MOCK_SALONS[loginResult.user.id] || [];
      console.log('Available salons after login:', userSalons);
      
      if (userSalons.length === 0) {
        throw new Error('No salons available for user');
      }

      const salonToUse = userSalons[0];
      console.log('Setting initial salon:', salonToUse);
      
      dispatch({ type: 'SET_CURRENT_SALON', payload: salonToUse.id });
      localStorage.setItem('currentSalonId', salonToUse.id);
      localStorage.setItem('salon_business_name', salonToUse.name);
    } catch (error) {
      console.error('Login error:', error);
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
      localStorage.setItem('salon_business_name', salon.name);
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
