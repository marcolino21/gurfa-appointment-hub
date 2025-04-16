
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_PROJECTS, MOCK_PROJECT_CATEGORIES, MOCK_PROJECT_SUBCATEGORIES, MOCK_CLIENTS } from '@/data/mockData';
import { Project, Client, ProjectCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ProjectFormValues } from '@/types';

export const useProjectsData = () => {
  const { currentSalonId } = useAuth();
  const [projects, setProjects] = useState<Project[]>(
    currentSalonId ? MOCK_PROJECTS[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchByClient, setSearchByClient] = useState(true);
  const [searchByTitle, setSearchByTitle] = useState(true);
  const [searchById, setSearchById] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  
  const clients = useMemo(() => {
    return currentSalonId ? MOCK_CLIENTS[currentSalonId] || [] : [];
  }, [currentSalonId]);
  
  const categories = useMemo(() => {
    return currentSalonId ? MOCK_PROJECT_CATEGORIES[currentSalonId] || [] : [];
  }, [currentSalonId]);
  
  const getSubcategories = (categoryId: string): ProjectCategory[] => {
    return MOCK_PROJECT_SUBCATEGORIES[categoryId] || [];
  };

  const getClientById = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
  };

  const getCategoryById = (categoryId: string): ProjectCategory | undefined => {
    return categories.find(category => category.id === categoryId);
  };

  const getSubcategoryById = (categoryId: string, subcategoryId: string): ProjectCategory | undefined => {
    const subcategories = getSubcategories(categoryId);
    return subcategories.find(subcategory => subcategory.id === subcategoryId);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || project.categoryId === categoryFilter;
      
      let matchesSearch = true;
      if (searchTerm) {
        matchesSearch = false;
        
        if (searchByClient) {
          const client = getClientById(project.clientId);
          if (client) {
            const clientFullName = `${client.firstName} ${client.lastName}`.toLowerCase();
            if (clientFullName.includes(searchTerm.toLowerCase())) {
              matchesSearch = true;
            }
          }
        }
        
        if (!matchesSearch && searchByTitle) {
          if (project.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            matchesSearch = true;
          }
        }
        
        if (!matchesSearch && searchById) {
          if (project.id.toLowerCase().includes(searchTerm.toLowerCase())) {
            matchesSearch = true;
          }
        }
      }
      
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, searchTerm, statusFilter, categoryFilter, searchByClient, searchByTitle, searchById]);

  const calculateProjectProgress = (project: Project): number => {
    if (project.objectives.length === 0) return 0;
    
    const completedObjectives = project.objectives.filter(obj => obj.isCompleted).length;
    return Math.round((completedObjectives / project.objectives.length) * 100);
  };

  const handleAddProject = (data: ProjectFormValues) => {
    if (!currentSalonId) return;

    const newProject: Project = {
      id: `p${Date.now()}`,
      title: data.title,
      clientId: data.clientId,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      description: data.description,
      objectives: data.objectives.map((obj, index) => ({
        id: `o${Date.now()}_${index}`,
        description: obj.description,
        isCompleted: obj.isCompleted,
        projectId: `p${Date.now()}`
      })),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      progress: calculateProjectProgress({
        ...data, 
        id: '', 
        objectives: data.objectives.map((obj, index) => ({
          id: '', 
          description: obj.description, 
          isCompleted: obj.isCompleted,
          projectId: ''
        })),
        attachments: [],
        salonId: '',
        createdAt: '',
        updatedAt: ''
      }),
      feedback: data.feedback,
      staffIds: data.staffIds,
      attachments: [],
      customFields: data.customFields,
      salonId: currentSalonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProject]);
    
    toast({
      title: "Progetto aggiunto",
      description: "Il progetto è stato creato con successo",
    });
    
    return newProject;
  };

  const handleEditProject = (data: ProjectFormValues) => {
    if (!selectedProject) return;

    const updatedProject: Project = {
      ...selectedProject,
      title: data.title,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      description: data.description,
      objectives: data.objectives.map((obj, index) => {
        const existingObjective = selectedProject.objectives[index];
        return {
          id: existingObjective ? existingObjective.id : `o${Date.now()}_${index}`,
          description: obj.description,
          isCompleted: obj.isCompleted,
          completedAt: obj.isCompleted ? existingObjective?.completedAt || new Date().toISOString() : undefined,
          projectId: selectedProject.id
        };
      }),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      progress: data.progress,
      feedback: data.feedback,
      staffIds: data.staffIds,
      customFields: data.customFields,
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => 
      prev.map(project => 
        project.id === selectedProject.id ? updatedProject : project
      )
    );
    
    toast({
      title: "Progetto aggiornato",
      description: "Il progetto è stato aggiornato con successo",
    });
    
    return updatedProject;
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    toast({
      title: "Progetto eliminato",
      description: "Il progetto è stato eliminato con successo",
    });
  };

  const handleToggleObjective = (projectId: string, objectiveId: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id !== projectId) return project;
        
        const updatedObjectives = project.objectives.map(objective => {
          if (objective.id !== objectiveId) return objective;
          
          return {
            ...objective,
            isCompleted: !objective.isCompleted,
            completedAt: !objective.isCompleted ? new Date().toISOString() : undefined
          };
        });
        
        const progress = Math.round(
          (updatedObjectives.filter(obj => obj.isCompleted).length / updatedObjectives.length) * 100
        );
        
        return {
          ...project,
          objectives: updatedObjectives,
          progress,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  return {
    projects,
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
  };
};
