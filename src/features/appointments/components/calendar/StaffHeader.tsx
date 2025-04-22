
import React from 'react';
import { StaffMember } from '@/types';

interface StaffHeaderProps {
  staffMembers: StaffMember[];
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ staffMembers }) => {
  return (
    <div className="staff-header-row" style={{
      display: 'grid',
      gridTemplateColumns: `80px repeat(${staffMembers.length}, 1fr)`
    }}>
      <div className="time-col-header"></div>
      {staffMembers.map(staff => (
        <div
          key={staff.id}
          className="staff-header-col"
          style={{ borderLeft: `3px solid ${staff.color || "#9b87f5"}`}}
        >
          <span className="staff-name">
            {staff.firstName} {staff.lastName}
          </span>
        </div>
      ))}
    </div>
  );
};
