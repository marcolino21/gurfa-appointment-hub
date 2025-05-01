import { useState, useEffect } from 'react';
import { StaffMember } from '../../staff/types';
import { useStaffMembers } from '../../staff/hooks/useStaffMembers';

interface StaffResource {
  id: string;
  name: string;
  color?: string;
  isVisible?: boolean;
}

export const useStaffResources = () => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { staffMembers, isLoading: isLoadingStaff } = useStaffMembers();

  useEffect(() => {
    if (!isLoadingStaff) {
      const transformedResources = staffMembers
        .filter(member => member.isActive && member.showInCalendar)
        .map(member => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName || ''}`.trim(),
          color: member.color,
          isVisible: member.showInCalendar
        }));
      
      setResources(transformedResources);
      setIsLoading(false);
    }
  }, [staffMembers, isLoadingStaff]);

  return { resources, isLoading };
}; 