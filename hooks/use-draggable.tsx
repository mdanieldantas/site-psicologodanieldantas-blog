'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  snapToCorners?: boolean;
  persistPosition?: boolean;
  storageKey?: string;
}

export function useDraggable({
  initialPosition = { x: 20, y: 20 },
  snapToCorners = true,
  persistPosition = true,
  storageKey = 'floating-player-position'
}: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Carregar posição salva
  useEffect(() => {
    if (persistPosition && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedPosition = JSON.parse(saved);
          setPosition(savedPosition);
        } catch (error) {
          console.warn('Erro ao carregar posição salva:', error);
        }
      }
    }
  }, [persistPosition, storageKey]);

  // Salvar posição
  const savePosition = useCallback((pos: Position) => {
    if (persistPosition && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(pos));
    }
  }, [persistPosition, storageKey]);
  // Snap para cantos
  const snapToCorner = useCallback((pos: Position): Position => {
    if (!snapToCorners || typeof window === 'undefined') return pos;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = elementRef.current?.offsetWidth || 320;
    const elementHeight = elementRef.current?.offsetHeight || 80;

    const corners = [
      { x: 20, y: 20 }, // Top-left
      { x: viewportWidth - elementWidth - 20, y: 20 }, // Top-right
      { x: 20, y: viewportHeight - elementHeight - 20 }, // Bottom-left
      { x: viewportWidth - elementWidth - 20, y: viewportHeight - elementHeight - 20 } // Bottom-right
    ];

    // Encontrar canto mais próximo
    let closestCorner = corners[0];
    let minDistance = Infinity;

    corners.forEach(corner => {
      const distance = Math.sqrt(
        Math.pow(pos.x - corner.x, 2) + Math.pow(pos.y - corner.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCorner = corner;
      }
    });

    return closestCorner;
  }, [snapToCorners]);

  // Limitar dentro da viewport
  const constrainToViewport = useCallback((pos: Position): Position => {
    if (typeof window === 'undefined') return pos;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = elementRef.current?.offsetWidth || 320;
    const elementHeight = elementRef.current?.offsetHeight || 80;

    return {
      x: Math.max(0, Math.min(pos.x, viewportWidth - elementWidth)),
      y: Math.max(0, Math.min(pos.y, viewportHeight - elementHeight))
    };
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);

    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = constrainToViewport({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });

    setPosition(newPosition);
  }, [isDragging, dragOffset, constrainToViewport]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    
    // Snap to corner quando soltar
    const snappedPosition = snapToCorner(position);
    setPosition(snappedPosition);
    savePosition(snappedPosition);
  }, [isDragging, position, snapToCorner, savePosition]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!elementRef.current) return;

    const touch = e.touches[0];
    const rect = elementRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);

    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const newPosition = constrainToViewport({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    });

    setPosition(newPosition);
    e.preventDefault();
  }, [isDragging, dragOffset, constrainToViewport]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    
    // Snap to corner quando soltar
    const snappedPosition = snapToCorner(position);
    setPosition(snappedPosition);
    savePosition(snappedPosition);
  }, [isDragging, position, snapToCorner, savePosition]);

  // Event listeners globais
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);
  // Reposicionar no resize da janela
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const constrainedPosition = constrainToViewport(position);
      if (constrainedPosition.x !== position.x || constrainedPosition.y !== position.y) {
        setPosition(constrainedPosition);
        savePosition(constrainedPosition);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, constrainToViewport, savePosition]);

  return {
    elementRef,
    position,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart
    },
    setPosition: (newPos: Position) => {
      const constrainedPos = constrainToViewport(newPos);
      setPosition(constrainedPos);
      savePosition(constrainedPos);
    }
  };
}
