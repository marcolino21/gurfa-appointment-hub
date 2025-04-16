
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter 
} from 'lucide-react';

import { useProjectsData } from '@/features/projects/hooks/useProjectsData';
import ProjectsTable from '@/features/projects/components/ProjectsTable';
import ProjectForm from '@/features/projects/components/ProjectForm';
import DeleteProjectDialog from '@/features/projects/components/DeleteProjectDialog';
import { Project } from '@/types';
import { MOCK_STAFF } from '@/data/mockData';

const Projects = () => {
  const {
    filteredProjects,
    clients,
    categories,
    getSubcategories,
    getClientById,
    getCategoryById,
    getSubcategoryById,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchByClient,
    setSearchByClient,
    searchByTitle,
    setSearchByTitle,
    searchById,
    setSearchById,
    selectedProject,
    setSelectedProject,
    handleAddProject,
    handleEditProject,
    handleDeleteProject,
    handleToggleObjective
  } = useProjectsData();

  const { currentSalonId } = useAuth();
  const staffMembers = currentSalonId ? MOCK_STAFF[currentSalonId] || [] : [];
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjectIds(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };
  
  const handleOpenEditDialog = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedProject) {
      handleDeleteProject(selectedProject.id);
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };
  
  const handleViewDetails = (project: Project) => {
    // Toggle expansion state
    toggleProjectExpansion(project.id);
  };

  // Check for client ID in query params (for "Create Project" from client page)
  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('clientId');
    
    if (clientId && location.pathname === '/progetti/nuovo') {
      // Open the add dialog with pre-selected client
      setSelectedProject(null);
      setIsAddDialogOpen(true);
      // Remove the query param
      navigate('/progetti', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Progetti</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca progetto..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => {
              setSelectedProject(null);
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Nuovo progetto
            </Button>
          </div>
        </CardHeader>
        
        {isFiltersOpen && (
          <div className="px-6 py-2 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Stato</label>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtra per stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="planning">In Pianificazione</SelectItem>
                    <SelectItem value="in_progress">In Corso</SelectItem>
                    <SelectItem value="completed">Completati</SelectItem>
                    <SelectItem value="cancelled">Annullati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Categoria</label>
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtra per categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le categorie</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium block">Cerca per</label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="searchByClient"
                      checked={searchByClient}
                      onCheckedChange={(checked) => setSearchByClient(checked === true)}
                    />
                    <label 
                      htmlFor="searchByClient" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Nome cliente
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="searchByTitle"
                      checked={searchByTitle}
                      onCheckedChange={(checked) => setSearchByTitle(checked === true)}
                    />
                    <label 
                      htmlFor="searchByTitle" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Titolo progetto
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="searchById"
                      checked={searchById}
                      onCheckedChange={(checked) => setSearchById(checked === true)}
                    />
                    <label 
                      htmlFor="searchById" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      ID progetto
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="pt-6">
          <ProjectsTable 
            projects={filteredProjects}
            getClientById={getClientById}
            getCategoryById={getCategoryById}
            getSubcategoryById={getSubcategoryById}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onViewDetails={handleViewDetails}
            expandedProjectIds={expandedProjectIds}
            toggleProjectExpansion={toggleProjectExpansion}
            onToggleObjective={handleToggleObjective}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Nuovo progetto</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo progetto
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            clients={clients}
            categories={categories}
            getSubcategories={getSubcategories}
            staffMembers={staffMembers}
            selectedProject={null}
            onSubmit={(data) => {
              handleAddProject(data);
              setIsAddDialogOpen(false);
              toast({
                title: "Progetto creato",
                description: "Il nuovo progetto è stato creato con successo",
              });
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifica progetto</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del progetto
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm
              clients={clients}
              categories={categories}
              getSubcategories={getSubcategories}
              staffMembers={staffMembers}
              selectedProject={selectedProject}
              onSubmit={(data) => {
                handleEditProject(data);
                setIsEditDialogOpen(false);
                toast({
                  title: "Progetto aggiornato",
                  description: "Il progetto è stato aggiornato con successo",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {selectedProject && (
        <DeleteProjectDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
};

export default Projects;
