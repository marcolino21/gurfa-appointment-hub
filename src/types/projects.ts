
export interface ProjectCategory {
  id: string;
  name: string;
  parentId?: string | null; // If null, it's a root category
  salonId: string;
}

export interface ProjectObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  projectId: string;
}

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  projectId: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  value: string | number | boolean | Date | null;
  options?: string[]; // For select type
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  objectives: ProjectObjective[];
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  progress: number; // 0-100
  feedback?: string;
  staffIds: string[];
  attachments: ProjectAttachment[];
  customFields: CustomField[];
  salonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormValues {
  title: string;
  clientId: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  objectives: { description: string; isCompleted: boolean }[];
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  feedback?: string;
  staffIds: string[];
  customFields: CustomField[];
}
