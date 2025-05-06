import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (authUser) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (profileError) throw profileError;
          
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile.name || '',
            role: profile.role || 'client',
            salon_id: profile.salon_id || '',
            currentSalonId: profile.current_salon_id || profile.salon_id,
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}; 