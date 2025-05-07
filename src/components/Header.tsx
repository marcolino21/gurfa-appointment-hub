
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Store } from 'lucide-react';
import { Salon } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { user, logout, currentSalonId, salons, setCurrentSalon } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-select the first salon if none is selected and salons are available
  useEffect(() => {
    if (salons.length > 0 && !currentSalonId) {
      console.log('Auto-selecting first salon:', salons[0].id);
      setCurrentSalon(salons[0].id);
      
      toast({
        title: "Salone selezionato automaticamente",
        description: `È stato selezionato automaticamente il salone: ${salons[0].name}`,
      });
    }
  }, [salons, currentSalonId, setCurrentSalon, toast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSalonChange = (value: string) => {
    console.log('Changing salon to:', value);
    setCurrentSalon(value);
    
    const selectedSalonName = salons.find(salon => salon.id === value)?.name;
    toast({
      title: "Salone cambiato",
      description: `Hai selezionato il salone: ${selectedSalonName}`,
    });
  };

  const currentSalon = salons.find(salon => salon.id === currentSalonId);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        {salons.length > 0 && (
          <div className="flex items-center gap-2 border rounded-md p-1 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <Store className="h-5 w-5 text-primary ml-2" />
            <Select value={currentSalonId || undefined} onValueChange={handleSalonChange}>
              <SelectTrigger className="w-60 border-none bg-transparent focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Seleziona un salone" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {salons.map((salon: Salon) => (
                  <SelectItem key={salon.id} value={salon.id}>
                    {salon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {salons.length === 0 && (
          <div className="flex items-center gap-2 text-red-500">
            <Store className="h-5 w-5" />
            <span>Nessun salone disponibile</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{user?.name}</span>
          <span className="text-sm text-muted-foreground">
            ({user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'azienda' ? 'Azienda' : 'Freelance'})
          </span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
