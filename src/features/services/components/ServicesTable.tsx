
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { Service } from '@/types';
import { getDurationLabel } from '../utils/serviceUtils';

interface ServicesTableProps {
  services: Service[];
  getCategoryName: (categoryId: string) => string;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({ 
  services, 
  getCategoryName, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Durata</TableHead>
          <TableHead>Prezzo</TableHead>
          <TableHead>Personale</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length > 0 ? (
          services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: service.color }} 
                  />
                  {service.name}
                </div>
              </TableCell>
              <TableCell>{getCategoryName(service.category)}</TableCell>
              <TableCell className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {getDurationLabel(service.duration)}
              </TableCell>
              <TableCell>€ {service.price.toFixed(2)}</TableCell>
              <TableCell>
                {service.assignedStaffIds?.length || 0} membri
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Nessun servizio disponibile
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
