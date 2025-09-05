import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { StickerInstance } from '../types';
import { StickerComponents } from './sticker-library';

interface DraggableStickerProps {
  sticker: StickerInstance;
  containerRef: React.RefObject<HTMLDivElement>;
  onUpdate: (sticker: StickerInstance) => void;
  isDraggable: boolean;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({ sticker, containerRef, onUpdate, isDraggable }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: sticker.x, y: sticker.y });
  const stickerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: sticker.x, y: sticker.y });
  }, [sticker.x, sticker.y]);

  const StickerComponent = StickerComponents[sticker.stickerId];
  if (!StickerComponent) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if the sticker is draggable and it's a left-click.
    if (!isDraggable || !stickerRef.current || !containerRef.current || e.button !== 0) return;

    setIsDragging(true);

    const stickerRect = stickerRef.current.getBoundingClientRect();
    
    // Calculate initial offset from the top-left of the sticker itself
    offsetRef.current = {
      x: e.clientX - stickerRect.left,
      y: e.clientY - stickerRect.top,
    };

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate new top-left position in pixels
    const xPx = e.clientX - containerRect.left - offsetRef.current.x;
    const yPx = e.clientY - containerRect.top - offsetRef.current.y;
    
    // Convert to percentage for responsive positioning
    const xPercent = (xPx / containerRect.width) * 100;
    const yPercent = (yPx / containerRect.height) * 100;

    setPosition({ x: xPercent, y: yPercent });
  }, [containerRef]);

  const handleDragEnd = useCallback(() => {
    onUpdate({ ...sticker, x: position.x, y: position.y });
    setIsDragging(false);
  }, [onUpdate, sticker, position]);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('mouseleave', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mouseleave', handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);


  return (
    <div
      ref={stickerRef}
      onMouseDown={handleMouseDown}
      className={`absolute transition-transform duration-200 ease-out ${isDraggable ? 'cursor-grab' : 'cursor-default'} ${isDragging ? 'cursor-grabbing z-10 scale-110' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${sticker.size}rem`,
        height: `${sticker.size}rem`,
        transform: 'translate(-50%, -50%)', // Center the sticker on its coordinates
      }}
      draggable="false"
    >
      <StickerComponent />
    </div>
  );
};