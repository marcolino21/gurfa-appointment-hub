
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import StaffTable from './StaffTable';
import { useStaff } from '../contexts/StaffContext';

const StaffContent: React.FC = () => {
  const { 
    staffMembers, 
    searchTerm, 
    handleToggleStatus, 
    handleDeleteStaff, 
    handleToggleCalendarVisibility, 
    hasSalon,
    setSelectedStaff,
    setIsEditDialogOpen,
  } = useStaff();

  // Filter staff members based on search term
  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  // Handle edit action
  const handleEditStaff = (staff: typeof staffMembers[0]) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  return (
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
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
        onToggleStatus={handleToggleStatus}
        onToggleCalendarVisibility={handleToggleCalendarVisibility}
      />
    </CardContent>
  );
};

export default StaffContent;
