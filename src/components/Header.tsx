
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [businessName, setBusinessName] = useState<string | null>(null);

  // Check if we're on the settings page
  const isSettingsPage = location.pathname === '/impostazioni';

  useEffect(() => {
    // If on settings page, try to get business name from localStorage
    if (isSettingsPage) {
      const savedBusinessName = localStorage.getItem('salon_business_name');
      if (savedBusinessName) {
        setBusinessName(savedBusinessName);
      }
    }
  }, [isSettingsPage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSalonChange = (value: string) => {
    setCurrentSalon(value);
    toast({
      title: 'Salone selezionato',
      description: `Hai selezionato il salone: ${salons.find(salon => salon.id === value)?.name}`,
    });
  };

  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  
  // Use the business name from settings if available, otherwise use the salon name
  const displayName = isSettingsPage && businessName ? businessName : currentSalon?.name;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        {salons.length > 1 ? (
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <Select value={currentSalonId || undefined} onValueChange={handleSalonChange}>
              <SelectTrigger className="w-60 border-primary focus:border-primary focus:ring-2 focus:ring-primary">
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
          </div>
        ) : displayName ? (
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <div className="text-lg font-medium">{displayName}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-destructive">
            <Store className="h-5 w-5" />
            <div className="text-lg font-medium">Nessun salone disponibile</div>
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
