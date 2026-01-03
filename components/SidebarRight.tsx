import React from 'react';
import { MaterialSettings, TextSettings } from '../types';
import { Settings, Box, X, Upload, ImagePlus, ChevronRight, ChevronLeft, RefreshCw, Maximize, Palette, Sun, Layers } from 'lucide-react';

interface SidebarRightProps {
  materialSettings: MaterialSettings;
  setMaterialSettings: (s: MaterialSettings) => void;
  textSettings: TextSettings;
  setTextSettings: (s: TextSettings) => void;
  onExportGLB: () => void;
  onExportImage: (scale: number) => void;
  onImportGLB: (file: File) => void;
  onResetView: () => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({
  materialSettings, setMaterialSettings,
  textSettings, setTextSettings,
  onExportGLB, onExportImage, onImportGLB, onResetView,
  autoRotate, setAutoRotate, isCollapsed, isMobile, onToggle
}) => {
  const updateMaterial = (key: keyof MaterialSettings, val: any) => setMaterialSettings({ ...materialSettings, [key]: val });
  const updateText = (key: keyof TextSettings, val: any) => setTextSettings({ ...textSettings, [key]: val });

  const handleTextureUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    updateMaterial('map', url);
  };

  const containerClass = `h-full bg-[#0f0f0f] border-l border-[#222] flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden shrink-0 
    ${isMobile ? 'absolute right-0 top-0 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]' : 'relative'}
    ${isCollapsed ? 'w-12' : (isMobile ? 'w-full' : 'w-80')}`;

  return (
    <div className={containerClass}>
      <div className="flex h-full w-full">
        {/* Persistent Toggle Bar */}
        <div className="w-12 border-r border-[#222] flex flex-col items-center py-4 gap-6 shrink-0 bg-[#0a0a0a]">
          <button onClick={onToggle} className="p-2.5 hover:bg-blue-600/20 rounded-xl text-gray-400 hover:text-blue-400 transition-all active:scale-90">
            {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <div className="h-px w-6 bg-white/5" />
          <div className="flex-1 flex flex-col justify-center">
             <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 select-none">Properties</span>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex flex-col w-full transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f] shrink-0">
            <h2 className="font-black text-[11px] uppercase tracking-[0.3em] text-white">Global Settings</h2>
            {isMobile && !isCollapsed && (
                <button onClick={onToggle} className="p-1.5 bg-white/5 rounded-lg text-gray-500"><X className="w-4 h-4" /></button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth">
            {/* Color & Material Finish */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Palette className="w-4 h-4" /> Material & Finish
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Base Color</label>
                  <div className="flex gap-2 items-center bg-black border border-[#222] p-1.5 rounded-xl">
                    <input 
                      type="color" 
                      value={materialSettings.color} 
                      onChange={(e) => updateMaterial('color', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{materialSettings.color}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Metalic</label>
                  <input type="range" min="0" max="1" step="0.01" value={materialSettings.metalness} onChange={(e) => updateMaterial('metalness', parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 rounded-full bg-black appearance-none cursor-pointer mt-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Roughness</label>
                  <input type="range" min="0" max="1" step="0.01" value={materialSettings.roughness} onChange={(e) => updateMaterial('roughness', parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 rounded-full bg-black appearance-none cursor-pointer mt-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Reflections</label>
                  <input type="range" min="0" max="5" step="0.1" value={materialSettings.envMapIntensity} onChange={(e) => updateMaterial('envMapIntensity', parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 rounded-full bg-black appearance-none cursor-pointer mt-3" />
                </div>
              </div>
            </section>

            {/* Geometry Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Layers className="w-4 h-4" /> Geometry
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider flex justify-between items-center">
                  Total Width <span>{textSettings.targetLength}m</span>
                </label>
                <input type="range" min="1" max="30" step="0.1" value={textSettings.targetLength} onChange={(e) => updateText('targetLength', parseFloat(e.target.value))} className="w-full accent-blue-600 h-2 rounded-full bg-black appearance-none cursor-pointer border border-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Depth</label>
                    <input type="number" step="0.05" value={textSettings.height} onChange={(e) => updateText('height', parseFloat(e.target.value))} className="w-full bg-black border border-[#222] rounded-xl p-3 text-xs font-mono text-blue-400 focus:border-blue-500 outline-none shadow-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Bevel</label>
                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => updateText('bevelEnabled', !textSettings.bevelEnabled)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${textSettings.bevelEnabled ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 border border-[#222]'}`}
                      >
                        {textSettings.bevelEnabled ? 'On' : 'Off'}
                      </button>
                    </div>
                 </div>
              </div>
            </section>

            {/* Texture Section */}
            <section className="bg-black p-5 rounded-3xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                 <ImagePlus className="w-4 h-4 text-blue-500/50" /> Surface Texture
              </div>
              <div className="space-y-4">
                  <label className={`group flex flex-col items-center justify-center min-h-[120px] border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${materialSettings.map ? 'border-blue-500 bg-blue-500/5' : 'border-[#222] bg-black hover:border-blue-500/30'}`}>
                    {materialSettings.map ? (
                      <div className="flex items-center gap-4 w-full px-4">
                         <div className="w-16 h-16 rounded-xl bg-black border border-white/10 shrink-0 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                           <img src={materialSettings.map} alt="texture" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-[10px] text-blue-400 truncate font-black uppercase tracking-widest">Active Layer</p>
                         </div>
                         <button onClick={(e) => { e.preventDefault(); updateMaterial('map', undefined); }} className="p-2.5 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <Upload className="w-7 h-7 text-gray-700 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Upload Map</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleTextureUpload(e.target.files[0])} />
                  </label>
              </div>
            </section>

            {/* Export Actions */}
            <section className="pt-8 border-t border-[#222] space-y-4">
              <button onClick={onExportGLB} className="w-full flex items-center justify-center gap-3 py-4.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] group text-[11px] tracking-[0.2em]">
                <Box className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" /> EXPORT GLB
              </button>
              <div className="grid grid-cols-2 gap-3 pb-8">
                <button onClick={() => onExportImage(1)} className="py-3.5 bg-white/5 hover:bg-white/10 border border-[#222] rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-white flex items-center justify-center gap-2">
                  <Maximize className="w-3.5 h-3.5" /> Snapshot
                </button>
                <button onClick={onResetView} className="py-3.5 bg-white/5 hover:bg-white/10 border border-[#222] rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-white flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" /> Center
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;