import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilIcon, TrashIcon, PlusCircle } from "lucide-react";
import ActivityDialog from '@/components/ActivityDialog';

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
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Utenti attivi</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setIsActivityDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi attività
            </Button>
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

      <ActivityDialog 
        open={isActivityDialogOpen} 
        onOpenChange={setIsActivityDialogOpen} 
      />
    </div>
  );
};

export default UsersSettings;
