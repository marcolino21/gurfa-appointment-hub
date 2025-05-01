
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { StaffMember } from '../../types';

interface DroppableStaffColumnProps {
  staff: StaffMember;
  selectedDate: Date;
  children: React.ReactNode;
  isOver?: boolean;
  onDrop?: (data: any) => void;
}

export const DroppableStaffColumn: React.FC<DroppableStaffColumnProps> = ({
  staff,
  selectedDate,
  children,
  isOver = false,
  onDrop
}) => {
  const { setNodeRef, isOver: isDraggingOver } = useDroppable({
    id: staff.id,
    data: {
      staff,
      date: selectedDate
    }
  });

  const isDropOver = isOver || isDraggingOver;

  return (
    <div
      ref={setNodeRef}
      className={`droppable-staff-column ${isDropOver ? 'is-over' : ''}`}
      style={{
        transition: 'background-color 0.2s ease',
        backgroundColor: isDropOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        border: isDropOver ? '2px dashed #3b82f6' : '2px solid transparent'
      }}
      data-staff-id={staff.id}
    >
      {children}
    </div>
  );
};

export default DroppableStaffColumn;
