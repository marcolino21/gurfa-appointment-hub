
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_CLIENTS } from '@/data/mockData';
import { Client } from '@/types';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const clientSchema = z.object({
  firstName: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().min(1, { message: 'Il cognome è obbligatorio' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email non valida' }).optional().or(z.literal('')),
  gender: z.enum(['M', 'F', 'O']),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  fiscalCode: z.string().optional(),
  loyaltyCode: z.string().optional(),
  notes: z.string().optional(),
  isPrivate: z.boolean(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const Clients = () => {
  const { currentSalonId } = useAuth();
  const [clients, setClients] = useState<Client[]>(
    currentSalonId ? MOCK_CLIENTS[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('dati-personali');
  const { toast } = useToast();

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: 'F',
      address: '',
      city: '',
      zipCode: '',
      dateOfBirth: '',
      fiscalCode: '',
      loyaltyCode: '',
      notes: '',
      isPrivate: true,
    }
  });

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAddClient = (data: ClientFormValues) => {
    if (!currentSalonId) return;

    const newClient: Client = {
      id: `c${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      salonId: currentSalonId
    };

    setClients([...clients, newClient]);
    toast({
      title: 'Cliente aggiunto',
      description: `${newClient.firstName} ${newClient.lastName} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
    clientForm.reset();
  };

  const handleEditClient = (data: ClientFormValues) => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? { ...client, ...data } : client
    );

    setClients(updatedClients);
    toast({
      title: 'Cliente modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    clientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone || '',
      email: client.email || '',
      gender: client.gender,
      address: client.address || '',
      city: client.city || '',
      zipCode: client.zipCode || '',
      dateOfBirth: client.dateOfBirth || '',
      fiscalCode: client.fiscalCode || '',
      loyaltyCode: client.loyaltyCode || '',
      notes: client.notes || '',
      isPrivate: client.isPrivate,
    });
    setActiveTab('dati-personali');
    setIsEditDialogOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    toast({
      title: 'Cliente eliminato',
      description: 'Il cliente è stato eliminato con successo',
    });
  };

  const renderClientForm = () => (
    <Form {...clientForm}>
      <form onSubmit={clientForm.handleSubmit(selectedClient ? handleEditClient : handleAddClient)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dati-personali">Dati Personali</TabsTrigger>
            <TabsTrigger value="dettagli-aggiuntivi">Dettagli Aggiuntivi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dati-personali" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 flex justify-center items-start">
                <div className="flex items-center gap-2">
                  <FormField
                    control={clientForm.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex gap-4">
                        <FormLabel>Tipo cliente</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'privato')}
                            defaultValue={field.value ? 'privato' : 'azienda'}
                            className="flex"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="privato" id="privato" />
                              <label htmlFor="privato">Privato</label>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <RadioGroupItem value="azienda" id="azienda" />
                              <label htmlFor="azienda">Azienda</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
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

                <FormField
                  control={clientForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indirizzo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Indirizzo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Città" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CAP" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={clientForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Telefono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={clientForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sesso</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="M" id="M" />
                          <label htmlFor="M">M</label>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <RadioGroupItem value="F" id="F" />
                          <label htmlFor="F">F</label>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <RadioGroupItem value="O" id="O" />
                          <label htmlFor="O">Altro</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="dettagli-aggiuntivi" className="space-y-4 mt-4">
            <FormField
              control={clientForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di nascita</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" placeholder="GG/MM/AAAA" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={clientForm.control}
              name="fiscalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice fiscale</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Codice fiscale" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={clientForm.control}
              name="loyaltyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice tessera</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Codice tessera" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={clientForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      rows={4}
                      placeholder="Aggiungi note"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{selectedClient ? 'Salva modifiche' : 'Aggiungi cliente'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rubrica Clienti</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca cliente..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedClient(null);
              clientForm.reset({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                gender: 'F',
                address: '',
                city: '',
                zipCode: '',
                dateOfBirth: '',
                fiscalCode: '',
                loyaltyCode: '',
                notes: '',
                isPrivate: true,
              });
              setActiveTab('dati-personali');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Genere</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.gender}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {searchTerm ? 'Nessun cliente trovato' : 'Nessun cliente disponibile'}
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
            <DialogTitle>Aggiungi nuovo cliente</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo cliente
            </DialogDescription>
          </DialogHeader>
          {renderClientForm()}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica cliente</DialogTitle>
            <DialogDescription>
              Modifica i dati del cliente
            </DialogDescription>
          </DialogHeader>
          {renderClientForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
