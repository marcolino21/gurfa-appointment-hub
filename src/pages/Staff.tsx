import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { StaffProvider } from '@/features/staff/contexts/StaffContext';
import StaffHeader from '@/features/staff/components/StaffHeader';
import StaffContent from '@/features/staff/components/StaffContent';
import StaffDialogs from '@/features/staff/components/StaffDialogs';
import { useStaff } from '@/features/staff/contexts/StaffContext';

// This component is wrapped with StaffProvider
const StaffPageContent = () => {
  console.log('DEBUG - StaffPageContent render');
  const {
    staffMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedStaff,
    services,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    handleToggleStatus,
    handleToggleCalendarVisibility,
    hasSalon,
    setSelectedStaff
  } = useStaff();

  // Handle adding a new staff member
  const handleAddStaffClick = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <StaffHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddStaffClick={handleAddStaffClick}
          />
        </CardHeader>
        <StaffContent />
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

// Main component that wraps everything with the provider
const Staff = () => {
  return (
    <StaffProvider>
      <StaffPageContent />
    </StaffProvider>
  );
};

export default Staff;
