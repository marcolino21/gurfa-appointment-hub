import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableEventProps {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    clients: { name: string };
    services: { name: string };
    staff: { color_code: string };
  };
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ event }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: event,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: event.staff?.color_code || '#4f46e5',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="appointment-event"
    >
      <div className="font-medium truncate">{event.clients.name}</div>
      <div className="text-sm truncate">{event.services.name}</div>
    </div>
  );
}; 