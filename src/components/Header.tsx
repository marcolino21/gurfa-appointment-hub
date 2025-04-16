
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Store } from 'lucide-react';
import { Salon } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

const Header: React.FC = () => {
  const { user, logout, currentSalonId, salons, setCurrentSalon } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
    
    const handleStorageChange = () => {
      const updatedBusinessName = localStorage.getItem('salon_business_name');
      setBusinessName(updatedBusinessName);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSalonChange = (value: string) => {
    setCurrentSalon(value);
    setIsDialogOpen(false);
    toast({
      title: 'Salone selezionato',
      description: `Hai selezionato il salone: ${salons.find(salon => salon.id === value)?.name}`,
    });
  };

  const openSalonSelector = () => {
    setIsDialogOpen(true);
  };

  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  
  const displayName = businessName || currentSalon?.name;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div 
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${salons.length <= 0 ? 'text-destructive' : ''}`}
            onClick={openSalonSelector}
          >
            <Store className={`h-5 w-5 ${currentSalonId ? 'text-primary' : ''}`} />
            
            {displayName ? (
              <div className="text-lg font-medium">{displayName}</div>
            ) : (
              <div className="text-lg font-medium">
                {salons.length > 0 ? 'Seleziona un salone' : 'Nessun salone disponibile'}
              </div>
            )}
          </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleziona un Salone</DialogTitle>
            <DialogDescription>
              Scegli il salone che vuoi gestire
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {salons.length > 0 ? (
              salons.map((salon: Salon) => (
                <div 
                  key={salon.id} 
                  className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-all
                    ${currentSalonId === salon.id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                  onClick={() => handleSalonChange(salon.id)}
                >
                  <div className="flex items-center gap-3">
                    <Store className={`h-5 w-5 ${currentSalonId === salon.id ? 'text-primary' : 'text-gray-500'}`} />
                    <div>
                      <p className="font-medium">{salon.name}</p>
                      {salon.address && (
                        <p className="text-sm text-muted-foreground">{salon.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Non ci sono saloni disponibili per questo account.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
