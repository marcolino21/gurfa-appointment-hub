
import React, { useState } from 'react';
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

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAddStaff = (data: StaffFormValues) => {
    addStaff(data);
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

  const openAddDialog = () => {
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
