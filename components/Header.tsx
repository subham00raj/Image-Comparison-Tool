import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold tracking-tight text-gray-800">Image Compare</h1>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white border border-gray-300"
        >
          Reset
        </button>
      </div>
    </header>
  );
};

export default Header;