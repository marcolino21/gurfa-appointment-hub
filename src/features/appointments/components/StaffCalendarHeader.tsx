
import React from 'react';
import { StaffMember } from '@/types';

interface StaffCalendarHeaderProps {
  staffMembers: StaffMember[];
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';
}

const StaffCalendarHeader: React.FC<StaffCalendarHeaderProps> = ({
  staffMembers,
  view
}) => {
  // In vista giornaliera e settimanale, mostriamo lo staff
  if (view === 'timeGridDay' || view === 'timeGridWeek') {
    return (
      <div className="staff-calendar-header py-2 border-b">
        <div className="grid" style={{ 
          gridTemplateColumns: `50px repeat(${staffMembers.length}, 1fr)`,
        }}>
          <div className="text-center font-medium text-sm">Ora</div>
          {staffMembers.map((staff) => (
            <div 
              key={staff.id} 
              className="text-center font-medium text-sm px-1 truncate"
              style={{ borderLeft: `3px solid ${staff.color || '#9b87f5'}` }}
            >
              {staff.firstName} {staff.lastName}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // In vista mensile non mostriamo l'intestazione personalizzata
  return null;
};

export default StaffCalendarHeader;
