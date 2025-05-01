import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalendarEvent } from '../types';

interface DraggableEventProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ event, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`calendar-event ${isDragging ? 'is-dragging' : ''}`}
    >
      {children}
    </div>
  );
}; 