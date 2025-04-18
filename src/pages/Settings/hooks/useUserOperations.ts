import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, SupabaseStaffMember, UserFormData } from './useUsersData';

export const useUserOperations = (currentSalonId: string | null, users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveUser = async (formData: UserFormData, isEditMode: boolean, editingUserId: string | null) => {
    if (!formData.firstName || !formData.email) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Compila tutti i campi obbligatori.',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const staffMemberData = {
        first_name: formData.firstName,
        last_name: formData.lastName || '',
        email: formData.email,
        position: formData.role,
        permissions: formData.permissions,
        is_active: true,
        show_in_calendar: true,
        salon_id: currentSalonId || '',
      };
      
      console.log("Saving staff member data:", staffMemberData);
      
      if (isEditMode && editingUserId) {
        // Check if the email is being changed and if it already exists
        if (users.some(user => 
          user.id !== editingUserId && 
          user.email.toLowerCase() === formData.email.toLowerCase()
        )) {
          throw new Error("Email già utilizzata");
        }
        
        const { data, error } = await supabase
          .from('staff')
          .update(staffMemberData)
          .eq('id', editingUserId)
          .select()
          .single();
          
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        const staffData = data as SupabaseStaffMember;
        console.log("Updated staff data:", staffData);
        
        setUsers(users.map(user => 
          user.id === editingUserId 
            ? {
                ...user,
                name: `${staffData.first_name} ${staffData.last_name}`,
                email: staffData.email || '',
                role: staffData.position || '',
                permissions: staffData.permissions
              } 
            : user
        ));
        
        toast({
          title: 'Utente aggiornato',
          description: 'Le modifiche sono state salvate con successo.',
        });
      } else {
        // Check if the email already exists before inserting
        if (users.some(user => 
          user.email.toLowerCase() === formData.email.toLowerCase()
        )) {
          throw new Error("Email già utilizzata");
        }
        
        const { data, error } = await supabase
          .from('staff')
          .insert(staffMemberData)
          .select()
          .single();
        
        if (error) {
          // Check if it's a duplicate email error
          if (error.code === '23505' && error.message.includes('staff_email_key')) {
            throw new Error("Email già utilizzata");
          }
          console.error("Supabase error:", error);
          throw error;
        }
        
        const staffData = data as SupabaseStaffMember;
        console.log("New staff data:", staffData);
        
        const newUser: User = {
          id: staffData.id,
          name: `${staffData.first_name} ${staffData.last_name}`,
          email: staffData.email || '',
          role: staffData.position || 'Dipendente',
          createdAt: new Date(staffData.created_at).toLocaleDateString('it-IT'),
          isConfirmed: true,
          permissions: staffData.permissions
        };
        
        setUsers(prev => [newUser, ...prev]);
        
        toast({
          title: 'Utente aggiunto',
          description: 'Il nuovo utente è stato aggiunto con successo.',
        });
      }
    } catch (error: any) {
      console.error('Errore nel salvataggio dell\'utente:', error);
      
      // Provide more specific error message based on the error type
      const errorMessage = error?.message === "Email già utilizzata" 
        ? "L'email inserita è già associata ad un altro utente."
        : "Impossibile salvare l'utente.";
      
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: 'Utente eliminato',
        description: 'L\'utente è stato eliminato con successo.',
      });
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'utente:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile eliminare l\'utente.',
      });
    }
  };

  return {
    isSaving,
    handleSaveUser,
    handleDeleteUser
  };
};
