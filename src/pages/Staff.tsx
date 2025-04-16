
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import StaffTable from '@/features/staff/components/StaffTable';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import { StaffFormValues } from '@/features/staff/types';
import StaffHeader from '@/features/staff/components/StaffHeader';
import StaffDialogs from '@/features/staff/components/StaffDialogs';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Staff = () => {
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  const { 
    staffMembers, 
    services, 
    addStaff, 
    editStaff, 
    deleteStaff, 
    toggleStaffStatus, 
    toggleCalendarVisibility,
    hasSalon 
  } = useStaffData(currentSalonId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    // Log the current salonId to help with debugging
    console.log("Current salonId in Staff component:", currentSalonId);
  }, [currentSalonId]);
  
  // Log staff members whenever they change for debugging
  useEffect(() => {
    console.log("Staff members in Staff component:", staffMembers);
  }, [staffMembers]);

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAddStaff = (data: StaffFormValues) => {
    console.log("Adding new staff member:", data);
    
    if (!currentSalonId) {
      toast({
        title: 'Attenzione',
        description: 'Nessun salone selezionato. Seleziona un salone prima di aggiungere membri dello staff.',
        variant: 'destructive',
      });
      return;
    }
    
    // Ensure showInCalendar is true by default for all new staff members
    const staffData: StaffFormValues = {
      ...data,
      showInCalendar: true
    };
    
    const newStaff = addStaff(staffData);
    console.log("New staff member added:", newStaff);
    
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = (data: StaffFormValues) => {
    if (selectedStaff) {
      console.log("Editing staff member:", data);
      editStaff(selectedStaff.id, data);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    if (!currentSalonId) {
      toast({
        title: 'Attenzione',
        description: 'Nessun salone selezionato. Seleziona un salone dall\'header in alto prima di aggiungere membri dello staff.',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedStaff(null);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <StaffHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddStaffClick={openAddDialog}
          />
        </CardHeader>
        <CardContent>
          {!hasSalon && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Nessun salone selezionato</AlertTitle>
              <AlertDescription>
                Per gestire lo staff, seleziona un salone dall'header in alto.
              </AlertDescription>
            </Alert>
          )}
          <StaffTable 
            staffMembers={filteredStaff}
            onEdit={openEditDialog}
            onDelete={deleteStaff}
            onToggleStatus={toggleStaffStatus}
            onToggleCalendarVisibility={toggleCalendarVisibility}
          />
        </CardContent>
      </Card>

      <StaffDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedStaff={selectedStaff}
        services={services}
        onAddStaff={handleAddStaff}
        onEditStaff={handleEditStaff}
      />
    </div>
  );
};

export default Staff;
