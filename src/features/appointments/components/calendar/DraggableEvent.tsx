
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalendarEvent } from '../../types';

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
    cursor: isDragging ? 'grabbing' : 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-event ${isDragging ? 'is-dragging' : ''}`}
      {...listeners}
      {...attributes}
      data-event-id={event.id}
    >
      {children}
    </div>
  );
};

export default DraggableEvent;
