
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Store, Plus } from 'lucide-react';
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
    // Get the business name for the current salon
    const loadBusinessName = () => {
      // First try to get from localStorage
      const savedBusinessName = localStorage.getItem('salon_business_name');
      
      // If we have a currentSalonId, find that salon's name
      if (currentSalonId) {
        const currentSalon = salons.find(s => s.id === currentSalonId);
        if (currentSalon) {
          setBusinessName(currentSalon.name);
          localStorage.setItem('salon_business_name', currentSalon.name);
          return;
        }
      }
      
      // Fall back to saved business name if no current salon
      if (savedBusinessName) {
        setBusinessName(savedBusinessName);
      } else if (salons.length > 0) {
        // If no business name but we have salons, use the first one
        setBusinessName(salons[0].name);
        setCurrentSalon(salons[0].id);
      } else {
        setBusinessName(null);
      }
    };
    
    loadBusinessName();
    
    const handleStorageChange = () => {
      const updatedBusinessName = localStorage.getItem('salon_business_name');
      setBusinessName(updatedBusinessName);
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for business name changes from profile settings
    const handleBusinessNameChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.businessName) {
        setBusinessName(customEvent.detail.businessName);
      }
      loadBusinessName(); // Reload business name to be safe
    };
    
    window.addEventListener('business_name_changed', handleBusinessNameChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('business_name_changed', handleBusinessNameChange as EventListener);
    };
  }, [currentSalonId, salons, setCurrentSalon]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSalonChange = (value: string) => {
    setCurrentSalon(value);
    setIsDialogOpen(false);
    
    // Update business name immediately
    const selectedSalon = salons.find(salon => salon.id === value);
    if (selectedSalon) {
      setBusinessName(selectedSalon.name);
      localStorage.setItem('salon_business_name', selectedSalon.name);
      
      toast({
        title: 'Salone selezionato',
        description: `Hai selezionato il salone: ${selectedSalon.name}`,
      });
    }
  };

  const openSalonSelector = () => {
    setIsDialogOpen(true);
  };

  const handleCreateSalon = () => {
    setIsDialogOpen(false);
    navigate('/impostazioni');
  };

  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  const displayName = currentSalon?.name || businessName;
  const noSalons = salons.length === 0;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div 
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${noSalons ? 'text-destructive' : ''}`}
            onClick={openSalonSelector}
          >
            <Store className={`h-5 w-5 ${currentSalonId ? 'text-primary' : 'text-destructive'}`} />
            
            {displayName ? (
              <div className="text-lg font-medium">{displayName}</div>
            ) : (
              <div className="text-lg font-medium text-destructive">
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
            <DialogTitle>Gestione Saloni</DialogTitle>
            <DialogDescription>
              {salons.length > 0 
                ? 'Scegli il salone che vuoi gestire'
                : 'Non hai ancora nessun salone. Creane uno dalle impostazioni profilo.'}
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
              <div className="text-center p-6">
                <div className="mb-4 text-muted-foreground">
                  Non ci sono saloni disponibili per questo account.
                </div>
                <Button onClick={handleCreateSalon} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Crea nuovo salone
                </Button>
              </div>
            )}
            
            {salons.length > 0 && (
              <Button onClick={handleCreateSalon} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Aggiungi nuovo salone
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
