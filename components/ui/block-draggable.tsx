import * as React from 'react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';
import { useDndNode, useDropLine } from '@platejs/dnd';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockDraggableProps extends PlateElementProps {
  element: any;
}

export function BlockDraggable({ className, children, element, ...props }: BlockDraggableProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const { isDragging, isOver, dragRef } = useDndNode({
    element,
    nodeRef,
  });

  const { dropLine } = useDropLine({
    id: element.id,
  });

  return (
    <PlateElement
      ref={nodeRef}
      className={cn(
        'group relative',
        isDragging && 'opacity-50',
        className
      )}
      {...props}
    >
      {/* Drop line indicator */}
      {!!dropLine && (
        <div
          className={cn(
            'absolute z-40 h-0.5 bg-blue-500',
            dropLine === 'top' && '-top-px left-0 w-full',
            dropLine === 'bottom' && '-bottom-px left-0 w-full'
          )}
        />
      )}

      {/* Drag handle */}
      <div
        ref={dragRef}
        className={cn(
          'absolute -left-8 top-0 flex h-full cursor-grab items-start pt-1 opacity-0 transition-opacity group-hover:opacity-100',
          isDragging && 'cursor-grabbing'
        )}
      >
        <div className="rounded border bg-background p-1 shadow-sm">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className={cn(isOver && 'ring-2 ring-blue-500/20 ring-offset-2')}>
        {children}
      </div>
    </PlateElement>
  );
}