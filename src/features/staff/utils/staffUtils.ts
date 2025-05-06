
import { StaffMember } from '@/types';

/**
 * Ottiene le iniziali da nome e cognome
 */
export const getInitials = (firstName: string, lastName?: string): string => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

/**
 * Filtra i membri dello staff in base a un termine di ricerca
 */
export const filterStaffMembers = (staffMembers: StaffMember[], searchTerm: string): StaffMember[] => {
  if (!searchTerm) return staffMembers;
  
  const term = searchTerm.toLowerCase();
  return staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const email = staff.email?.toLowerCase() || '';
    return fullName.includes(term) || email.includes(term);
  });
};

/**
 * Ottiene il colore predefinito per i nuovi membri dello staff
 */
export const getDefaultStaffColor = (): string => {
  // Lista di colori predefiniti
  const colors = [
    '#9b87f5', // Viola
    '#4f46e5', // Indigo
    '#3b82f6', // Blu
    '#0ea5e9', // Azzurro
    '#10b981', // Verde
    '#f59e0b', // Arancione
    '#ef4444', // Rosso
  ];
  
  // Scegli un colore casuale dalla lista
  return colors[Math.floor(Math.random() * colors.length)];
};
