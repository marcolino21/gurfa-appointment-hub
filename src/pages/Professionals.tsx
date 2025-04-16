
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalsHeader from '@/features/professionals/components/ProfessionalsHeader';
import ProfessionalsList from '@/features/professionals/components/ProfessionalsList';
import DeleteProfessionalDialog from '@/features/professionals/components/DeleteProfessionalDialog';
import { useProfessionalsData } from '@/features/professionals/hooks/useProfessionalsData';

const Professionals = () => {
  const { currentSalonId } = useAuth();
  const {
    professionals,
    searchTerm,
    setSearchTerm,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProfessional,
    handleToggleActive,
    handleDelete,
    handleEdit,
    openDeleteDialog
  } = useProfessionalsData(currentSalonId);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <ProfessionalsHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </CardHeader>
        <CardContent>
          <ProfessionalsList
            professionals={professionals}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <DeleteProfessionalDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        professional={selectedProfessional}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Professionals;
