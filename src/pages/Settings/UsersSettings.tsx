
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilIcon, TrashIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isConfirmed: boolean;
}

const UsersSettings = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Marco Guru Silvestrelli',
      email: 'silvestrellimaro@hotmail.it',
      role: 'Titolare',
      createdAt: '10/11/2020',
      isConfirmed: true
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Utenti attivi</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>AGGIUNGI UTENTE</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>NUOVO UTENTE</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">NOME</Label>
                  <Input id="name" placeholder="Nome utente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">COGNOME</Label>
                  <Input id="surname" placeholder="Cognome utente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">EMAIL</Label>
                  <Input id="email" type="email" placeholder="Email utente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">RUOLO (info)</Label>
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Seleziona un ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="titolare">Titolare</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="dipendente">Dipendente</SelectItem>
                      <SelectItem value="commercialista">Commercialista</SelectItem>
                      <SelectItem value="manager">Manager con permessi ridotti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annulla</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Salva</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOME</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>RUOLO</TableHead>
                  <TableHead>CREATO IL</TableHead>
                  <TableHead className="text-right">AZIONI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.createdAt}
                        {user.isConfirmed && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            CONFERMATO
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Autorizzazioni</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p>Questo sistema di autorizzazioni ti permette di gestire l'accesso alle diverse funzionalità del software per ogni utente.</p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Gestione Calendario</TableHead>
                    <TableHead>Gestione Clienti</TableHead>
                    <TableHead>Gestione Servizi</TableHead>
                    <TableHead>Fatturazione</TableHead>
                    <TableHead>Gestione Utenti</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Titolare</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Receptionist</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dipendente</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Commercialista</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                    <TableCell className="text-green-500">✓</TableCell>
                    <TableCell className="text-red-500">✗</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersSettings;
