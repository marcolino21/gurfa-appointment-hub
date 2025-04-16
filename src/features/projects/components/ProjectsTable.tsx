import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Project, Client, ProjectCategory } from '@/types';
import { Edit, Trash2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProjectsTableProps {
  projects: Project[];
  getClientById: (clientId: string) => Client | undefined;
  getCategoryById: (categoryId: string) => ProjectCategory | undefined;
  getSubcategoryById: (categoryId: string, subcategoryId: string) => ProjectCategory | undefined;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewDetails: (project: Project) => void;
  expandedProjectIds: string[];
  toggleProjectExpansion: (projectId: string) => void;
  onToggleObjective: (projectId: string, objectiveId: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects,
  getClientById,
  getCategoryById,
  getSubcategoryById,
  onEdit,
  onDelete,
  onViewDetails,
  expandedProjectIds,
  toggleProjectExpansion,
  onToggleObjective
}) => {
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'In Pianificazione';
      case 'in_progress': return 'In Corso';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Annullato';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Titolo</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Avanzamento</TableHead>
          <TableHead>Data Inizio</TableHead>
          <TableHead>Data Fine</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length > 0 ? (
          projects.map((project) => {
            const client = getClientById(project.clientId);
            const category = getCategoryById(project.categoryId);
            const subcategory = project.subcategoryId 
              ? getSubcategoryById(project.categoryId, project.subcategoryId) 
              : undefined;
            const isExpanded = expandedProjectIds.includes(project.id);
            
            return (
              <React.Fragment key={project.id}>
                <TableRow className="border-b">
                  <TableCell className="p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleProjectExpansion(project.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    {client ? `${client.firstName} ${client.lastName}` : 'Cliente non trovato'}
                  </TableCell>
                  <TableCell>
                    {category?.name}
                    {subcategory ? ` / ${subcategory.name}` : ''}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-[60px]" />
                      <span>{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onViewDetails(project)}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-4 bg-gray-50">
                      <div className="space-y-4">
                        {project.description && (
                          <div>
                            <h4 className="font-semibold mb-1">Descrizione:</h4>
                            <p className="text-sm">{project.description}</p>
                          </div>
                        )}
                        
                        {project.objectives.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Obiettivi:</h4>
                            <ul className="space-y-2">
                              {project.objectives.map((objective) => (
                                <li key={objective.id} className="flex items-start gap-2 text-sm">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-5 w-5 rounded-full ${objective.isCompleted ? 'text-green-600' : 'text-gray-400'}`}
                                    onClick={() => onToggleObjective(project.id, objective.id)}
                                  >
                                    <CheckCircle2 className="h-5 w-5" />
                                  </Button>
                                  <span className={objective.isCompleted ? 'line-through text-gray-500' : ''}>
                                    {objective.description}
                                    {objective.completedAt && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        (Completato il {formatDate(objective.completedAt)})
                                      </span>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {project.feedback && (
                          <div>
                            <h4 className="font-semibold mb-1">Feedback:</h4>
                            <p className="text-sm">{project.feedback}</p>
                          </div>
                        )}
                        
                        {project.customFields.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Campi personalizzati:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {project.customFields.map((field) => (
                                <div key={field.id} className="flex">
                                  <span className="font-medium">{field.name}:</span>
                                  <span className="ml-1">{String(field.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              Nessun progetto disponibile
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;
