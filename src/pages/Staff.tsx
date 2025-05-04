
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { Search, Plus } from 'lucide-react';
import StaffForm from '@/features/staff/components/StaffForm';
import StaffTable from '@/features/staff/components/StaffTable';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import { StaffFormValues } from '@/features/staff/types';
import { useToast } from '@/hooks/use-toast';

const Staff = () => {
  const { currentSalonId } = useAuth();
  const { 
    staffMembers, 
    services, 
    addStaff, 
    editStaff, 
    deleteStaff, 
    toggleStaffStatus, 
    toggleCalendarVisibility 
  } = useStaffData(currentSalonId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAddStaff = (data: StaffFormValues) => {
    const newStaff = addStaff(data);
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = (data: StaffFormValues) => {
    if (selectedStaff) {
      editStaff(selectedStaff.id, data);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca membro dello staff..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedStaff(null);
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable 
            staffMembers={filteredStaff}
            onEdit={openEditDialog}
            onDelete={deleteStaff}
            onToggleStatus={toggleStaffStatus}
            onToggleCalendarVisibility={toggleCalendarVisibility}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi membro del team</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo membro del team
            </DialogDescription>
          </DialogHeader>
          <StaffForm 
            services={services}
            onSubmit={handleAddStaff}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica membro del team</DialogTitle>
            <DialogDescription>
              Modifica i dati del membro del team
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm 
              defaultValues={{
                firstName: selectedStaff.firstName,
                lastName: selectedStaff.lastName,
                email: selectedStaff.email,
                phone: selectedStaff.phone || '',
                additionalPhone: selectedStaff.additionalPhone || '',
                country: selectedStaff.country || 'Italia',
                birthDate: selectedStaff.birthDate || '',
                position: selectedStaff.position || '',
                color: selectedStaff.color || '#9b87f5',
                isActive: selectedStaff.isActive,
                showInCalendar: selectedStaff.showInCalendar,
                assignedServiceIds: selectedStaff.assignedServiceIds || [],
              }}
              services={services}
              onSubmit={handleEditStaff}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
