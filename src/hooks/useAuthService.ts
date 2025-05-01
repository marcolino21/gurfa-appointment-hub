import { useToast } from './use-toast';
import { MOCK_USERS } from '../data/mockData';
import { MOCK_SALONS } from '../data/mock/auth';

export const useAuthService = () => {
  const { toast } = useToast();

  const login = async (
    email: string, 
    password: string, 
    dispatch: React.Dispatch<any>,
    stayLoggedIn: boolean = true
  ): Promise<{ user: any; salons: any[] } | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      console.log('Starting login process for:', email);
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
      
      // Get user's salons
      const userSalons = MOCK_SALONS[user.id] || [];
      console.log('Login - Found salons for user:', {
        userId: user.id,
        salonCount: userSalons.length,
        salons: userSalons.map(s => ({ id: s.id, name: s.name }))
      });
      
      if (userSalons.length === 0) {
        console.warn('No salons found for user:', user.id);
        throw new Error('Nessun salone associato all\'account');
      }
      
      const session = { user, token, salons: userSalons };
      
      // Store session data
      try {
        localStorage.setItem('gurfa_session', JSON.stringify(session));
        localStorage.setItem('gurfa_user', JSON.stringify(user));
        localStorage.setItem('gurfa_token', token);
        localStorage.setItem('session_type', 'persistent');
        
        // Set default salon
        const defaultSalon = userSalons[0];
        localStorage.setItem('currentSalonId', defaultSalon.id);
        localStorage.setItem('salon_business_name', defaultSalon.name);
        
        console.log('Session data stored successfully:', {
          hasSession: true,
          hasUser: true,
          hasToken: true,
          defaultSalonId: defaultSalon.id
        });
      } catch (storageError) {
        console.error('Error storing session data:', storageError);
        throw new Error('Errore nel salvataggio della sessione');
      }
      
      // Dispatch login action
      dispatch({
        type: 'LOGIN',
        payload: { 
          user, 
          token,
          salons: userSalons,
          currentSalonId: userSalons[0].id
        }
      });

      toast({
        title: 'Login riuscito',
        description: `Benvenuto, ${user.name}!`,
      });
      
      return { user, salons: userSalons };
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        variant: 'destructive',
        title: 'Errore di login',
        description: error.message,
      });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = (dispatch: React.Dispatch<any>) => {
    console.log('Starting logout process');
    try {
      localStorage.removeItem('gurfa_session');
      localStorage.removeItem('gurfa_user');
      localStorage.removeItem('gurfa_token');
      localStorage.removeItem('session_type');
      localStorage.removeItem('currentSalonId');
      localStorage.removeItem('salon_business_name');
      
      dispatch({ type: 'LOGOUT' });
      
      console.log('Logout completed successfully');
      
      toast({
        title: 'Logout effettuato',
        description: 'Hai effettuato il logout con successo.'
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        variant: 'destructive',
        title: 'Errore durante il logout',
        description: 'Si è verificato un errore durante il logout.'
      });
    }
  };

  const resetPassword = async (
    email: string,
    dispatch: React.Dispatch<any>
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('Starting password reset for:', email);
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
      
      console.log('Password reset email sent successfully');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return { login, logout, resetPassword };
};
