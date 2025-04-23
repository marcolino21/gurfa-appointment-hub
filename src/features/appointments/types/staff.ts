
import { StaffMember } from '@/types';

export interface StaffAppointmentsHook {
  visibleStaff: StaffMember[];
  isLoading: boolean;
  refreshVisibleStaff: () => void;
}
