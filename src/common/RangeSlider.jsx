import React, { useState, useEffect, useRef, useCallback } from 'react';

const RangeSlider = ({ min, max, value, onChange }) => {
  const [maxVal, setMaxVal] = useState(value.max);
  const maxValRef = useRef(value.max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range based on max value only (min is always 0)
  useEffect(() => {
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = '0%';
      range.current.style.width = `${maxPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Sync with prop updates
  useEffect(() => {
      setMaxVal(value.max);
      maxValRef.current = value.max;
  }, [value.max]);

  return (
    <div className="relative w-full h-12 flex items-center justify-center">
      {/* Only one slider for max value - min is fixed at 0 */}
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Number(event.target.value);
          setMaxVal(value);
          maxValRef.current = value;
          onChange({ min: 0, max: value }); // min is always 0
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
      />

      <div className="relative w-full">
        <div className="absolute rounded-md h-2 w-full bg-[#E3DDD6] z-[1]" />
        <div
          ref={range}
          className="absolute rounded-md h-2 bg-[#5B2C2C] z-[2]"
        />
      </div>

      <style>{`
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          background-color: white;
          border: 2px solid #5B2C2C;
          border-radius: 50%;
          cursor: pointer;
          height: 20px;
          width: 20px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
          box-shadow: 0 1px 3px rgba(91, 44, 44, 0.2);
        }
        .thumb::-webkit-slider-thumb:hover {
          background-color: #FAF7F3;
          border-color: #5B2C2C;
        }
        .thumb::-moz-range-thumb {
          background-color: white;
          border: 2px solid #5B2C2C;
          border-radius: 50%;
          cursor: pointer;
          height: 20px;
          width: 20px;
          pointer-events: all;
          position: relative;
          box-shadow: 0 1px 3px rgba(91, 44, 44, 0.2);
        }
        .thumb::-moz-range-thumb:hover {
          background-color: #FAF7F3;
          border-color: #5B2C2C;
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;
