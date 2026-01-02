import React, { useRef } from 'react';
import { TextSettings, MaterialSettings } from '../types';
import { Settings, Type, Layout, Image as ImageIcon, Box, RotateCcw, Download, Palette, Layers, X, Move, Upload, ImagePlus, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarRightProps {
  textSettings: TextSettings;
  setTextSettings: (s: TextSettings) => void;
  materialSettings: MaterialSettings;
  setMaterialSettings: (s: MaterialSettings) => void;
  onExportGLB: () => void;
  onExportImage: (scale: number) => void;
  onImportGLB: (file: File) => void;
  onResetView: () => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({
  textSettings, setTextSettings,
  materialSettings, setMaterialSettings,
  onExportGLB, onExportImage, onImportGLB, onResetView,
  autoRotate, setAutoRotate, isCollapsed, onToggle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateText = (key: keyof TextSettings, val: any) => setTextSettings({ ...textSettings, [key]: val });
  const updateMaterial = (key: keyof MaterialSettings, val: any) => setMaterialSettings({ ...materialSettings, [key]: val });

  const handleTextureUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    updateMaterial('map', url);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#121212] border-l border-[#262626] h-full flex flex-col items-center py-4 gap-6 transition-all">
        <button onClick={onToggle} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="h-px w-6 bg-white/5" />
        <Settings className="w-5 h-5 text-blue-500 opacity-50" />
        <div className="flex-1 flex flex-col justify-center">
           <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Properties</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#121212] border-l border-[#262626] h-full flex flex-col overflow-y-auto pb-10 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-[#262626] flex items-center justify-between sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center gap-2">
           <Settings className="w-5 h-5 text-blue-400" />
           <h2 className="font-black text-[11px] uppercase tracking-widest">Properties</h2>
        </div>
        <button onClick={onToggle} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500">
           <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-8">
        <section className="bg-[#1a1a1a] p-4 rounded-2xl border border-blue-500/20 shadow-lg">
          <div className="flex items-center gap-2 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
             <ImagePlus className="w-4 h-4" /> Main Texture
          </div>
          <div className="space-y-3">
              <label className={`group flex flex-col items-center justify-center min-h-[100px] border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${materialSettings.map ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#0a0a0a] hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
                {materialSettings.map ? (
                  <div className="flex items-center gap-3 w-full px-3">
                     <div className="w-14 h-14 rounded-lg bg-black border border-white/10 shrink-0 overflow-hidden"><img src={materialSettings.map} alt="tex" className="w-full h-full object-cover" /></div>
                     <div className="flex-1 min-w-0"><p className="text-[10px] text-white truncate font-bold">Custom Map</p></div>
                     <button onClick={(e) => { e.preventDefault(); updateMaterial('map', undefined); }} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="text-center py-4 px-4">
                    <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-blue-400" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Upload Image</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleTextureUpload(e.target.files[0])} />
              </label>
          </div>
        </section>

        <section className="space-y-6">
          <textarea value={textSettings.text} onChange={(e) => updateText('text', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-sm focus:border-blue-500 outline-none font-bold" rows={2} />
          
          <div className="space-y-3">
            <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest flex justify-between">Length <span>{textSettings.targetLength}m</span></label>
            <input type="range" min="1" max="25" step="0.1" value={textSettings.targetLength} onChange={(e) => updateText('targetLength', parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase">Extrude</label>
                <input type="number" step="0.05" value={textSettings.height} onChange={(e) => updateText('height', parseFloat(e.target.value))} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-2 text-xs font-mono" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase">Metallic</label>
                <input type="range" min="0" max="1" step="0.01" value={materialSettings.metalness} onChange={(e) => updateMaterial('metalness', parseFloat(e.target.value))} className="w-full accent-blue-500" />
             </div>
          </div>
        </section>

        <section className="pt-6 border-t border-[#262626] space-y-4">
          <button onClick={onExportGLB} className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group">
            <Box className="w-5 h-5 group-hover:scale-110" /> EXPORT GLB
          </button>
          <button onClick={() => onExportImage(1)} className="w-full py-3 bg-[#1a1a1a] hover:bg-[#262626] border border-[#333] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            Snapshot PNG
          </button>
        </section>
      </div>
    </div>
  );
};

export default SidebarRight;