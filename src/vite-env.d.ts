
/// <reference types="vite/client" />

// Global staff data declaration
interface Window {
  globalStaffData: Record<string, import('@/types').StaffMember[]>;
}
