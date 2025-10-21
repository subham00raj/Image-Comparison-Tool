import React from 'react';
import { CompareIcon, DesktopIcon, LogoIcon } from './icons';

const InfoBoxes: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex items-start space-x-4">
        <CompareIcon className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
        <div>
          <h2 className="font-bold text-lg text-gray-800">Compare Images</h2>
          <p className="text-gray-600">
            Find the difference between pictures or other images! Enter two images and the difference will show up below.
          </p>
        </div>
      </div>
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 flex items-start space-x-4">
        <div className="bg-green-600 p-1.5 rounded-lg">
            <DesktopIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800">Diffchecker Desktop</h2>
          <p className="text-gray-600">
            The most secure way to run Diffchecker. Get the Diffchecker Desktop app: your diffs never leave your computer!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBoxes;
