import React, { useState } from 'react';
import { ComparisonMode } from './types';
import Header from './components/Header';
import InfoBoxes from './components/InfoBoxes';
import ImageComparator from './components/ImageComparator';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [changedImage, setChangedImage] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode | null>(null);

  const resetState = () => {
    setOriginalImage(null);
    setChangedImage(null);
    setComparisonMode(null);
  };
  
  const handleSetMode = (mode: ComparisonMode) => {
    setComparisonMode(prevMode => prevMode === mode ? null : mode);
  }

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header onReset={resetState} />
      <main className="flex-grow flex flex-col p-4 md:p-8 pt-6 space-y-6 bg-[#f8f9fa]">
        <InfoBoxes />
        <ImageComparator
          originalImage={originalImage}
          setOriginalImage={setOriginalImage}
          changedImage={changedImage}
          setChangedImage={setChangedImage}
          mode={comparisonMode}
          setMode={handleSetMode}
        />
      </main>
    </div>
  );
};

export default App;