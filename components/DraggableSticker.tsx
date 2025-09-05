import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { StickerInstance } from '../types';
import { StickerComponents } from './sticker-library';

interface DraggableStickerProps {
  sticker: StickerInstance;
  containerRef: React.RefObject<HTMLDivElement>;
  onUpdate: (sticker: StickerInstance) => void;
  isDraggable: boolean;
}

// Helper to get client coordinates from either mouse or touch events
const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if (window.TouchEvent && e instanceof TouchEvent && e.touches[0]) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
};

export const DraggableSticker: React.FC<DraggableStickerProps> = ({ sticker, containerRef, onUpdate, isDraggable }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: sticker.x, y: sticker.y });
  const stickerRef = useRef<HTMLDivElement>(null);

  // Use refs for values that change during drag but shouldn't trigger effect re-runs
  const offsetRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef(position);

  // Keep the ref in sync with the state
  useEffect(() => {
    lastPositionRef.current = position;
  }, [position]);

  // Update position if sticker prop changes from outside
  useEffect(() => {
    setPosition({ x: sticker.x, y: sticker.y });
  }, [sticker.x, sticker.y]);

  const StickerComponent = StickerComponents[sticker.stickerId];
  if (!StickerComponent) return null;

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggable || !stickerRef.current || !containerRef.current) return;
    
    // For mouse events, only proceed on left-click
    if (e.type === 'mousedown' && (e as React.MouseEvent).button !== 0) return;

    setIsDragging(true);

    const { clientX, clientY } = getEventCoordinates(e.nativeEvent);
    const stickerRect = stickerRef.current.getBoundingClientRect();
    
    offsetRef.current = {
      x: clientX - stickerRect.left,
      y: clientY - stickerRect.top,
    };

    // Prevent default behavior like text selection or page scrolling on touch
    e.preventDefault();
    e.stopPropagation();
  }, [isDraggable, containerRef]);


  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    // Prevent scrolling on touch devices
    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    const { clientX, clientY } = getEventCoordinates(e);
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const xPx = clientX - containerRect.left - offsetRef.current.x;
    const yPx = clientY - containerRect.top - offsetRef.current.y;
    
    const xPercent = (xPx / containerRect.width) * 100;
    const yPercent = (yPx / containerRect.height) * 100;

    setPosition({ x: xPercent, y: yPercent });
  }, [containerRef]);

  const handleDragEnd = useCallback(() => {
    onUpdate({ ...sticker, x: lastPositionRef.current.x, y: lastPositionRef.current.y });
    setIsDragging(false);
  }, [onUpdate, sticker]);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      // Use passive: false to allow preventDefault inside the touchmove handler
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


  return (
    <div
      ref={stickerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      className={`absolute transition-transform duration-200 ease-out ${isDraggable ? 'cursor-grab' : 'cursor-default'} ${isDragging ? 'cursor-grabbing z-10 scale-110' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${sticker.size}rem`,
        height: `${sticker.size}rem`,
        transform: 'translate(-50%, -50%)', // Center the sticker on its coordinates
        touchAction: 'none', // Prevents scrolling on touch devices while dragging
      }}
      draggable="false"
    >
      <StickerComponent />
    </div>
  );
};