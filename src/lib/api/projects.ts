
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectFormValues } from '@/types';
import { MOCK_PROJECTS } from '@/data/mock/projects';

/**
 * Creates a new project
 * @param projectData The project data to create
 * @returns The created project
 */
export const createProject = async (projectData: ProjectFormValues & { salonId: string }): Promise<Project> => {
  const { salonId, ...data } = projectData;

  // Create a new project with generated ID and timestamps
  const newProject: Project = {
    id: uuidv4(),
    title: data.title,
    clientId: data.clientId,
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    description: data.description,
    objectives: data.objectives.map(obj => ({
      id: uuidv4(),
      description: obj.description,
      isCompleted: obj.isCompleted,
      projectId: '',  // Will be updated below
    })),
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    progress: data.progress || 0,
    feedback: data.feedback || '',
    staffIds: data.staffIds || [],
    attachments: [],
    customFields: data.customFields || [],
    salonId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update projectId for objectives
  newProject.objectives.forEach(obj => {
    obj.projectId = newProject.id;
  });

  // In a real application, this would be an API call to a backend
  // For now, we're using mock data
  if (!MOCK_PROJECTS[salonId]) {
    MOCK_PROJECTS[salonId] = [];
  }
  
  MOCK_PROJECTS[salonId].push(newProject);
  
  return newProject;
};

/**
 * Updates an existing project
 * @param projectId The ID of the project to update
 * @param projectData The updated project data
 * @returns The updated project
 */
export const updateProject = async (
  projectId: string, 
  projectData: Partial<ProjectFormValues> & { salonId: string }
): Promise<Project> => {
  const { salonId } = projectData;
  
  if (!MOCK_PROJECTS[salonId]) {
    throw new Error('Salon not found');
  }
  
  const projectIndex = MOCK_PROJECTS[salonId].findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }
  
  const existingProject = MOCK_PROJECTS[salonId][projectIndex];
  
  // Update project with new data
  const updatedProject = {
    ...existingProject,
    ...projectData,
    updatedAt: new Date().toISOString(),
  };
  
  MOCK_PROJECTS[salonId][projectIndex] = updatedProject as Project;
  
  return updatedProject as Project;
};

/**
 * Deletes a project
 * @param projectId The ID of the project to delete
 * @param salonId The ID of the salon
 */
export const deleteProject = async (projectId: string, salonId: string): Promise<void> => {
  if (!MOCK_PROJECTS[salonId]) {
    throw new Error('Salon not found');
  }
  
  const projectIndex = MOCK_PROJECTS[salonId].findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }
  
  MOCK_PROJECTS[salonId].splice(projectIndex, 1);
};

/**
 * Gets all projects for a salon
 * @param salonId The ID of the salon
 * @returns Array of projects for the salon
 */
export const getSalonProjects = async (salonId: string): Promise<Project[]> => {
  return MOCK_PROJECTS[salonId] || [];
};

/**
 * Gets a specific project by ID
 * @param projectId The ID of the project to get
 * @param salonId The ID of the salon
 * @returns The project if found
 */
export const getProjectById = async (projectId: string, salonId: string): Promise<Project | null> => {
  if (!MOCK_PROJECTS[salonId]) {
    return null;
  }
  
  return MOCK_PROJECTS[salonId].find(p => p.id === projectId) || null;
};
