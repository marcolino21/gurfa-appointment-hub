
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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_STAFF, MOCK_SERVICES } from '@/data/mockData';
import { StaffMember, Service } from '@/types';
import { Search, Plus, Edit, Trash2, Calendar, XCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const staffSchema = z.object({
  firstName: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Email non valida' }),
  phone: z.string().optional(),
  additionalPhone: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
  position: z.string().optional(),
  color: z.string(),
  isActive: z.boolean().default(true),
  showInCalendar: z.boolean().default(true),
  assignedServiceIds: z.array(z.string()),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const Staff = () => {
  const { currentSalonId } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    currentSalonId ? MOCK_STAFF[currentSalonId] || [] : []
  );
  const [services, setServices] = useState<Service[]>(
    currentSalonId ? MOCK_SERVICES[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeTab, setActiveTab] = useState('profilo');
  const { toast } = useToast();

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalPhone: '',
      country: 'Italia',
      birthDate: '',
      position: '',
      color: '#9b87f5',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: [],
    }
  });

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAddStaff = (data: StaffFormValues) => {
    if (!currentSalonId) return;

    // Create staff with required fields explicitly defined
    const newStaff: StaffMember = {
      id: `staff${Math.random().toString(36).substr(2, 9)}`,
      firstName: data.firstName,
      lastName: data.lastName || '', // Ensure it's never undefined
      email: data.email,
      isActive: data.isActive,
      showInCalendar: data.showInCalendar, 
      salonId: currentSalonId,
      // Optional fields
      phone: data.phone,
      additionalPhone: data.additionalPhone,
      country: data.country,
      birthDate: data.birthDate,
      position: data.position, 
      color: data.color,
      assignedServiceIds: data.assignedServiceIds,
    };

    setStaffMembers([...staffMembers, newStaff]);
    toast({
      title: 'Membro dello staff aggiunto',
      description: `${newStaff.firstName} ${newStaff.lastName} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
    staffForm.reset();
  };

  const handleEditStaff = (data: StaffFormValues) => {
    if (!selectedStaff) return;

    const updatedStaff = staffMembers.map(staff => 
      staff.id === selectedStaff.id ? {
        ...staff,
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        isActive: data.isActive,
        showInCalendar: data.showInCalendar,
        phone: data.phone,
        additionalPhone: data.additionalPhone,
        country: data.country,
        birthDate: data.birthDate,
        position: data.position,
        color: data.color,
        assignedServiceIds: data.assignedServiceIds,
      } : staff
    );

    setStaffMembers(updatedStaff);
    toast({
      title: 'Membro dello staff modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    staffForm.reset({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phone: staff.phone || '',
      additionalPhone: staff.additionalPhone || '',
      country: staff.country || 'Italia',
      birthDate: staff.birthDate || '',
      position: staff.position || '',
      color: staff.color || '#9b87f5',
      isActive: staff.isActive,
      showInCalendar: staff.showInCalendar,
      assignedServiceIds: staff.assignedServiceIds || [],
    });
    setActiveTab('profilo');
    setIsEditDialogOpen(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
    setStaffMembers(updatedStaff);
    toast({
      title: 'Membro dello staff eliminato',
      description: 'Il membro dello staff è stato eliminato con successo',
    });
  };

  const toggleStaffStatus = (staffId: string, isActive: boolean) => {
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, isActive } : staff
    );
    setStaffMembers(updatedStaff);
    
    toast({
      title: isActive ? 'Membro dello staff attivato' : 'Membro dello staff disattivato',
      description: `Il membro dello staff è stato ${isActive ? 'attivato' : 'disattivato'} con successo`,
    });
  };

  const toggleCalendarVisibility = (staffId: string, showInCalendar: boolean) => {
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, showInCalendar } : staff
    );
    setStaffMembers(updatedStaff);
    
    toast({
      title: showInCalendar ? 'Visibile in agenda' : 'Nascosto dall\'agenda',
      description: `Il membro dello staff sarà ${showInCalendar ? 'visibile' : 'nascosto'} nell'agenda`,
    });
  };

  const getInitials = (firstName: string, lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const renderStaffForm = () => (
    <Form {...staffForm}>
      <form onSubmit={staffForm.handleSubmit(selectedStaff ? handleEditStaff : handleAddStaff)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="profilo">Profilo</TabsTrigger>
            <TabsTrigger value="servizi">Servizi</TabsTrigger>
            <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profilo" className="space-y-4 mt-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-medium"
                  style={{ backgroundColor: staffForm.watch('color') }}
                >
                  {getInitials(staffForm.watch('firstName'), staffForm.watch('lastName'))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={staffForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={staffForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cognome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cognome" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={staffForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero di telefono</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Numero di telefono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="additionalPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero di telefono aggiuntivo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Numero di telefono aggiuntivo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di nascita</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="servizi" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Servizi offerti</h3>
              <p className="text-sm text-muted-foreground">
                Seleziona i servizi che questo membro dello staff può offrire
              </p>
            </div>

            <div className="border rounded-md p-4">
              <FormField
                control={staffForm.control}
                name="assignedServiceIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <Checkbox 
                        id="select-all-services" 
                        onCheckedChange={(checked) => {
                          const allServiceIds = services.map(service => service.id);
                          if (checked) {
                            staffForm.setValue('assignedServiceIds', allServiceIds);
                          } else {
                            staffForm.setValue('assignedServiceIds', []);
                          }
                        }} 
                        checked={
                          services.length > 0 &&
                          staffForm.getValues('assignedServiceIds').length === services.length
                        }
                      />
                      <label
                        htmlFor="select-all-services"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tutti i servizi ({services.length})
                      </label>
                    </div>

                    <div className="space-y-4">
                      {services.map((service) => (
                        <FormField
                          key={service.id}
                          control={staffForm.control}
                          name="assignedServiceIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, service.id]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-1" 
                                    style={{ backgroundColor: service.color }} 
                                  />
                                  <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {service.name}
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

          <TabsContent value="impostazioni" className="space-y-4 mt-4">
            <FormField
              control={staffForm.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posizione lavorativa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Es. Parrucchiere, Estetista..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore calendario</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        {...field} 
                        type="color" 
                        className="w-12 h-10 p-1" 
                      />
                      <Input 
                        {...field} 
                        className="flex-1" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Profilo attivo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value 
                        ? "Il membro dello staff è attivo e può accedere al sistema" 
                        : "Il membro dello staff è disattivato e non può accedere al sistema"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={staffForm.control}
              name="showInCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visibile in agenda</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value 
                        ? "Il membro dello staff è visibile nella vista agenda" 
                        : "Il membro dello staff è nascosto nella vista agenda"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{selectedStaff ? 'Salva modifiche' : 'Aggiungi membro'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca membro dello staff..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedStaff(null);
              staffForm.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                additionalPhone: '',
                country: 'Italia',
                birthDate: '',
                position: '',
                color: '#9b87f5',
                isActive: true,
                showInCalendar: true,
                assignedServiceIds: [],
              });
              setActiveTab('profilo');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Posizione</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: staffMember.color || '#9b87f5' }}
                        >
                          {getInitials(staffMember.firstName, staffMember.lastName)}
                        </div>
                        <div>
                          <p className="font-medium">{staffMember.firstName} {staffMember.lastName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone || '-'}</TableCell>
                    <TableCell>{staffMember.position || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          staffMember.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {staffMember.isActive ? "Attivo" : "Disattivato"}
                        </span>
                        {staffMember.isActive && (
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            staffMember.showInCalendar 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {staffMember.showInCalendar ? "Visibile in agenda" : "Nascosto dall'agenda"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(staffMember)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleCalendarVisibility(staffMember.id, !staffMember.showInCalendar)}
                          title={staffMember.showInCalendar ? "Nascondi dall'agenda" : "Mostra in agenda"}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleStaffStatus(staffMember.id, !staffMember.isActive)}
                          title={staffMember.isActive ? "Disattiva" : "Attiva"}
                        >
                          {staffMember.isActive 
                            ? <XCircle className="h-4 w-4" /> 
                            : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(staffMember.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {searchTerm ? 'Nessun membro dello staff trovato' : 'Nessun membro dello staff disponibile'}
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
            <DialogTitle>Aggiungi membro del team</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo membro del team
            </DialogDescription>
          </DialogHeader>
          {renderStaffForm()}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica membro del team</DialogTitle>
            <DialogDescription>
              Modifica i dati del membro del team
            </DialogDescription>
          </DialogHeader>
          {renderStaffForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
