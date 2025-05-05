import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Salon = Tables<'salon_profiles'>;

export const useAuthService = () => {
  const { toast } = useToast();

  const login = async (
    email: string, 
    password: string, 
    dispatch: React.Dispatch<any>,
    stayLoggedIn: boolean = true
  ): Promise<{ user: any; salons: Salon[] } | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      console.log('Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Invalid login result');
      }

      // Get user's salons from the database
      const { data: salons, error: salonsError } = await supabase
        .from('salon_profiles')
        .select('*')
        .eq('user_id', data.user.id);

      if (salonsError) {
        throw new Error('Error fetching salons');
      }

      if (!salons || salons.length === 0) {
        throw new Error('Nessun salone associato all\'account');
      }

      // Set default salon
      const defaultSalon = salons[0];
      
      // First dispatch the login action
      dispatch({
        type: 'LOGIN',
        payload: { 
          user: data.user, 
          token: data.session?.access_token,
          salons,
          currentSalonId: defaultSalon.id
        }
      });

      // Then store session data
      try {
        const session = { user: data.user, token: data.session?.access_token, salons };
        localStorage.setItem('gurfa_session', JSON.stringify(session));
        localStorage.setItem('gurfa_user', JSON.stringify(data.user));
        localStorage.setItem('gurfa_token', data.session?.access_token || '');
        localStorage.setItem('session_type', 'persistent');
        localStorage.setItem('currentSalonId', defaultSalon.id);
        localStorage.setItem('salon_business_name', defaultSalon.business_name);
        
        console.log('Session data stored successfully:', {
          hasSession: true,
          hasUser: true,
          hasToken: true,
          defaultSalonId: defaultSalon.id
        });
      } catch (storageError) {
        console.error('Error storing session data:', storageError);
        // If storage fails, logout to maintain consistency
        dispatch({ type: 'LOGOUT' });
        throw new Error('Errore nel salvataggio della sessione');
      }

      // Wait a bit before showing the success toast
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast({
        title: 'Login riuscito',
        description: `Benvenuto, ${data.user.email}!`,
      });
      
      return { user: data.user, salons };
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

  const logout = async (dispatch: React.Dispatch<any>) => {
    console.log('Starting logout process');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // First dispatch logout
      dispatch({ type: 'LOGOUT' });
      
      // Then clear storage
      localStorage.removeItem('gurfa_session');
      localStorage.removeItem('gurfa_user');
      localStorage.removeItem('gurfa_token');
      localStorage.removeItem('session_type');
      localStorage.removeItem('currentSalonId');
      localStorage.removeItem('salon_business_name');
      
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
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
