import React, { useRef, useEffect, useCallback, useState } from 'react';

interface JoystickData {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (down to up)
}

interface VirtualJoystickProps {
  size?: number;
  onMove: (data: JoystickData) => void;
  onStop: () => void;
  disabled?: boolean;
}

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  size = 150,
  onMove,
  onStop,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const maxDistance = size / 2 - 20; // 20px is knob radius

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limit to circle boundary
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    setPosition({ x: deltaX, y: deltaY });

    // Convert to normalized values (-1 to 1)
    const normalizedX = deltaX / maxDistance;
    const normalizedY = -deltaY / maxDistance; // Invert Y axis (up is positive)

    onMove({ x: normalizedX, y: normalizedY });
  }, [maxDistance, onMove]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    setIsDragging(true);
    updatePosition(clientX, clientY);
  }, [disabled, updatePosition]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    updatePosition(clientX, clientY);
  }, [isDragging, updatePosition]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onStop();
  }, [onStop]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

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

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: disabled ? '#f0f0f0' : '#e2e8f0',
    border: '3px solid #cbd5e0',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    touchAction: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const knobStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: disabled ? '#a0aec0' : '#3182ce',
    border: '2px solid white',
    position: 'absolute',
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    cursor: disabled ? 'not-allowed' : 'grab'
  };

  const centerDotStyle: React.CSSProperties = {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: '#a0aec0',
    position: 'absolute'
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={centerDotStyle} />
        <div
          ref={knobRef}
          style={knobStyle}
        />
      </div>
      <div style={{
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#718096',
        fontFamily: 'monospace'
      }}>
        X: {position.x !== 0 ? (position.x / maxDistance).toFixed(2) : '0.00'} |
        Y: {position.y !== 0 ? (-position.y / maxDistance).toFixed(2) : '0.00'}
      </div>
    </div>
  );
};

export default VirtualJoystick;
