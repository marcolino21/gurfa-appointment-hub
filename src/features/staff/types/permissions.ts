
// Define available features in the system
export const SYSTEM_FEATURES = {
  DASHBOARD: 'dashboard',
  APPOINTMENTS: 'appointments',
  CLIENTS: 'clients',
  SERVICES: 'services',
  STAFF: 'staff',
  COMMUNICATIONS: 'communications',
  EXPENSES: 'expenses',
  WAREHOUSE: 'warehouse',
  STATISTICS: 'statistics',
  SUBSCRIPTIONS: 'subscriptions',
  SETTINGS: 'settings',
  PROJECTS: 'projects',
} as const;

export type SystemFeature = typeof SYSTEM_FEATURES[keyof typeof SYSTEM_FEATURES];

// Predefined roles with descriptions
export const STAFF_ROLES = {
  OWNER: 'Titolare',
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  EMPLOYEE: 'Dipendente',
  ACCOUNTANT: 'Commercialista',
  CUSTOM: 'Personalizzato',
} as const;

export type StaffRole = typeof STAFF_ROLES[keyof typeof STAFF_ROLES];

// Default permissions for predefined roles
export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, SystemFeature[]> = {
  [STAFF_ROLES.OWNER]: Object.values(SYSTEM_FEATURES),
  [STAFF_ROLES.MANAGER]: [
    SYSTEM_FEATURES.DASHBOARD,
    SYSTEM_FEATURES.APPOINTMENTS,
    SYSTEM_FEATURES.CLIENTS,
    SYSTEM_FEATURES.SERVICES,
    SYSTEM_FEATURES.STAFF,
    SYSTEM_FEATURES.COMMUNICATIONS,
    SYSTEM_FEATURES.WAREHOUSE,
    SYSTEM_FEATURES.STATISTICS,
  ],
  [STAFF_ROLES.RECEPTIONIST]: [
    SYSTEM_FEATURES.DASHBOARD,
    SYSTEM_FEATURES.APPOINTMENTS,
    SYSTEM_FEATURES.CLIENTS,
    SYSTEM_FEATURES.COMMUNICATIONS,
  ],
  [STAFF_ROLES.EMPLOYEE]: [
    SYSTEM_FEATURES.DASHBOARD,
    SYSTEM_FEATURES.APPOINTMENTS,
  ],
  [STAFF_ROLES.ACCOUNTANT]: [
    SYSTEM_FEATURES.DASHBOARD,
    SYSTEM_FEATURES.EXPENSES,
    SYSTEM_FEATURES.STATISTICS,
  ],
  [STAFF_ROLES.CUSTOM]: [],
};

// Interface for staff member permissions
export interface StaffPermissions {
  role: StaffRole;
  customPermissions?: SystemFeature[];
}
