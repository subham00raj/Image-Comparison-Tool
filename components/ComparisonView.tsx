import React, { useState } from 'react';
import { ComparisonMode } from '../types';
import Slider from './Slider';

interface ComparisonViewProps {
  originalImage: string;
  changedImage: string;
  mode: ComparisonMode;
  imageDimensions: { width: number; height: number } | null;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, changedImage, mode, imageDimensions }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [opacity, setOpacity] = useState(50);

  const aspectRatio = imageDimensions ? imageDimensions.width / imageDimensions.height : 16 / 9;

  if (mode === ComparisonMode.SideBySide) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                  <h3 className="font-bold mb-2 text-gray-700">Original</h3>
                  <img src={originalImage} alt="Original" className="rounded-md w-full h-auto object-contain shadow-md" />
              </div>
              <div className="flex flex-col items-center">
                  <h3 className="font-bold mb-2 text-gray-700">Changed</h3>
                  <img src={changedImage} alt="Changed" className="rounded-md w-full h-auto object-contain shadow-md" />
              </div>
          </div>
      );
  }

  return (
    <div className="relative w-full mx-auto shadow-lg rounded-lg" style={{ aspectRatio: `${aspectRatio}` }}>
        <img src={originalImage} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none rounded-lg" />

        {/* FIX: Property 'Slider' does not exist on type 'typeof ComparisonMode'. Replaced with 'Split'. */}
        {mode === ComparisonMode.Split && (
            <>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden select-none pointer-events-none rounded-lg" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)`}}>
                    <img src={changedImage} alt="Changed" className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none" />
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute top-0 left-0 w-full h-full cursor-ew-resize opacity-0"
                />
                 <div className="absolute top-0 bottom-0 bg-cyan-400 w-1 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 bg-cyan-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </div>
                </div>
            </>
        )}
        
        {(mode === ComparisonMode.Onion || mode === ComparisonMode.Fade) && (
             <>
                <div 
                    className="absolute top-0 left-0 w-full h-full select-none pointer-events-none rounded-lg"
                    style={{ opacity: opacity / 100 }}
                >
                    <img src={changedImage} alt="Changed" className="absolute top-0 left-0 w-full h-full object-contain" />
                </div>
                <Slider value={opacity} onChange={setOpacity} />
            </>
        )}
    </div>
  );
};

export default ComparisonView;