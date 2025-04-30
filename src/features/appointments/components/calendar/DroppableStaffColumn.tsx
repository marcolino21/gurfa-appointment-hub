import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { StaffMember } from '../../types';
import { CalendarEvent } from '../../types';

interface DroppableStaffColumnProps {
  staff: StaffMember;
  events: CalendarEvent[];
  selectedDate: Date;
  commonConfig: any;
  calendarRef: React.RefObject<HTMLDivElement>;
  setCalendarApi: (api: any) => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  children: React.ReactNode;
  isOver?: boolean;
}

export const DroppableStaffColumn: React.FC<DroppableStaffColumnProps> = ({
  staff,
  events,
  selectedDate,
  commonConfig,
  calendarRef,
  setCalendarApi,
  zoomLevel,
  onZoomChange,
  children,
  isOver = false
}) => {
  const { setNodeRef } = useDroppable({
    id: staff.id,
    data: staff
  });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-staff-column ${isOver ? 'is-over' : ''}`}
      style={{
        transition: 'background-color 0.2s ease',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        border: isOver ? '2px dashed #3b82f6' : '2px solid transparent'
      }}
    >
      {children}
    </div>
  );
};

export default DroppableStaffColumn; 