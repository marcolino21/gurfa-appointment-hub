
import React from 'react';
import { StaffMember } from '@/types';
import { getInitials } from '../utils/staffUtils';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Edit, Trash2, Calendar, XCircle, CheckCircle } from 'lucide-react';

type StaffTableProps = {
  staffMembers: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  onToggleStatus: (staffId: string, isActive: boolean) => void;
  onToggleCalendarVisibility: (staffId: string, showInCalendar: boolean) => void;
};

const StaffTable: React.FC<StaffTableProps> = ({
  staffMembers,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleCalendarVisibility,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membro</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Posizione</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffMembers && staffMembers.length > 0 ? (
          staffMembers.map((staffMember) => (
            <TableRow key={staffMember.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: staffMember.color || '#9b87f5' }}
                  >
                    {getInitials(staffMember.firstName, staffMember.lastName)}
                  </div>
                  <div>
                    <p className="font-medium">{staffMember.firstName} {staffMember.lastName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{staffMember.email}</TableCell>
              <TableCell>{staffMember.phone || '-'}</TableCell>
              <TableCell>{staffMember.position || '-'}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    staffMember.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {staffMember.isActive ? "Attivo" : "Disattivato"}
                  </span>
                  {staffMember.isActive && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      staffMember.showInCalendar 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {staffMember.showInCalendar ? "Visibile in agenda" : "Nascosto dall'agenda"}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(staffMember)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onToggleCalendarVisibility(staffMember.id, !staffMember.showInCalendar)}
                    title={staffMember.showInCalendar ? "Nascondi dall'agenda" : "Mostra in agenda"}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onToggleStatus(staffMember.id, !staffMember.isActive)}
                    title={staffMember.isActive ? "Disattiva" : "Attiva"}
                  >
                    {staffMember.isActive 
                      ? <XCircle className="h-4 w-4" /> 
                      : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(staffMember.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Nessun membro dello staff disponibile
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default StaffTable;
