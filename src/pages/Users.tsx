
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'super_admin@gurfa.com',
    name: 'Super Admin',
    role: 'super_admin',
    isActive: true
  },
  {
    id: '2',
    email: 'azienda@gurfa.com',
    name: 'Azienda Demo',
    role: 'azienda',
    isActive: true
  },
  {
    id: '3',
    email: 'freelance@gurfa.com',
    name: 'Freelance Demo',
    role: 'freelance',
    isActive: true
  },
  {
    id: '4',
    email: 'azienda2@gurfa.com',
    name: 'Seconda Azienda',
    role: 'azienda',
    isActive: true
  },
  {
    id: '5',
    email: 'freelance2@gurfa.com',
    name: 'Secondo Freelance',
    role: 'freelance',
    isActive: false
  }
];

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'azienda' as UserRole,
    isActive: true,
  });
  const [users, setUsers] = useState(MOCK_USERS);
  
  // Se non sei super admin, reindirizza alla dashboard
  React.useEffect(() => {
    if (user?.role !== 'super_admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({
      ...prev,
      role: value as UserRole
    }));
  };
  
  const handleActiveChange = (checked: boolean) => {
    setNewUser(prev => ({
      ...prev,
      isActive: checked
    }));
  };
  
  const toggleUserActive = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };
  
  const handleAddUser = () => {
    // Validazione base
    if (!newUser.name || !newUser.email) return;
    
    // In una vera app, qui invieremmo una richiesta API
    const newUserWithId = {
      ...newUser,
      id: `user_${Date.now()}`
    };
    
    setUsers([...users, newUserWithId]);
    setIsDialogOpen(false);
    
    // Reset del form
    setNewUser({
      name: '',
      email: '',
      role: 'azienda',
      isActive: true
    });
  };
  
  // Filtra gli utenti in base alla ricerca
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utenti</h1>
          <p className="text-muted-foreground">
            Gestisci gli utenti della piattaforma
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuovo Utente
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cerca utenti..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tutti gli utenti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'super_admin' ? 'Super Admin' : 
                     user.role === 'azienda' ? 'Azienda' : 'Freelance'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Attivo
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Inattivo
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant={user.isActive ? "destructive" : "outline"} 
                      size="sm"
                      onClick={() => toggleUserActive(user.id)}
                      disabled={user.role === 'super_admin'} // Non permette di disattivare il super admin
                    >
                      {user.isActive ? 'Disattiva' : 'Attiva'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nessun utente trovato
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aggiungi nuovo utente</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="Nome e cognome"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="email@esempio.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Ruolo</Label>
                <Select value={newUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="azienda">Azienda</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Attivo</Label>
                <Switch 
                  id="active"
                  checked={newUser.isActive}
                  onCheckedChange={handleActiveChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annulla</Button>
            </DialogClose>
            <Button onClick={handleAddUser}>Crea utente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
