
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { StaffAppointmentsHook } from '../types/staff';
import { MOCK_STAFF } from '@/data/mock/staff';
import { toast } from '@/components/ui/use-toast';

// Function to create a demo staff member
const createDemoStaff = (salonId: string): StaffMember => ({
  id: `staff-demo-${salonId}`,
  firstName: 'Demo',
  lastName: 'Staff',
  email: 'demo.staff@example.com',
  phone: '+39000000000',
  position: 'stylist',
  salonId: salonId,
  color: '#9333ea',
  permissions: [],
  workSchedule: [],
  assignedServiceIds: [],
  showInCalendar: true,
  isActive: true
});

export const useStaffAppointments = (): StaffAppointmentsHook => {
  // Main states
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSalonId } = useAuth();
  
  // Get staff from salon ID directly, no async operations
  const getStaffForSalon = (salonId: string | null): StaffMember[] => {
    if (!salonId) return [];
    
    // Get staff for this salon - using MOCK_STAFF which is already imported
    const salonStaff = MOCK_STAFF[salonId] || [];
    
    // Filter only visible staff
    const visibleSalonStaff = salonStaff.filter(staff => staff.showInCalendar);
    
    // If no visible staff, return a demo staff
    if (visibleSalonStaff.length === 0) {
      return [createDemoStaff(salonId)];
    }
    
    return visibleSalonStaff;
  };
  
  // Simple effect that runs when salon changes
  useEffect(() => {
    if (!currentSalonId) {
      setVisibleStaff([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get staff directly - no timeouts or async operations
      const staff = getStaffForSalon(currentSalonId);
      setVisibleStaff(staff);
      
      // Show notification if no staff is available
      if (staff.length === 1 && staff[0].id.startsWith('staff-demo-')) {
        toast({
          title: "Nessuno staff visibile",
          description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per i membri che vuoi visualizzare.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      // In case of error, show demo staff
      setVisibleStaff([createDemoStaff(currentSalonId)]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSalonId]);
  
  // Manual refresh function that's very simple
  const refreshVisibleStaff = () => {
    if (!currentSalonId) {
      console.warn('Cannot refresh staff - no salon selected');
      setVisibleStaff([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Direct synchronous access to staff data
      const staff = getStaffForSalon(currentSalonId);
      setVisibleStaff(staff);
    } catch (error) {
      console.error('Error refreshing staff:', error);
      setVisibleStaff([createDemoStaff(currentSalonId)]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    visibleStaff,
    isLoading,
    refreshVisibleStaff
  };
};
