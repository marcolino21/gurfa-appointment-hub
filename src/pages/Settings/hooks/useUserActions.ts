
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserFormData, User, SupabaseStaffMember } from './useUsersData';
import { SystemFeature, StaffRole, STAFF_ROLES, DEFAULT_ROLE_PERMISSIONS } from '@/features/staff/types/permissions';

export const useUserActions = (
  currentSalonId: string | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: STAFF_ROLES.EMPLOYEE,
    permissions: DEFAULT_ROLE_PERMISSIONS[STAFF_ROLES.EMPLOYEE],
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: STAFF_ROLES.EMPLOYEE,
      permissions: DEFAULT_ROLE_PERMISSIONS[STAFF_ROLES.EMPLOYEE],
    });
    setIsEditMode(false);
    setEditingUserId(null);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setEditingUserId(user.id);
      
      const names = user.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: user.email,
        role: user.role as StaffRole,
        permissions: user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role as StaffRole || STAFF_ROLES.EMPLOYEE]
      });
    } else {
      resetForm();
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePermissionsChange = (role: StaffRole, permissions: SystemFeature[]) => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      permissions 
    }));
  };
  
  const handleSaveUser = async () => {
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
      
      if (isEditMode && editingUserId) {
        const { data, error } = await supabase
          .from('staff')
          .update(staffMemberData)
          .eq('id', editingUserId)
          .select()
          .single();
          
        if (error) throw error;
        
        const staffData = data as SupabaseStaffMember;
        
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
        const { data, error } = await supabase
          .from('staff')
          .insert(staffMemberData)
          .select()
          .single();
        
        if (error) throw error;
        
        const staffData = data as SupabaseStaffMember;
        
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
      
      handleCloseDialog();
    } catch (error) {
      console.error('Errore nel salvataggio dell\'utente:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile salvare l\'utente.',
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
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
    handlePermissionsChange,
    handleSaveUser,
    handleDeleteUser
  };
};
