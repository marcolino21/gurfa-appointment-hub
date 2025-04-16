
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Salon } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({ open, onOpenChange }) => {
  const { user, addSalon } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci un nome per l\'attività.',
        variant: 'destructive'
      });
      return;
    }
    
    // Crea il nuovo salone
    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      name,
      ownerId: user?.id || '',
      address: address || undefined,
      phone: phone || undefined
    };
    
    addSalon(newSalon);
    
    // Reset form and close dialog
    setName('');
    setAddress('');
    setPhone('');
    onOpenChange(false);
    
    toast({
      title: 'Attività aggiunta',
      description: `L'attività ${name} è stata aggiunta con successo.`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiungi una nuova attività</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli della nuova attività che desideri gestire.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome attività *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Es: Gurfa Beauty Concept" 
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Input 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Es: Via Fiume Giallo, 405, Roma" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Es: +390651234567" 
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit">
              Salva attività
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
