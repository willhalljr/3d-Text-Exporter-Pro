import React, { useState, useRef, useEffect } from 'react';
import Viewer, { ViewerRef } from './components/Viewer';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import FontDrawer from './components/FontDrawer';
import { INITIAL_TEXT_SETTINGS, INITIAL_MATERIAL_SETTINGS, GOOGLE_FONTS } from './constants';
import { TextSettings, MaterialSettings, FontData, MaterialPreset } from './types';
import JSZip from 'https://esm.sh/jszip';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [textSettings, setTextSettings] = useState<TextSettings>(INITIAL_TEXT_SETTINGS);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>(INITIAL_MATERIAL_SETTINGS);
  const [currentFont, setCurrentFont] = useState<FontData>(GOOGLE_FONTS[0] as FontData);
  const [uploadedFonts, setUploadedFonts] = useState<FontData[]>([]);
  const [customPresets, setCustomPresets] = useState<MaterialPreset[]>([]);
  const [isFontDrawerOpen, setIsFontDrawerOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const viewerRef = useRef<ViewerRef>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsLeftCollapsed(true);
        setIsRightCollapsed(true);
      } else {
        setIsRightCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('README.txt', '3D Text Exporter Pro - Source Bundle\nOptimized for Web Deployment.');
    zip.file('project_config.json', JSON.stringify({ textSettings, materialSettings, currentFont }, null, 2));
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `3d-text-project.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyPreset = (settings: Partial<MaterialSettings>) => {
    setMaterialSettings(prev => ({ ...prev, ...settings }));
  };

  const handleSaveCustom = () => {
    const name = prompt("Name your style:", `Preset ${customPresets.length + 1}`);
    if (!name) return;
    const newPreset: MaterialPreset = {
      id: Date.now().toString(),
      name: name,
      category: 'Saved',
      settings: { ...materialSettings }
    };
    setCustomPresets(prev => [...prev, newPreset]);
  };

  const handleDeleteCustom = (id: string) => {
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleFontUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const newFont: FontData = { family: file.name.split('.')[0], url, source: 'upload' };
    setUploadedFonts(prev => [...prev, newFont]);
    setCurrentFont(newFont);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-inter select-none relative">
      {/* Sidebar Left */}
      <SidebarLeft 
        textSettings={textSettings}
        setTextSettings={setTextSettings}
        onApplyPreset={handleApplyPreset}
        onSaveCustom={handleSaveCustom}
        customPresets={customPresets}
        onDeleteCustom={handleDeleteCustom}
        isCollapsed={isLeftCollapsed}
        isMobile={isMobile}
        onToggle={() => {
          setIsLeftCollapsed(!isLeftCollapsed);
          if (isMobile) setIsRightCollapsed(true);
        }}
        onDownloadZip={downloadZip}
        currentFont={currentFont}
        onOpenFontDrawer={() => setIsFontDrawerOpen(true)}
      />

      {/* Main Viewport */}
      <div className="flex-1 relative bg-[#050505] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Processing Geometry...</span>
          </div>
        )}

        <Viewer 
          ref={viewerRef}
          textSettings={textSettings}
          materialSettings={materialSettings}
          currentFontUrl={currentFont.url}
          autoRotate={autoRotate}
          onLoadingStateChange={setIsLoading}
        />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-50">
           <div className="px-6 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[9px] uppercase tracking-[0.4em] font-black text-gray-400 shadow-2xl">
             VIBE CORE ENGINE v3.4.5
           </div>
        </div>
      </div>

      {/* Sidebar Right */}
      <SidebarRight 
        materialSettings={materialSettings}
        setMaterialSettings={setMaterialSettings}
        textSettings={textSettings}
        setTextSettings={setTextSettings}
        onExportGLB={() => viewerRef.current?.exportGLB(`3d-text-${textSettings.text.replace(/\s/g, '-').slice(0, 10)}`)}
        onExportImage={(scale) => viewerRef.current?.exportImage(scale)}
        onImportGLB={(file) => viewerRef.current?.importGLB(file)}
        onResetView={() => viewerRef.current?.resetView()}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        isCollapsed={isRightCollapsed}
        isMobile={isMobile}
        onToggle={() => {
          setIsRightCollapsed(!isRightCollapsed);
          if (isMobile) setIsLeftCollapsed(true);
        }}
      />

      <FontDrawer 
        isOpen={isFontDrawerOpen}
        onClose={() => setIsFontDrawerOpen(false)}
        currentFont={currentFont}
        onSelect={(font) => { setCurrentFont(font); setIsFontDrawerOpen(false); }}
        uploadedFonts={uploadedFonts}
        onUpload={handleFontUpload}
      />
    </div>
  );
};

export default App;