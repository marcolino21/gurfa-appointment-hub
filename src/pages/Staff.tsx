
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { Search, Plus } from 'lucide-react';
import StaffForm from '@/features/staff/components/staff-form';
import StaffTable from '@/features/staff/components/StaffTable';
import { useStaffData } from '@/features/staff/hooks/useStaffData';
import { StaffFormValues } from '@/features/staff/types';
import { useToast } from '@/hooks/use-toast';
import { filterStaffMembers, debugStaffData } from '@/features/staff/utils/staffUtils';
import { supabase } from '@/integrations/supabase/client';

const Staff = () => {
  const { currentSalonId } = useAuth();
  console.log("Staff component rendering with currentSalonId:", currentSalonId);
  
  const { 
    staffMembers, 
    services, 
    addStaff, 
    editStaff, 
    deleteStaff, 
    toggleStaffStatus, 
    toggleCalendarVisibility,
    isLoading,
    error
  } = useStaffData(currentSalonId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const { toast } = useToast();

  // Debug: fetch staff data directly from Supabase
  useEffect(() => {
    const checkSupabaseData = async () => {
      if (currentSalonId) {
        try {
          console.log("Checking Supabase staff data for salonId:", currentSalonId);
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .eq('salon_id', currentSalonId);
          
          if (error) {
            console.error("Supabase query error:", error);
          } else {
            console.log("Direct Supabase staff query result:", data);
          }
        } catch (e) {
          console.error("Error checking Supabase data:", e);
        }
      }
    };
    
    checkSupabaseData();
  }, [currentSalonId]);

  // Log when staffMembers changes
  useEffect(() => {
    console.log("staffMembers changed in Staff component:", staffMembers);
    
    // Filter staff based on search term
    const filtered = filterStaffMembers(staffMembers, searchTerm);
    setFilteredStaff(filtered);
  }, [staffMembers, searchTerm]);

  const handleAddStaff = async (data: StaffFormValues) => {
    console.log("handleAddStaff called with data:", data);
    console.log("Current salonId when adding staff:", currentSalonId);
    
    // Call debugStaffData before adding
    await debugStaffData(currentSalonId, "Before adding staff");
    
    const newStaff = await addStaff(data);
    
    if (newStaff) {
      console.log("New staff member added:", newStaff);
      // Call debugStaffData after adding
      await debugStaffData(currentSalonId, "After adding staff");
      setIsAddDialogOpen(false);
    } else {
      console.error("Failed to add staff member");
    }
  };

  const handleEditStaff = (data: StaffFormValues) => {
    if (selectedStaff) {
      editStaff(selectedStaff.id, data);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  // Show error if any
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-red-500">
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Errore</h2>
              <p className="text-gray-700">{error}</p>
              <Button 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Riprova
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-700">Caricamento membri dello staff...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff</CardTitle>
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
            <Button onClick={() => {
              setSelectedStaff(null);
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {staffMembers.length > 0 ? (
            <StaffTable 
              staffMembers={filteredStaff}
              onEdit={openEditDialog}
              onDelete={(staffId) => {
                deleteStaff(staffId);
              }}
              onToggleStatus={(staffId, isActive) => {
                toggleStaffStatus(staffId, isActive);
              }}
              onToggleCalendarVisibility={(staffId, showInCalendar) => {
                toggleCalendarVisibility(staffId, showInCalendar);
              }}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nessun membro dello staff disponibile. Aggiungi il tuo primo membro!
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi membro del team</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo membro del team
            </DialogDescription>
          </DialogHeader>
          <StaffForm 
            services={services}
            onSubmit={handleAddStaff}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica membro del team</DialogTitle>
            <DialogDescription>
              Modifica i dati del membro del team
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm 
              defaultValues={{
                firstName: selectedStaff.firstName,
                lastName: selectedStaff.lastName,
                email: selectedStaff.email,
                phone: selectedStaff.phone || '',
                additionalPhone: selectedStaff.additionalPhone || '',
                country: selectedStaff.country || 'Italia',
                birthDate: selectedStaff.birthDate || '',
                position: selectedStaff.position || '',
                color: selectedStaff.color || '#9b87f5',
                isActive: selectedStaff.isActive,
                showInCalendar: selectedStaff.showInCalendar,
                assignedServiceIds: selectedStaff.assignedServiceIds || [],
              }}
              services={services}
              onSubmit={handleEditStaff}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
