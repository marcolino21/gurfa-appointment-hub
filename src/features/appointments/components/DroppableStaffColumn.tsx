import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { StaffResource } from '../types';

interface DroppableStaffColumnProps {
  resource: StaffResource;
  children: React.ReactNode;
}

export const DroppableStaffColumn: React.FC<DroppableStaffColumnProps> = ({ resource, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: resource.id,
    data: resource
  });

  return (
    <div
      ref={setNodeRef}
      className={`calendar-staff-col ${isOver ? 'is-over' : ''}`}
      style={{
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        border: isOver ? '2px solid #3b82f6' : 'none'
      }}
    >
      {children}
    </div>
  );
}; 