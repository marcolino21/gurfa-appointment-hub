import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalendarEvent } from '../types/calendar';

interface DraggableEventProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ event, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.event_id,
    data: event
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 1
  };

  const eventData = {
    event_id: event.event_id,
    title: event.title,
    start: event.start,
    end: event.end,
    resourceId: event.resourceId
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`calendar-event ${isDragging ? 'is-dragging' : ''}`}
      draggable
      data-event={JSON.stringify(eventData)}
    >
      {children}
    </div>
  );
}; 