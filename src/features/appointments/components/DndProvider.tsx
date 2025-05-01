import React from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

interface DndProviderProps {
  children: React.ReactNode;
  onDragEnd: (event: any) => void;
}

export const DndProvider: React.FC<DndProviderProps> = ({ children, onDragEnd }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay>
        <div className="drag-overlay-event" />
      </DragOverlay>
    </DndContext>
  );
}; 