
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { MOCK_STAFF } from '@/data/mockData';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  
  useEffect(() => {
    if (currentSalonId) {
      // Recupera lo staff dal mockData e filtra solo quelli visibili in agenda
      const allStaff = MOCK_STAFF[currentSalonId] || [];
      const staffVisibleInCalendar = allStaff.filter(staff => 
        staff.isActive && staff.showInCalendar
      );
      
      setVisibleStaff(staffVisibleInCalendar);
    }
  }, [currentSalonId, MOCK_STAFF]); // Aggiunta dipendenza MOCK_STAFF per reagire ai cambiamenti

  return { 
    visibleStaff
  };
};
