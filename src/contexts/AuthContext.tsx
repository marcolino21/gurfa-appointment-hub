
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

  useEffect(() => {
    // Miglioramento del controllo e ripristino della sessione
    const restoreSession = () => {
      try {
        const savedSession = localStorage.getItem('gurfa_session');
        const savedToken = localStorage.getItem('gurfa_token');
        const savedUser = localStorage.getItem('gurfa_user');
        const savedSalonId = localStorage.getItem('gurfa_current_salon_id');
        
        if (savedSession && savedToken && savedUser) {
          const parsedSession = JSON.parse(savedSession);
          const parsedUser = JSON.parse(savedUser);
          
          // Verifica che le informazioni siano valide
          if (parsedUser && parsedUser.id && savedToken) {
            // Imposta lo stato iniziale con i dati utente
            dispatch({ 
              type: 'LOGIN', 
              payload: { 
                user: parsedUser, 
                token: savedToken 
              } 
            });
            
            // Se esiste un salone salvato, impostalo come corrente
            if (savedSalonId) {
              dispatch({ type: 'SET_CURRENT_SALON', payload: savedSalonId });
              
              // Aggiorna anche il business name in localStorage
              const savedSalons = state.salons.length > 0 
                ? state.salons 
                : parsedSession.salons || [];
              
              const currentSalon = savedSalons.find((s: Salon) => s.id === savedSalonId);
              if (currentSalon) {
                localStorage.setItem('salon_business_name', currentSalon.name);
              }
            }
            
            console.log("Sessione utente ripristinata con successo");
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Errore nel ripristino della sessione:', error);
        return false;
      }
    };
    
    // Tenta di ripristinare la sessione all'avvio dell'app
    restoreSession();
    
    // Aggiungi un event listener per gestire la condivisione della sessione tra tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gurfa_session' && event.newValue === null) {
        // Se la sessione è stata rimossa in un'altra tab, esegui logout anche qui
        dispatch({ type: 'LOGOUT' });
      } else if (event.key === 'gurfa_session' && event.newValue && !state.user) {
        // Se la sessione è stata aggiunta in un'altra tab e non c'è un utente attivo qui
        restoreSession();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Tenta di mantenere viva la sessione periodicamente
    const sessionInterval = setInterval(() => {
      if (state.user) {
        // Aggiorna il timestamp della sessione per mantenerla attiva
        const savedSession = localStorage.getItem('gurfa_session');
        if (savedSession) {
          try {
            const session = JSON.parse(savedSession);
            session.timestamp = Date.now();
            localStorage.setItem('gurfa_session', JSON.stringify(session));
          } catch (e) {
            console.error('Errore nell\'aggiornamento del timestamp della sessione:', e);
          }
        }
      }
    }, 60000); // Ogni minuto
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(sessionInterval);
    };
  }, [state.user, state.salons]);

  // Implementa un login ancora più persistente per impostazione predefinita
  const login = async (email: string, password: string): Promise<void> => {
    return loginService(email, password, dispatch, true); // Sempre persistente
  };

  const logout = () => {
    logoutService(dispatch);
    // Clear business name and salon id from localStorage on logout
    localStorage.removeItem('salon_business_name');
    localStorage.removeItem('gurfa_current_salon_id');
  };

  const setCurrentSalon = (salonId: string) => {
    dispatch({ type: 'SET_CURRENT_SALON', payload: salonId });
    
    // Save current salon ID to localStorage for persistence
    localStorage.setItem('gurfa_current_salon_id', salonId);
    
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
    
    // Se è il primo salone aggiunto, impostalo come quello corrente
    if (state.salons.length === 0) {
      setCurrentSalon(salonToAdd.id);
    }
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
    
    // If this is the current salon, also update the business name in localStorage
    if (salonId === state.currentSalonId) {
      localStorage.setItem('salon_business_name', updatedSalon.name);
    }
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

export default AuthContext;
