
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, TrashIcon, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PermissionsSelector from './components/permissions/PermissionsSelector';
import { 
  STAFF_ROLES, 
  SystemFeature, 
  StaffRole,
  DEFAULT_ROLE_PERMISSIONS
} from '@/features/staff/types/permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isConfirmed: boolean;
  permissions?: SystemFeature[];
}

type NewUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  permissions: SystemFeature[];
};

const UsersSettings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: STAFF_ROLES.EMPLOYEE,
    permissions: DEFAULT_ROLE_PERMISSIONS[STAFF_ROLES.EMPLOYEE],
  });
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  
  // Carica gli utenti dal database
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Verifico se c'è già un membro dello staff con il salonId corrente
        const { data: staffMembers, error } = await supabase
          .from('staff')
          .select('*')
          .eq('salon_id', currentSalonId || '')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Converto gli staff members nel formato User per la tabella
        const formattedUsers: User[] = staffMembers.map(staff => ({
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
      // Edit mode
      setIsEditMode(true);
      setEditingUserId(user.id);
      
      // Find the user data from the staff table
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
      // Create mode
      resetForm();
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
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
        // Update existing user
        const { data, error } = await supabase
          .from('staff')
          .update(staffMemberData)
          .eq('id', editingUserId)
          .select()
          .single();
          
        if (error) throw error;
        
        // Update user in local list
        setUsers(users.map(user => 
          user.id === editingUserId 
            ? {
                ...user,
                name: `${data.first_name} ${data.last_name}`,
                email: data.email || '',
                role: data.position,
                permissions: data.permissions
              } 
            : user
        ));
        
        toast({
          title: 'Utente aggiornato',
          description: 'Le modifiche sono state salvate con successo.',
        });
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('staff')
          .insert(staffMemberData)
          .select()
          .single();
        
        if (error) throw error;
        
        // Add new user to local list
        const newUser: User = {
          id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email || '',
          role: data.position || 'Dipendente',
          createdAt: new Date(data.created_at).toLocaleDateString('it-IT'),
          isConfirmed: true,
          permissions: data.permissions
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
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Utenti attivi</h2>
          <Button onClick={() => handleOpenDialog()}>AGGIUNGI UTENTE</Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOME</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>RUOLO</TableHead>
                  <TableHead>CREATO IL</TableHead>
                  <TableHead className="text-right">AZIONI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Caricamento utenti...</p>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-sm text-gray-500">Nessun utente trovato. Aggiungi il tuo primo utente!</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role}
                          <ShieldCheck 
                            className="h-4 w-4 text-blue-500" 
                            title={`${user.permissions?.length || 0} permessi assegnati`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.createdAt}
                          {user.isConfirmed && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              CONFERMATO
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'MODIFICA UTENTE' : 'NUOVO UTENTE'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">NOME *</Label>
              <Input 
                id="firstName" 
                placeholder="Nome utente" 
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">COGNOME</Label>
              <Input 
                id="lastName" 
                placeholder="Cognome utente" 
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email utente" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <Label>PERMESSI E RUOLO</Label>
              <PermissionsSelector 
                initialRole={formData.role}
                initialPermissions={formData.permissions}
                onChange={handlePermissionsChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Annulla
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersSettings;
