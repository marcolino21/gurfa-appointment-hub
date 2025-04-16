
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Client, 
  ProjectCategory, 
  StaffMember, 
  Project, 
  ProjectFormValues,
  CustomField
} from '@/types';
import { 
  projectSchema, 
  ProjectSchema
} from '../schemas/projectSchema';
import { Plus, Trash2 } from 'lucide-react';

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
  const isEditing = !!selectedProject;

  const form = useForm<ProjectSchema>({
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
      })) || [],
      startDate: selectedProject?.startDate || '',
      endDate: selectedProject?.endDate || '',
      status: selectedProject?.status || 'planning',
      progress: selectedProject?.progress || 0,
      feedback: selectedProject?.feedback || '',
      staffIds: selectedProject?.staffIds || [],
      customFields: selectedProject?.customFields || []
    }
  });

  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = 
    useFieldArray({
      control: form.control,
      name: 'objectives'
    });

  const { fields: customFields, append: appendCustomField, remove: removeCustomField } = 
    useFieldArray({
      control: form.control,
      name: 'customFields'
    });

  const watchCategoryId = form.watch('categoryId');
  const [subcategories, setSubcategories] = React.useState<ProjectCategory[]>([]);

  useEffect(() => {
    if (watchCategoryId) {
      setSubcategories(getSubcategories(watchCategoryId));
    } else {
      setSubcategories([]);
    }
  }, [watchCategoryId, getSubcategories]);

  const handleAppendObjective = () => {
    appendObjective({ description: '', isCompleted: false });
  };

  const handleAppendCustomField = () => {
    appendCustomField({
      id: `cf${Date.now()}`,
      name: '',
      type: 'text',
      value: ''
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Dettagli</TabsTrigger>
            <TabsTrigger value="objectives">Obiettivi</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="custom">Campi personalizzati</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map(client => (
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
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sottocategoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!watchCategoryId || subcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una sottocategoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map(subcategory => (
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
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrizione del progetto" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data di inizio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data di fine</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona uno stato" />
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
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="objectives" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Obiettivi del progetto</h3>
              <Button 
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAppendObjective}
              >
                <Plus className="h-4 w-4 mr-1" /> Aggiungi obiettivo
              </Button>
            </div>
            
            {objectiveFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-grow space-y-2">
                  <FormField
                    control={form.control}
                    name={`objectives.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Descrizione dell'obiettivo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`objectives.${index}.isCompleted`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Obiettivo completato
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {objectiveFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nessun obiettivo definito. Aggiungi il primo obiettivo.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="staff" className="space-y-4">
            <FormField
              control={form.control}
              name="staffIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personale coinvolto</FormLabel>
                  <div className="space-y-2">
                    {staffMembers.map(staffMember => (
                      <FormItem
                        key={staffMember.id}
                        className="flex flex-row items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox 
                            checked={field.value?.includes(staffMember.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, staffMember.id]
                                : field.value.filter(id => id !== staffMember.id);
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {staffMember.firstName} {staffMember.lastName}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Campi personalizzati</h3>
              <Button 
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAppendCustomField}
              >
                <Plus className="h-4 w-4 mr-1" /> Aggiungi campo
              </Button>
            </div>
            
            {customFields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Campo personalizzato #{index + 1}</h4>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCustomField(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome del campo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo di campo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Testo</SelectItem>
                            <SelectItem value="number">Numero</SelectItem>
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="select">Selezione</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`customFields.${index}.value`}
                  render={({ field }) => {
                    const fieldType = form.getValues(`customFields.${index}.type`);
                    
                    switch (fieldType) {
                      case 'text':
                        return (
                          <FormItem>
                            <FormLabel>Valore</FormLabel>
                            <FormControl>
                              <Input placeholder="Valore" {...field} value={field.value as string || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      case 'number':
                        return (
                          <FormItem>
                            <FormLabel>Valore</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                value={field.value as number || 0}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      case 'date':
                        return (
                          <FormItem>
                            <FormLabel>Valore</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                value={field.value as string || ''} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      case 'checkbox':
                        return (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-4">
                            <FormControl>
                              <Checkbox 
                                checked={field.value as boolean || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Valore
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        );
                      default:
                        return (
                          <FormItem>
                            <FormLabel>Valore</FormLabel>
                            <FormControl>
                              <Input placeholder="Valore" {...field} value={field.value as string || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                    }
                  }}
                />
                
                {form.getValues(`customFields.${index}.type`) === 'select' && (
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.options`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opzioni</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Opzioni separate da virgole" 
                            value={(field.value || []).join(',')}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(opt => opt.trim()))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
            
            {customFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nessun campo personalizzato definito.
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button type="submit" className="min-w-[120px]">
            {isEditing ? 'Aggiorna' : 'Crea'} progetto
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
