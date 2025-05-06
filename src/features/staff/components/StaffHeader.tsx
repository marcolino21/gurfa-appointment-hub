import React, { useState, useEffect } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StaffHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddStaffClick: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onAddStaffClick
}) => {
  console.log('DEBUG - StaffHeader render');
  const [businessName, setBusinessName] = useState<string | null>(null);
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Get the business name from localStorage
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
    
    // Set up a listener for storage changes to update business name
    const handleStorageChange = () => {
      const updatedBusinessName = localStorage.getItem('salon_business_name');
      setBusinessName(updatedBusinessName);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleAddClick = () => {
    console.log('DEBUG - handleAddClick chiamato');
    let debugSalonId = currentSalonId || 'salon1';
    console.log('DEBUG - currentSalonId:', debugSalonId);
    if (!currentSalonId) {
      toast({
        title: 'Attenzione',
        description: 'Nessun salone selezionato. Seleziona un salone dall\'header in alto prima di aggiungere membri dello staff. Verrà usato salon1 per debug.',
        variant: 'destructive',
      });
    }
    onAddStaffClick();
  };
  
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Staff {businessName && `- ${businessName}`}</CardTitle>
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
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Aggiungi membro
        </Button>
      </div>
    </div>
  );
};

export default StaffHeader;
