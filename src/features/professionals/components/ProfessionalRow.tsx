
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { StaffMember } from '@/types';
import { Edit, EyeOff, Eye, Trash2 } from 'lucide-react';

interface ProfessionalRowProps {
  professional: StaffMember;
  onEdit: (professional: StaffMember) => void;
  onToggleActive: (professionalId: string) => void;
  onDelete: (professional: StaffMember) => void;
}

const ProfessionalRow: React.FC<ProfessionalRowProps> = ({
  professional,
  onEdit,
  onToggleActive,
  onDelete
}) => {
  const getInitials = (firstName: string, lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: professional.color || '#9b87f5' }}
          >
            {getInitials(professional.firstName, professional.lastName)}
          </div>
          <div>
            <p className="font-medium">
              {professional.firstName} {professional.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {professional.position || 'Professionista'}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm">{professional.email}</p>
          {professional.phone && (
            <p className="text-sm text-muted-foreground">{professional.phone}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          professional.isActive 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {professional.isActive ? "Online" : "Offline"}
        </span>
        {professional.isActive && (
          <p className="text-xs text-muted-foreground mt-1">
            {professional.showInCalendar 
              ? "Visibile in agenda" 
              : "Nascosto dall'agenda"}
          </p>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(professional)}
          >
            <Edit className="h-4 w-4 mr-1" /> Modifica
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onToggleActive(professional.id)}
            className={professional.isActive ? "text-amber-600" : "text-green-600"}
          >
            {professional.isActive ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" /> Disattiva
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" /> Attiva
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(professional)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Elimina
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProfessionalRow;
