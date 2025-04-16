
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { StaffProvider } from '@/features/staff/contexts/StaffContext';
import StaffHeader from '@/features/staff/components/StaffHeader';
import StaffContent from '@/features/staff/components/StaffContent';
import StaffDialogs from '@/features/staff/components/StaffDialogs';
import { useStaff } from '@/features/staff/contexts/StaffContext';

const StaffDialogsContainer = () => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedStaff,
    services,
    handleAddStaff,
    handleEditStaff
  } = useStaff();

  return (
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
  );
};

const StaffHeaderContainer = () => {
  const { searchTerm, setSearchTerm, setIsAddDialogOpen } = useStaff();
  
  const handleAddStaffClick = () => {
    setIsAddDialogOpen(true);
  };
  
  return (
    <StaffHeader
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onAddStaffClick={handleAddStaffClick}
    />
  );
};

const StaffPageContent = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <StaffHeaderContainer />
        </CardHeader>
        <StaffContent />
      </Card>
      <StaffDialogsContainer />
    </div>
  );
};

const Staff = () => {
  return (
    <StaffProvider>
      <StaffPageContent />
    </StaffProvider>
  );
};

export default Staff;
