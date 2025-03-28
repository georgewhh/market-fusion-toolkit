
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimelineSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  min,
  max,
  value,
  onChange,
  formatLabel = (value) => value.toString(),
  className
}) => {
  const [dragging, setDragging] = useState<'start' | 'end' | 'range' | null>(null);
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startHandleRef = useRef<HTMLDivElement>(null);
  const endHandleRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (position: number) => {
    if (!sliderRef.current) return 0;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, (position - sliderRect.left) / sliderRect.width * 100));
    return Math.round(min + (percentage / 100) * (max - min));
  };

  const handleMouseDown = (event: React.MouseEvent, type: 'start' | 'end' | 'range') => {
    event.preventDefault();
    setDragging(type);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragging || !sliderRef.current) return;

    const newValue = getValueFromPosition(event.clientX);

    if (dragging === 'start') {
      setLocalValue([Math.min(newValue, localValue[1] - 1), localValue[1]]);
    } else if (dragging === 'end') {
      setLocalValue([localValue[0], Math.max(newValue, localValue[0] + 1)]);
    } else if (dragging === 'range') {
      const rangeWidth = localValue[1] - localValue[0];
      const newStart = Math.max(min, Math.min(max - rangeWidth, newValue));
      const newEnd = newStart + rangeWidth;
      setLocalValue([newStart, newEnd]);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      onChange(localValue);
      setDragging(null);
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, localValue]);

  return (
    <div className={cn("relative w-full h-8 py-3", className)}>
      <div 
        ref={sliderRef}
        className="w-full h-0.5 bg-gray-700 rounded-full"
      >
        <div
          ref={rangeRef}
          className="absolute h-0.5 bg-blue-500 rounded-full cursor-pointer"
          style={{
            left: `${getPercentage(localValue[0])}%`,
            width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`
          }}
          onMouseDown={(e) => handleMouseDown(e, 'range')}
        />
        <div 
          ref={startHandleRef}
          className="absolute w-3 h-3 bg-white rounded-full shadow-md -mt-1 -ml-1.5 cursor-ew-resize hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(localValue[0])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
        />
        <div 
          ref={endHandleRef}
          className="absolute w-3 h-3 bg-white rounded-full shadow-md -mt-1 -ml-1.5 cursor-ew-resize hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(localValue[1])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatLabel(localValue[0])}</span>
        <span>{formatLabel(localValue[1])}</span>
      </div>
    </div>
  );
};

export default TimelineSlider;
