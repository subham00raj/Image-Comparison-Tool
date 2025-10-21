import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { ComparisonMode } from '../types';
import ImageUploader from './ImageUploader';
import { 
  SplitIcon, FadeIcon, DifferenceIcon, HighlightIcon, 
  FileDetailsIcon, ResetIcon, ExportIcon, OpenFileIcon, SliderHandleIcon
} from './icons';
import { fileToDataUrl } from '../utils/fileUtils';

interface ImageComparatorProps {
  originalImage: string | null;
  setOriginalImage: (image: string | null) => void;
  changedImage: string | null;
  setChangedImage: (image: string | null) => void;
  mode: ComparisonMode | null;
  setMode: (mode: ComparisonMode) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5, 10];

const ImageComparator: React.FC<ImageComparatorProps> = ({
  originalImage, setOriginalImage, changedImage, setChangedImage, mode, setMode
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  
  const [vSliderPos, setVSliderPos] = useState(50);
  const [fadeSliderPos, setFadeSliderPos] = useState(50);

  const [isVSliderDragging, setIsVSliderDragging] = useState(false);
  const [isFadeSliderDragging, setIsFadeSliderDragging] = useState(false);
  const [isPanDisabled, setIsPanDisabled] = useState(false);
  
  const [originalFileName, setOriginalFileName] = useState('original.png');
  const [changedFileName, setChangedFileName] = useState('classified.png');

  const viewRef = useRef<HTMLDivElement>(null);
  const fadeSliderTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isVSliderDragging && viewRef.current) {
        const rect = viewRef.current.getBoundingClientRect();
        const newSliderPos = ((e.clientX - rect.left) / rect.width) * 100;
        setVSliderPos(Math.max(0, Math.min(100, newSliderPos)));
      }
      
      if (isFadeSliderDragging && fadeSliderTrackRef.current) {
        const rect = fadeSliderTrackRef.current.getBoundingClientRect();
        const newSliderPos = ((e.clientX - rect.left) / rect.width) * 100;
        setFadeSliderPos(Math.max(0, Math.min(100, newSliderPos)));
      }
    };

    const handleMouseUp = () => {
      setIsVSliderDragging(false);
      setIsFadeSliderDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVSliderDragging, isFadeSliderDragging]);

  const handleZoomChange = (newZoomValue: number) => {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoomValue));

    if (viewRef.current) {
        const rect = viewRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const centerPointTo = {
            x: (centerX - pan.x) / zoom,
            y: (centerY - pan.y) / zoom
        };

        const newPan = {
            x: centerX - centerPointTo.x * newZoom,
            y: centerY - centerPointTo.y * newZoom
        };

        setZoom(newZoom);
        setPan(newPan);
    } else {
        setZoom(newZoom);
    }
  };

  const handlePanStart = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanDisabled || (!originalImage && !changedImage) || e.button !== 0) return;
    setIsPanning(true);
    setStartPanPoint({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  
  const handlePanMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPanPoint.x,
      y: e.clientY - startPanPoint.y,
    });
  };
  
  const handlePanEnd = () => setIsPanning(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0',
  };

  const ControlButton = ({ id, icon, label, isActive }: { id: ComparisonMode; icon: React.ReactNode; label: string; isActive: boolean }) => (
    <button
      onClick={() => setMode(id)}
      className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
        isActive ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
  const ActionButton = ({ icon, label, onClick, disabled = false }: { icon: React.ReactNode; label: string; onClick?: () => void, disabled?: boolean}) => (
    <button onClick={onClick} disabled={disabled} className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md transition-colors bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
      {icon}
      <span>{label}</span>
    </button>
  );
  
  const leftPanelControls = [
      { id: ComparisonMode.Split, icon: <SplitIcon className="h-4 w-4" />, label: 'Split' },
      { id: ComparisonMode.Fade, icon: <FadeIcon className="h-4 w-4" />, label: 'Fade' },
      { id: ComparisonMode.Difference, icon: <DifferenceIcon className="h-4 w-4" />, label: 'Difference' },
  ];

  const handleFileSelected = async (file: File, imageSetter: (img: string | null) => void, nameSetter: (name: string) => void) => {
    if (file && file.type.startsWith('image/')) {
        try {
            nameSetter(file.name);
            const dataUrl = await fileToDataUrl(file);
            imageSetter(dataUrl);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, imageSetter: (img: string | null) => void, nameSetter: (name: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0], imageSetter, nameSetter);
    }
    e.target.value = '';
  };

  const FileHeader = ({ title, onFileChange }: { title: string, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex justify-between items-center mb-2 px-1">
      <h3 className="text-sm font-medium text-gray-500 truncate" title={title}>{title}</h3>
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer flex-shrink-0">
        <OpenFileIcon className="h-5 w-5" />
        <span>Open file</span>
        <input type="file" className="sr-only" accept="image/*" onChange={onFileChange}/>
      </label>
    </div>
  );
  
  const isComparisonMode = mode !== null && originalImage && changedImage;
  const isDraggable = originalImage || changedImage;
  const cursorClass = !isDraggable ? '' : (isPanning ? 'cursor-grabbing' : 'cursor-grab');

  return (
    <div className={`grid grid-cols-1 ${isComparisonMode ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
      <div className={isComparisonMode ? 'lg:col-span-1' : ''}>
        <FileHeader title={originalFileName} onFileChange={(e) => handleFileInputChange(e, setOriginalImage, setOriginalFileName)} />
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 mb-2 flex space-x-1">
          {leftPanelControls.map(control => (
            <ControlButton 
                key={control.id}
                {...control}
                isActive={mode === control.id}
            />
          ))}
        </div>
        
        <div
          ref={viewRef}
          className={`relative w-full aspect-[16/9] bg-white border border-gray-200 rounded-lg overflow-hidden select-none ${cursorClass}`}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
        >
          {!originalImage ? (
            <ImageUploader onFileSelect={(file) => handleFileSelected(file, setOriginalImage, setOriginalFileName)} />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full" style={transformStyle}>
              <img src={originalImage} className="absolute top-0 left-0 object-contain h-full w-full" alt="Original" />
              
              {isComparisonMode && (
                <>
                  {mode === 'split' && (
                    <>
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - vSliderPos}% 0 0)`}}>
                        <img src={changedImage} className="absolute top-0 left-0 object-contain h-full w-full" alt="Changed" />
                      </div>
                      <div className="absolute top-0 bottom-0 w-0.5 bg-slate-200/75 pointer-events-none" style={{ left: `${vSliderPos}%` }}>
                        <div onMouseDown={(e) => { e.stopPropagation(); setIsVSliderDragging(true); }}
                             className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-ew-resize pointer-events-auto">
                           <SliderHandleIcon className="w-5 h-5 text-slate-700" />
                        </div>
                      </div>
                    </>
                  )}
                  {mode === 'fade' && (
                      <img src={changedImage} className="absolute top-0 left-0 object-contain h-full w-full" style={{ opacity: fadeSliderPos/100 }} alt="Changed" />
                  )}
                  {(mode === 'difference') && changedImage && (
                     <img src={changedImage} className="absolute top-0 left-0 object-contain h-full w-full opacity-50" alt="Changed" />
                  )}
                </>
              )}
            </div>
          )}
          {mode === 'fade' && isComparisonMode && (
             <div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-10 flex items-center justify-center pointer-events-none"
                onMouseEnter={() => setIsPanDisabled(true)} onMouseLeave={() => setIsPanDisabled(false)}
            >
                <div ref={fadeSliderTrackRef} className="relative w-full h-full flex items-center pointer-events-auto">
                    <div className="absolute left-0 right-0 h-0.5 bg-slate-200/75 rounded-full"></div>
                    <div
                        onMouseDown={(e) => { e.stopPropagation(); setIsFadeSliderDragging(true); }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-ew-resize"
                        style={{ left: `${fadeSliderPos}%` }}
                    >
                        <SliderHandleIcon className="w-5 h-5 text-slate-700" />
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={isComparisonMode ? 'hidden' : ''}>
         <FileHeader title={changedFileName} onFileChange={(e) => handleFileInputChange(e, setChangedImage, setChangedFileName)} />
         <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 mb-2 flex flex-wrap gap-1">
             <ActionButton icon={<HighlightIcon className="h-4 w-4" />} label="Highlight" disabled />
             <ActionButton icon={<FileDetailsIcon className="h-4 w-4" />} label="File details" disabled />
              <div className="flex items-center space-x-1 bg-white rounded-md border border-gray-200 shadow-sm text-sm">
                  <select
                      value={zoom}
                      onChange={(e) => handleZoomChange(Number(e.target.value))}
                      className="font-mono bg-transparent outline-none border-none focus:ring-0 focus:border-blue-500 py-1.5 pl-3 pr-2 cursor-pointer rounded-md"
                      aria-label="Zoom level"
                  >
                      {zoomLevels.map(level => (
                          <option key={level} value={level}>
                              {Math.round(level * 100)}%
                          </option>
                      ))}
                      {!zoomLevels.includes(zoom) && (
                          <option value={zoom}>
                              {Math.round(zoom * 100)}%
                          </option>
                      )}
                  </select>
              </div>
             <ActionButton onClick={resetView} icon={<ResetIcon className="h-4 w-4" />} label="Reset" />
             <ActionButton icon={<ExportIcon className="h-4 w-4" />} label="Export as PNG" disabled />
         </div>
         <div
            className={`relative w-full aspect-[16/9] bg-white border border-gray-200 rounded-lg overflow-hidden select-none ${cursorClass}`}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
              {changedImage ? (
                  <div className="absolute top-0 left-0 w-full h-full" style={transformStyle}>
                      <img src={changedImage} className="object-contain h-full w-full" />
                  </div>
              ) : <ImageUploader onFileSelect={(file) => handleFileSelected(file, setChangedImage, setChangedFileName)} />}
          </div>
      </div>
    </div>
  );
};

export default ImageComparator;
