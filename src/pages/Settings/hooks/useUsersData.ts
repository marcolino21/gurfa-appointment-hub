
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SystemFeature, StaffRole, DEFAULT_ROLE_PERMISSIONS, STAFF_ROLES } from '@/features/staff/types/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isConfirmed: boolean;
  permissions?: SystemFeature[];
}

export interface SupabaseStaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  is_active: boolean;
  show_in_calendar: boolean;
  salon_id: string;
  created_at: string;
  position: string | null;
  permissions?: SystemFeature[];
  [key: string]: any;
}

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  permissions: SystemFeature[];
};

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  
  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        console.log("Fetching staff members for salon:", currentSalonId);
        
        const { data: staffMembers, error } = await supabase
          .from('staff')
          .select('*')
          .eq('salon_id', currentSalonId || '')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Fetched staff members:", staffMembers);
        
        const formattedUsers: User[] = (staffMembers as SupabaseStaffMember[]).map(staff => ({
          id: staff.id,
          name: `${staff.first_name} ${staff.last_name}`,
          email: staff.email || '',
          role: staff.position || 'Dipendente',
          createdAt: new Date(staff.created_at).toLocaleDateString('it-IT'),
          isConfirmed: true,
          permissions: staff.permissions || DEFAULT_ROLE_PERMISSIONS[staff.position as StaffRole || STAFF_ROLES.EMPLOYEE]
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Errore nel caricamento degli utenti:', error);
        toast({
          variant: 'destructive',
          title: 'Errore',
          description: 'Impossibile caricare gli utenti.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentSalonId) {
      fetchUsers();
    }
  }, [currentSalonId, toast]);

  return {
    users,
    setUsers,
    isLoading,
    currentSalonId
  };
};
