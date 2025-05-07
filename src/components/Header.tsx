
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Salon } from '@/types';

const Header: React.FC = () => {
  const { user, logout, currentSalonId, salons, setCurrentSalon } = useAuth();
  const navigate = useNavigate();

  // Auto-select the first salon if none is selected and salons are available
  useEffect(() => {
    if (salons.length > 0 && !currentSalonId) {
      console.log('Auto-selecting first salon:', salons[0].id);
      setCurrentSalon(salons[0].id);
    }
  }, [salons, currentSalonId, setCurrentSalon]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSalonChange = (value: string) => {
    console.log('Changing salon to:', value);
    setCurrentSalon(value);
  };

  const currentSalon = salons.find(salon => salon.id === currentSalonId);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        {salons.length > 1 && (
          <Select value={currentSalonId || undefined} onValueChange={handleSalonChange}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Seleziona un salone" />
            </SelectTrigger>
            <SelectContent>
              {salons.map((salon: Salon) => (
                <SelectItem key={salon.id} value={salon.id}>
                  {salon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {currentSalon && salons.length === 1 && (
          <div className="text-lg font-medium">{currentSalon.name}</div>
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
