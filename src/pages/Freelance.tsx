
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
import { useAuth } from '@/contexts/AuthContext';
import { Search, Check, X, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '@/types';

const MOCK_FREELANCES: User[] = [
  {
    id: '3',
    email: 'freelance@gurfa.com',
    name: 'Freelance Demo',
    role: 'freelance',
    isActive: true
  },
  {
    id: '5',
    email: 'freelance2@gurfa.com',
    name: 'Secondo Freelance',
    role: 'freelance',
    isActive: false
  },
  {
    id: '6',
    email: 'freelance3@gurfa.com',
    name: 'Terzo Freelance',
    role: 'freelance',
    isActive: true
  }
];

const Freelance: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [freelances, setFreelances] = useState(MOCK_FREELANCES);
  
  // Se non sei super admin, reindirizza alla dashboard
  React.useEffect(() => {
    if (user?.role !== 'super_admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleUserActive = (id: string) => {
    setFreelances(freelances.map(freelance => 
      freelance.id === id ? { ...freelance, isActive: !freelance.isActive } : freelance
    ));
  };
  
  // Filtra i freelance in base alla ricerca
  const filteredFreelances = freelances.filter(freelance => 
    freelance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelance.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Freelance</h1>
        <p className="text-muted-foreground">
          Gestisci i professionisti freelance
        </p>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cerca freelance..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tutti i Freelance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFreelances.map((freelance) => (
                <TableRow key={freelance.id}>
                  <TableCell>{freelance.name}</TableCell>
                  <TableCell>{freelance.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      freelance.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {freelance.isActive ? (
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
                    <div className="flex gap-2">
                      <Link to={`/appuntamenti?freelance=${freelance.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> Agenda
                        </Button>
                      </Link>
                      <Button 
                        variant={freelance.isActive ? "destructive" : "outline"} 
                        size="sm"
                        onClick={() => toggleUserActive(freelance.id)}
                      >
                        {freelance.isActive ? 'Disattiva' : 'Attiva'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFreelances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nessun freelance trovato
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Freelance;
