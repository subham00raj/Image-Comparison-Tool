import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min = 0, max = 100, step = 1 }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 max-w-xs bg-white/60 p-2 rounded-lg backdrop-blur-sm border border-gray-200 shadow-md">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
      <style>{`
        .slider-thumb {
            --thumb-color: #ffffff;
            --thumb-border-color: #cbd5e1; /* slate-300 */
        }
        /* Webkit */
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--thumb-color);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid var(--thumb-border-color);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-top: -7px; /* center thumb on track */
        }

        /* Firefox */
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--thumb-color);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid var(--thumb-border-color);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Slider;
