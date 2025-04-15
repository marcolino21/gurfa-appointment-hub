
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_SERVICES, MOCK_SERVICE_CATEGORIES, MOCK_STAFF } from '@/data/mockData';
import { Service, ServiceCategory, StaffMember } from '@/types';
import { Search, Plus, Edit, Trash2, Clock, Euro } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const serviceSchema = z.object({
  name: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  category: z.string().min(1, { message: 'La categoria è obbligatoria' }),
  description: z.string().optional(),
  duration: z.number().min(5, { message: 'La durata deve essere almeno 5 minuti' }),
  price: z.number().min(0, { message: 'Il prezzo non può essere negativo' }),
  color: z.string(),
  assignedStaffIds: z.array(z.string()),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const Services = () => {
  const { currentSalonId } = useAuth();
  const [services, setServices] = useState<Service[]>(
    currentSalonId ? MOCK_SERVICES[currentSalonId] || [] : []
  );
  const [categories, setCategories] = useState<ServiceCategory[]>(
    currentSalonId ? MOCK_SERVICE_CATEGORIES[currentSalonId] || [] : []
  );
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    currentSalonId ? MOCK_STAFF[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('dettagli');
  const { toast } = useToast();

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      duration: 30,
      price: 0,
      color: categories.length > 0 ? categories[0].color : '#9b87f5',
      assignedStaffIds: [],
    }
  });

  const filteredServices = services.filter(service => {
    return service.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const handleAddService = (data: ServiceFormValues) => {
    if (!currentSalonId) return;

    const newService: Service = {
      id: `s${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      salonId: currentSalonId
    };

    setServices([...services, newService]);
    toast({
      title: 'Servizio aggiunto',
      description: `${newService.name} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
    serviceForm.reset();
  };

  const handleEditService = (data: ServiceFormValues) => {
    if (!selectedService) return;

    const updatedServices = services.map(service => 
      service.id === selectedService.id ? { ...service, ...data } : service
    );

    setServices(updatedServices);
    toast({
      title: 'Servizio modificato',
      description: `${data.name} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    serviceForm.reset({
      name: service.name,
      category: service.category,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      color: service.color,
      assignedStaffIds: service.assignedStaffIds || [],
    });
    setActiveTab('dettagli');
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    toast({
      title: 'Servizio eliminato',
      description: 'Il servizio è stato eliminato con successo',
    });
  };

  const getDurationLabel = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return hours === 1 ? `1 ora` : `${hours} ore`;
    } else {
      return hours === 1 ? `1 ora ${mins} min` : `${hours} ore ${mins} min`;
    }
  };

  const renderServiceForm = () => (
    <Form {...serviceForm}>
      <form onSubmit={serviceForm.handleSubmit(selectedService ? handleEditService : handleAddService)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dettagli">Dettagli di base</TabsTrigger>
            <TabsTrigger value="staff">Membri del team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dettagli" className="space-y-4 mt-4">
            <FormField
              control={serviceForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome del servizio</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Es. Taglio capelli uomo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={serviceForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id}
                          >
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: category.color }} 
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colore</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          {...field} 
                          type="color" 
                          className="w-12 h-10 p-1" 
                        />
                        <Input 
                          {...field} 
                          placeholder="Codice colore" 
                          className="flex-1" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={serviceForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione (Facoltativo)</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      rows={3}
                      placeholder="Aggiungi una breve descrizione"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={serviceForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durata</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona durata" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minuti</SelectItem>
                        <SelectItem value="30">30 minuti</SelectItem>
                        <SelectItem value="45">45 minuti</SelectItem>
                        <SelectItem value="60">1 ora</SelectItem>
                        <SelectItem value="90">1 ora 30 minuti</SelectItem>
                        <SelectItem value="120">2 ore</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={serviceForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          step="0.01"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8" 
                          placeholder="0.00" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Membri del team richiesti</h3>
              <p className="text-sm text-muted-foreground">
                Scegli quali membri del team offriranno questo servizio
              </p>
            </div>

            <div className="border rounded-md p-4">
              <FormField
                control={serviceForm.control}
                name="assignedStaffIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <Checkbox 
                        id="select-all" 
                        onCheckedChange={(checked) => {
                          const allStaffIds = staffMembers.map(staff => staff.id);
                          if (checked) {
                            serviceForm.setValue('assignedStaffIds', allStaffIds);
                          } else {
                            serviceForm.setValue('assignedStaffIds', []);
                          }
                        }} 
                        checked={
                          serviceForm.getValues('assignedStaffIds').length === staffMembers.length
                        }
                      />
                      <label
                        htmlFor="select-all"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tutti i membri del team ({staffMembers.length})
                      </label>
                    </div>

                    <div className="space-y-4">
                      {staffMembers.map((staff) => (
                        <FormField
                          key={staff.id}
                          control={serviceForm.control}
                          name="assignedStaffIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(staff.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, staff.id]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (value) => value !== staff.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: staff.color || '#9b87f5' }}
                                  >
                                    {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                                  </div>
                                  <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {staff.firstName} {staff.lastName}
                                  </label>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{selectedService ? 'Salva modifiche' : 'Aggiungi servizio'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servizi</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca servizio..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedService(null);
              serviceForm.reset({
                name: '',
                category: categories.length > 0 ? categories[0].id : '',
                description: '',
                duration: 30,
                price: 0,
                color: categories.length > 0 ? categories[0].color : '#9b87f5',
                assignedStaffIds: [],
              });
              setActiveTab('dettagli');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi servizio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Durata</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Personale</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: service.color }} 
                        />
                        {service.name}
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(service.category)}</TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getDurationLabel(service.duration)}
                    </TableCell>
                    <TableCell>€ {service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {service.assignedStaffIds?.length || 0} membri
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {searchTerm ? 'Nessun servizio trovato' : 'Nessun servizio disponibile'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuovo servizio</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo servizio
            </DialogDescription>
          </DialogHeader>
          {renderServiceForm()}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica servizio</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del servizio
            </DialogDescription>
          </DialogHeader>
          {renderServiceForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
