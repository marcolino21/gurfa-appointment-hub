
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, Salon, UserRole } from '../types';
import { useToast } from '../hooks/use-toast';

// Mock data per lo sviluppo
const MOCK_USERS = {
  'super_admin@gurfa.com': {
    id: '1',
    email: 'super_admin@gurfa.com',
    name: 'Super Admin',
    password: 'admin123',
    role: 'super_admin' as UserRole,
    isActive: true
  },
  'admin@gurfa.app': {
    id: '4',
    email: 'admin@gurfa.app',
    name: 'Admin Demo',
    password: 'password',
    role: 'super_admin' as UserRole,
    isActive: true
  },
  'azienda@gurfa.com': {
    id: '2',
    email: 'azienda@gurfa.com',
    name: 'Azienda Demo',
    password: 'azienda123',
    role: 'azienda' as UserRole,
    isActive: true
  },
  'freelance@gurfa.com': {
    id: '3',
    email: 'freelance@gurfa.com',
    name: 'Freelance Demo',
    password: 'freelance123',
    role: 'freelance' as UserRole,
    isActive: true
  }
};

const MOCK_SALONS: Record<string, Salon[]> = {
  '1': [
    { id: 'sa1', name: 'Salone Admin', ownerId: '1' }
  ],
  '2': [
    { id: 'a1', name: 'Salone Roma Centro', ownerId: '2', address: 'Via Roma 123, Roma', phone: '06123456' },
    { id: 'a2', name: 'Salone Milano Centro', ownerId: '2', address: 'Via Milano 456, Milano', phone: '02123456' }
  ],
  '3': [
    { id: 'f1', name: 'Studio Personale', ownerId: '3', address: 'Via Napoli 789, Napoli', phone: '081123456' }
  ]
};

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_SALON'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SALONS'; payload: Salon[] };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        salons: MOCK_SALONS[action.payload.user.id] || [],
        currentSalonId: MOCK_SALONS[action.payload.user.id]?.[0]?.id || null,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        salons: [],
        currentSalonId: null,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_SALON':
      return {
        ...state,
        currentSalonId: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_SALONS':
      return {
        ...state,
        salons: action.payload
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  currentSalonId: null,
  salons: [],
  loading: false,
  error: null
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentSalon: (salonId: string) => void;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se c'è una sessione salvata
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
        console.error('Errore nel parsing dell\'utente salvato:', error);
        localStorage.removeItem('gurfa_user');
        localStorage.removeItem('gurfa_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simula una richiesta API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lowercaseEmail = email.toLowerCase();
      const mockUser = MOCK_USERS[lowercaseEmail as keyof typeof MOCK_USERS];
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Credenziali non valide');
      }

      if (!mockUser.isActive) {
        throw new Error('Account disattivato. Contatta l\'amministratore.');
      }
      
      // Crea un user object senza la password
      const { password: _, ...userWithoutPassword } = mockUser;
      const user = userWithoutPassword;
      
      // Genera un token fittizio
      const token = `mock_token_${Date.now()}`;
      
      // Salva nella local storage
      localStorage.setItem('gurfa_user', JSON.stringify(user));
      localStorage.setItem('gurfa_token', token);
      
      dispatch({
        type: 'LOGIN',
        payload: { user, token }
      });

      toast({
        title: 'Login riuscito',
        description: `Benvenuto, ${user.name}!`,
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        variant: 'destructive',
        title: 'Errore di login',
        description: error.message,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('gurfa_user');
    localStorage.removeItem('gurfa_token');
    dispatch({ type: 'LOGOUT' });
    toast({
      title: 'Logout effettuato',
      description: 'Hai effettuato il logout con successo.'
    });
  };

  const setCurrentSalon = (salonId: string) => {
    dispatch({ type: 'SET_CURRENT_SALON', payload: salonId });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lowercaseEmail = email.toLowerCase();
      const userExists = !!MOCK_USERS[lowercaseEmail as keyof typeof MOCK_USERS];
      
      if (!userExists) {
        throw new Error('Email non trovata');
      }
      
      // In una vera app, qui invieremmo una email di reset
      toast({
        title: 'Email inviata',
        description: 'Se l\'indirizzo esiste nel nostro sistema, riceverai un\'email con le istruzioni per reimpostare la password.'
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      setCurrentSalon,
      resetPassword
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
