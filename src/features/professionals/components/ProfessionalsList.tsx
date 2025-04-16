
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { StaffMember } from '@/types';
import ProfessionalRow from './ProfessionalRow';

interface ProfessionalsListProps {
  professionals: StaffMember[];
  onEdit: (professional: StaffMember) => void;
  onToggleActive: (professionalId: string) => void;
  onDelete: (professional: StaffMember) => void;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({
  professionals,
  onEdit,
  onToggleActive,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Professionista</TableHead>
          <TableHead>Contatto</TableHead>
          <TableHead>Visibilità</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {professionals.length > 0 ? (
          professionals.map((professional) => (
            <ProfessionalRow 
              key={professional.id}
              professional={professional}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Nessun professionista trovato
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProfessionalsList;
