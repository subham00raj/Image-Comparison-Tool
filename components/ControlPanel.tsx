import React from 'react';
import { ComparisonMode } from '../types';

interface ControlPanelProps {
  comparisonMode: ComparisonMode;
  setComparisonMode: (mode: ComparisonMode) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ comparisonMode, setComparisonMode }) => {
  const modes = [
    // FIX: Property 'Slider' does not exist on type 'typeof ComparisonMode'. Replaced with 'Split'.
    { id: ComparisonMode.Split, label: 'Slider' },
    { id: ComparisonMode.Onion, label: 'Onion Skin' },
    { id: ComparisonMode.Fade, label: 'Fade' },
    { id: ComparisonMode.SideBySide, label: 'Side-by-Side' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-1 bg-gray-200/70 p-1 rounded-lg">
        {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setComparisonMode(mode.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 ${
                comparisonMode === mode.id ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ControlPanel;