import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, StaffMember, ProjectFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { CustomCategoryField } from './CustomCategoryField';

interface ProjectFormProps {
  clients: Client[];
  categories: ProjectCategory[];
  getSubcategories: (categoryId: string) => ProjectCategory[];
  staffMembers: StaffMember[];
  selectedProject: Project | null;
  onSubmit: (data: ProjectFormValues) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  clients,
  categories,
  getSubcategories,
  staffMembers,
  selectedProject,
  onSubmit
}) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: selectedProject?.title || '',
      clientId: selectedProject?.clientId || '',
      categoryId: selectedProject?.categoryId || '',
      subcategoryId: selectedProject?.subcategoryId || '',
      description: selectedProject?.description || '',
      objectives: selectedProject?.objectives.map(obj => ({
        description: obj.description,
        isCompleted: obj.isCompleted
      })) || [{ description: '', isCompleted: false }],
      startDate: selectedProject?.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: selectedProject?.endDate || '',
      status: selectedProject?.status || 'planning',
      progress: selectedProject?.progress || 0,
      feedback: selectedProject?.feedback || '',
      staffIds: selectedProject?.staffIds || [],
      customFields: selectedProject?.customFields || [],
      customCategory: '',
    }
  });

  // Check if there's a clientId in the URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get('clientId');
    
    if (clientId) {
      form.setValue('clientId', clientId);
    }
  }, [location.search, form]);

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        title: selectedProject.title,
        clientId: selectedProject.clientId,
        categoryId: selectedProject.categoryId,
        subcategoryId: selectedProject.subcategoryId,
        description: selectedProject.description,
        objectives: selectedProject.objectives.map(obj => ({
          description: obj.description,
          isCompleted: obj.isCompleted
        })),
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate,
        status: selectedProject.status,
        progress: selectedProject.progress,
        feedback: selectedProject.feedback,
        staffIds: selectedProject.staffIds,
        customFields: selectedProject.customFields,
        customCategory: ''
      });
      
      if (selectedProject.categoryId) {
        setSelectedCategory(selectedProject.categoryId);
        setSubcategories(getSubcategories(selectedProject.categoryId));
      }
    }
  }, [selectedProject, form, getSubcategories]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('categoryId', value);
    form.setValue('subcategoryId', '');
    
    if (value && !useCustomCategory) {
      const newSubcategories = getSubcategories(value);
      setSubcategories(newSubcategories);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubmit = (data: ProjectFormValues) => {
    // If using custom category, set it as the category
    if (useCustomCategory && data.customCategory) {
      data.categoryId = data.customCategory;
    }
    onSubmit(data);
  };

  const addObjective = () => {
    const objectives = form.getValues('objectives') || [];
    form.setValue('objectives', [...objectives, { description: '', isCompleted: false }]);
  };

  const removeObjective = (index: number) => {
    const objectives = form.getValues('objectives');
    form.setValue('objectives', objectives.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="Titolo del progetto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <CustomCategoryField
          form={form}
          categories={categories}
          useCustomCategory={useCustomCategory}
          setUseCustomCategory={setUseCustomCategory}
        />

        {!useCustomCategory && selectedCategory && (
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sottocategoria</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedCategory || subcategories.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona sottocategoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione del progetto"
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Obiettivi</FormLabel>
          {form.watch('objectives')?.map((_, index) => (
            <div key={index} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`objectives.${index}.isCompleted`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`objectives.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Descrizione obiettivo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeObjective(index)}
                disabled={form.watch('objectives').length <= 1}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addObjective}
          >
            Aggiungi obiettivo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data di inizio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), 'dd/MM/yyyy')
                        ) : (
                          <span>Seleziona data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data di fine</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), 'dd/MM/yyyy')
                        ) : (
                          <span>Seleziona data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stato</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planning">In Pianificazione</SelectItem>
                  <SelectItem value="in_progress">In Corso</SelectItem>
                  <SelectItem value="completed">Completato</SelectItem>
                  <SelectItem value="cancelled">Annullato</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback / Risultati</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Feedback del cliente o risultati del progetto"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {selectedProject ? 'Aggiorna Progetto' : 'Crea Progetto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
