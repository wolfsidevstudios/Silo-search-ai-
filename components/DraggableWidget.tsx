
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { WidgetInstance } from '../types';

interface DraggableWidgetProps {
  widget: WidgetInstance;
  containerRef: React.RefObject<HTMLDivElement>;
  onUpdate: (widget: WidgetInstance) => void;
  isDraggable: boolean;
  children: React.ReactNode;
}

const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if (window.TouchEvent && e instanceof TouchEvent && e.touches[0]) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
};

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({ widget, containerRef, onUpdate, isDraggable, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: widget.x, y: widget.y });
  const widgetRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef(position);

  useEffect(() => {
    lastPositionRef.current = position;
  }, [position]);

  useEffect(() => {
    setPosition({ x: widget.x, y: widget.y });
  }, [widget.x, widget.y]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggable || !widgetRef.current || !containerRef.current) return;
    if (e.type === 'mousedown' && (e as React.MouseEvent).button !== 0) return;

    setIsDragging(true);
    const { clientX, clientY } = getEventCoordinates(e.nativeEvent);
    const widgetRect = widgetRef.current.getBoundingClientRect();
    
    offsetRef.current = {
      x: clientX - widgetRect.left,
      y: clientY - widgetRect.top,
    };
    e.preventDefault();
    e.stopPropagation();
  }, [isDraggable, containerRef]);


  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    if (e.type === 'touchmove') e.preventDefault();

    const { clientX, clientY } = getEventCoordinates(e);
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const xPx = clientX - containerRect.left - offsetRef.current.x;
    const yPx = clientY - containerRect.top - offsetRef.current.y;
    
    const xPercent = (xPx / containerRect.width) * 100;
    const yPercent = (yPx / containerRect.height) * 100;

    setPosition({ x: xPercent, y: yPercent });
  }, [containerRef]);

  const handleDragEnd = useCallback(() => {
    onUpdate({ ...widget, x: lastPositionRef.current.x, y: lastPositionRef.current.y });
    setIsDragging(false);
  }, [onUpdate, widget]);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const widgetSize = widget.widgetType === 'note' 
    ? { width: '250px', height: '250px' }
    : { width: '150px', height: '150px' };

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      className={`absolute transition-transform duration-200 ease-out ${isDraggable ? 'cursor-grab' : 'cursor-default'} ${isDragging ? 'cursor-grabbing z-10 scale-105' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ...widgetSize,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
      }}
      draggable="false"
    >
      {children}
    </div>
  );
};
