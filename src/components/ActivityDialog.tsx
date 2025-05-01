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
  const { user, salons, addSalon } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const hasExistingActivity = salons.length > 0;

  if (!hasExistingActivity) {
    return null;
  }

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

    const successMessage = hasExistingActivity 
      ? `L'attività aggiuntiva ${name} è stata aggiunta con successo.`
      : `L'attività ${name} è stata aggiunta con successo.`;
    
    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      name,
      ownerId: user?.id || '',
      address: address || undefined,
      phone: phone || undefined
    };
    
    addSalon(newSalon);
    
    setName('');
    setAddress('');
    setPhone('');
    onOpenChange(false);
    
    toast({
      title: 'Attività aggiunta',
      description: successMessage,
    });
  };

  const dialogTitle = hasExistingActivity 
    ? "Aggiungi un'attività aggiuntiva" 
    : "Aggiungi una nuova attività";
  
  const dialogDescription = hasExistingActivity
    ? "Inserisci i dettagli della nuova attività aggiuntiva che desideri gestire."
    : "Inserisci i dettagli della nuova attività che desideri gestire.";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95%] max-h-[85vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
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
            <Button type="button" onClick={() => onOpenChange(false)}>
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
