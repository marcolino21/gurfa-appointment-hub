
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  STAFF_ROLES,
  SYSTEM_FEATURES,
  SystemFeature,
  StaffRole,
  DEFAULT_ROLE_PERMISSIONS
} from '@/features/staff/types/permissions';

interface PermissionsSelectorProps {
  initialRole?: StaffRole;
  initialPermissions?: SystemFeature[];
  onChange: (role: StaffRole, permissions: SystemFeature[]) => void;
}

const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  initialRole = STAFF_ROLES.EMPLOYEE,
  initialPermissions = [],
  onChange
}) => {
  const [selectedRole, setSelectedRole] = useState<StaffRole>(initialRole);
  const [customPermissions, setCustomPermissions] = useState<SystemFeature[]>(
    initialRole === STAFF_ROLES.CUSTOM ? initialPermissions : DEFAULT_ROLE_PERMISSIONS[initialRole]
  );

  // Update permissions when role changes
  useEffect(() => {
    if (selectedRole !== STAFF_ROLES.CUSTOM) {
      setCustomPermissions(DEFAULT_ROLE_PERMISSIONS[selectedRole]);
      onChange(selectedRole, DEFAULT_ROLE_PERMISSIONS[selectedRole]);
    } else {
      onChange(selectedRole, customPermissions);
    }
  }, [selectedRole]);

  // Handle custom permission changes
  const handlePermissionChange = (feature: SystemFeature, checked: boolean) => {
    let updatedPermissions: SystemFeature[];
    
    if (checked) {
      updatedPermissions = [...customPermissions, feature];
    } else {
      updatedPermissions = customPermissions.filter(p => p !== feature);
    }
    
    setCustomPermissions(updatedPermissions);
    onChange(selectedRole, updatedPermissions);
  };

  // Feature label mapping for UI
  const featureLabels: Record<SystemFeature, string> = {
    dashboard: 'Dashboard',
    appointments: 'Appuntamenti',
    clients: 'Rubrica Clienti',
    services: 'Servizi',
    staff: 'Staff',
    communications: 'Comunicazioni',
    expenses: 'Spese',
    warehouse: 'Magazzino',
    statistics: 'Statistiche',
    subscriptions: 'Abbonamenti',
    settings: 'Impostazioni',
    projects: 'Progetti',
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Ruolo (info)</h4>
        <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as StaffRole)}>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(STAFF_ROLES).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`role-${key}`} />
                <Label htmlFor={`role-${key}`}>{value}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {(selectedRole === STAFF_ROLES.CUSTOM || initialRole === STAFF_ROLES.CUSTOM) && (
        <div>
          <h4 className="text-sm font-medium mb-3">Personalizza accesso alle funzionalità</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(SYSTEM_FEATURES).map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature-${feature}`} 
                  checked={customPermissions.includes(feature)}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(feature, checked === true)
                  }
                />
                <Label htmlFor={`feature-${feature}`}>{featureLabels[feature]}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsSelector;
