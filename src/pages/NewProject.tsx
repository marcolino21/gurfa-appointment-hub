import React from 'react';
import ProjectForm from '@/features/projects/components/ProjectForm';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalonClients } from '@/features/clients/utils/clientDataUtils';
import { getSalonProjectCategories, getProjectCategorySubcategories } from '@/features/projects/utils/projectCategoryDataUtils';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';
import { createProject, updateProject } from '@/lib/api/projects';

const NewProject = () => {
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch clients, categories, and staff members using react-query
  const { data: clients = [], isLoading: isLoadingClients } = useQuery(
    ['clients', currentSalonId],
    () => getSalonClients(currentSalonId || ''),
    { enabled: !!currentSalonId }
  );

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery(
    ['projectCategories', currentSalonId],
    () => getSalonProjectCategories(currentSalonId || ''),
    { enabled: !!currentSalonId }
  );

  const getSubcategories = (categoryId: string) => {
    const { data: subcategories = [] } = useQuery(
      ['projectCategorySubcategories', categoryId],
      () => getProjectCategorySubcategories(categoryId),
      { enabled: !!categoryId }
    );
    return subcategories;
  };

  const { data: staffMembers = [], isLoading: isLoadingStaff } = useQuery(
    ['staffMembers', currentSalonId],
    () => getSalonStaff(currentSalonId || ''),
    { enabled: !!currentSalonId }
  );

  // Mutation for creating a new project
  const createProjectMutation = useMutation(createProject, {
    onSuccess: () => {
      toast({
        title: "Progetto creato!",
        description: "Il progetto è stato creato con successo.",
      });
      queryClient.invalidateQueries(['projects', currentSalonId]);
      navigate('/projects');
    },
    onError: (error: any) => {
      toast({
        title: "Errore nella creazione del progetto",
        description: error.message || "Si è verificato un errore durante la creazione del progetto.",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  const handleSubmit = async (data: any) => {
    if (!currentSalonId) {
      toast({
        title: "Errore",
        description: "ID del salone non trovato.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({ ...data, salonId: currentSalonId });
  };

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <ProjectForm
              clients={clients}
              categories={categories}
              getSubcategories={getSubcategories}
              staffMembers={staffMembers}
              selectedProject={null}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProject;
