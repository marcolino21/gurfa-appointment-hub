
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_STAFF } from '@/data/mockData';
import { StaffMember } from '@/types';
import { Search, Edit, Trash2, EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

const Professionals = () => {
  const { currentSalonId } = useAuth();
  const [professionals, setProfessionals] = useState<StaffMember[]>(
    currentSalonId ? MOCK_STAFF[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredProfessionals = professionals.filter(professional => {
    const fullName = `${professional.firstName} ${professional.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const getInitials = (firstName: string, lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const handleToggleActive = (professionalId: string) => {
    const updatedProfessionals = professionals.map(pro => {
      if (pro.id === professionalId) {
        return { ...pro, isActive: !pro.isActive };
      }
      return pro;
    });
    
    setProfessionals(updatedProfessionals);
    
    const professional = professionals.find(p => p.id === professionalId);
    const newStatus = !professional?.isActive;
    
    toast({
      title: newStatus ? 'Professionista attivato' : 'Professionista disattivato',
      description: `Il professionista è stato ${newStatus ? 'attivato' : 'disattivato'} con successo`
    });
  };

  const handleDelete = () => {
    if (!selectedProfessional) return;
    
    const updatedProfessionals = professionals.filter(pro => pro.id !== selectedProfessional.id);
    setProfessionals(updatedProfessionals);
    
    toast({
      title: 'Professionista eliminato',
      description: 'Il professionista è stato eliminato con successo'
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedProfessional(null);
  };

  const handleEdit = (professional: StaffMember) => {
    // Simulating navigation to Staff page with the professional's data
    // In a real app, you would store the ID in URL params or in a context/state
    navigate('/staff');
    toast({
      title: 'Modifica professionista',
      description: 'Stai modificando i dettagli del professionista'
    });
  };

  const openDeleteDialog = (professional: StaffMember) => {
    setSelectedProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Professionisti</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca professionista..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professionista</TableHead>
                <TableHead>Contatto</TableHead>
                <TableHead>Visibilità</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: professional.color || '#9b87f5' }}
                        >
                          {getInitials(professional.firstName, professional.lastName)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {professional.firstName} {professional.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {professional.position || 'Professionista'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{professional.email}</p>
                        {professional.phone && (
                          <p className="text-sm text-muted-foreground">{professional.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        professional.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {professional.isActive ? "Online" : "Offline"}
                      </span>
                      {professional.isActive && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {professional.showInCalendar 
                            ? "Visibile in agenda" 
                            : "Nascosto dall'agenda"}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(professional)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Modifica
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleActive(professional.id)}
                          className={professional.isActive ? "text-amber-600" : "text-green-600"}
                        >
                          {professional.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" /> Disattiva
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" /> Attiva
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteDialog(professional)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Elimina
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    {searchTerm ? 'Nessun professionista trovato' : 'Nessun professionista disponibile'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo professionista?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutti i dati associati a questo professionista saranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Professionals;
