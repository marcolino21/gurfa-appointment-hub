
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilIcon, TrashIcon, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isConfirmed: boolean;
}

type NewUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const UsersSettings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
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
          isConfirmed: true
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
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handleSaveUser = async () => {
    if (!formData.firstName || !formData.email || !formData.role) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Compila tutti i campi obbligatori.',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newStaffMember = {
        first_name: formData.firstName,
        last_name: formData.lastName || '',
        email: formData.email,
        position: formData.role,
        is_active: true,
        show_in_calendar: true,
        salon_id: currentSalonId || '',
      };
      
      const { data, error } = await supabase
        .from('staff')
        .insert(newStaffMember)
        .select()
        .single();
      
      if (error) throw error;
      
      // Aggiungi il nuovo utente alla lista locale
      const newUser: User = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email || '',
        role: data.position || 'Dipendente',
        createdAt: new Date(data.created_at).toLocaleDateString('it-IT'),
        isConfirmed: true
      };
      
      setUsers(prev => [newUser, ...prev]);
      
      // Reset form e chiudi il dialog
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: 'Utente aggiunto',
        description: 'Il nuovo utente è stato aggiunto con successo.',
      });
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>AGGIUNGI UTENTE</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>NUOVO UTENTE</DialogTitle>
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
                <div className="space-y-2">
                  <Label htmlFor="role">RUOLO (info) *</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Seleziona un ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Titolare">Titolare</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Dipendente">Dipendente</SelectItem>
                      <SelectItem value="Commercialista">Commercialista</SelectItem>
                      <SelectItem value="Manager">Manager con permessi ridotti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
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
                      <TableCell>{user.role}</TableCell>
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
                          <Button variant="ghost" size="icon">
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
    </div>
  );
};

export default UsersSettings;
