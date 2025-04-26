import { useToast } from './use-toast';
import { MOCK_USERS } from '../data/mockData';

export const useAuthService = () => {
  const { toast } = useToast();

  const login = async (
    email: string, 
    password: string, 
    dispatch: React.Dispatch<any>,
    stayLoggedIn: boolean = true
  ): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lowercaseEmail = email.toLowerCase();
      const mockUser = MOCK_USERS[lowercaseEmail as keyof typeof MOCK_USERS];
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Credenziali non valide');
      }

      if (!mockUser.isActive) {
        throw new Error('Account disattivato. Contatta l\'amministratore.');
      }
      
      const { password: _, ...userWithoutPassword } = mockUser;
      const user = userWithoutPassword;
      const token = `mock_token_${Date.now()}`;
      
      const session = { user, token };
      
      localStorage.setItem('gurfa_session', JSON.stringify(session));
      localStorage.setItem('gurfa_user', JSON.stringify(user));
      localStorage.setItem('gurfa_token', token);
      localStorage.setItem('session_type', 'persistent');
      
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

  const logout = (dispatch: React.Dispatch<any>) => {
    localStorage.removeItem('gurfa_session');
    localStorage.removeItem('gurfa_user');
    localStorage.removeItem('gurfa_token');
    localStorage.removeItem('session_type');
    dispatch({ type: 'LOGOUT' });
    toast({
      title: 'Logout effettuato',
      description: 'Hai effettuato il logout con successo.'
    });
  };

  const resetPassword = async (
    email: string,
    dispatch: React.Dispatch<any>
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lowercaseEmail = email.toLowerCase();
      const userExists = !!MOCK_USERS[lowercaseEmail as keyof typeof MOCK_USERS];
      
      if (!userExists) {
        throw new Error('Email non trovata');
      }
      
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

  return { login, logout, resetPassword };
};
