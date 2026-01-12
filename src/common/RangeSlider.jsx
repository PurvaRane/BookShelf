import React, { useState, useEffect, useRef, useCallback } from 'react';

const RangeSlider = ({ min, max, value, onChange }) => {
  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);
  const minValRef = useRef(value.min);
  const maxValRef = useRef(value.max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Sync with prop updates
  useEffect(() => {
    // Only update internal state if props differ significantly to avoid loops
    // But simplistic approach: just set them
    if (value.min !== minValRef.current || value.max !== maxValRef.current) {
        setMinVal(value.min);
        setMaxVal(value.max);
        minValRef.current = value.min;
        maxValRef.current = value.max;
    }
  }, [value, minVal, maxVal]); // Adding minVal/maxVal to dependency might be tricky, checking logic..
  // Actually, we want to update internal state ONLY when parent changes it.
  // But internal changes trigger parent update.
  // Let's refine:
  useEffect(() => {
      setMinVal(value.min);
      setMaxVal(value.max);
      minValRef.current = value.min;
      maxValRef.current = value.max;
  }, [value.min, value.max]);

  return (
    <div className="relative w-full h-12 flex items-center justify-center">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
          onChange({ min: value, max: maxVal });
        }}
        className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-[3]"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
          onChange({ min: minVal, max: value });
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
      />

      <div className="relative w-full">
        <div className="absolute rounded-md h-2 w-full bg-gray-200 z-[1]" />
        <div
          ref={range}
          className="absolute rounded-md h-2 bg-primary z-[2]"
        />
      </div>

      <style>{`
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          background-color: white;
          border: 2px solid #6366f1; /* primary color */
          border-radius: 50%;
          cursor: pointer;
          height: 20px;
          width: 20px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }
        .thumb::-moz-range-thumb {
          background-color: white;
          border: 2px solid #6366f1;
          border-radius: 50%;
          cursor: pointer;
          height: 20px;
          width: 20px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;
