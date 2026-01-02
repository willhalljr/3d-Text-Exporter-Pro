
import React, { useRef } from 'react';
import { TextSettings, MaterialSettings } from '../types';
import { Settings, Type, Layout, Image as ImageIcon, Box, RotateCcw, Download, Palette, Layers, X, Move, Upload, ImagePlus, RefreshCw } from 'lucide-react';

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
}

const SidebarRight: React.FC<SidebarRightProps> = ({
  textSettings, setTextSettings,
  materialSettings, setMaterialSettings,
  onExportGLB, onExportImage, onImportGLB, onResetView,
  autoRotate, setAutoRotate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateText = (key: keyof TextSettings, val: any) => setTextSettings({ ...textSettings, [key]: val });
  const updateMaterial = (key: keyof MaterialSettings, val: any) => setMaterialSettings({ ...materialSettings, [key]: val });

  const handleTextureUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    updateMaterial('map', url);
  };

  const clearTexture = () => {
    updateMaterial('map', undefined);
  };

  return (
    <div className="w-80 bg-[#121212] border-l border-[#262626] h-full flex flex-col overflow-y-auto pb-10">
      <div className="p-4 border-b border-[#262626] flex items-center gap-2 sticky top-0 bg-[#121212] z-10">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="font-semibold text-sm uppercase tracking-wider">Properties</h2>
      </div>

      <div className="p-4 space-y-8">
        {/* TEXTURE UPLOAD CENTER - FIXED TO 1 SLOT */}
        <section className="bg-[#1a1a1a] p-4 rounded-2xl border border-blue-500/20 shadow-lg">
          <div className="flex items-center gap-2 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
             <ImagePlus className="w-4 h-4" /> Main Texture
          </div>
          
          <div className="space-y-3">
              <div className="relative">
                <label className={`group flex flex-col items-center justify-center min-h-[100px] border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${materialSettings.map ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#0a0a0a] hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
                  {materialSettings.map ? (
                    <div className="flex items-center gap-3 w-full px-3">
                       <div className="w-14 h-14 rounded-lg bg-black flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                          <img src={materialSettings.map} alt="texture preview" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold text-blue-400 uppercase leading-none mb-1">Active Map</p>
                          <p className="text-[10px] text-white truncate font-medium">Click to change</p>
                       </div>
                       <button 
                         onClick={(e) => { e.preventDefault(); clearTexture(); }}
                         className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-lg transition-colors"
                       >
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 px-4">
                      <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-blue-400 transition-transform" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-blue-400">Upload Texture Image</p>
                      <p className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">Diffuse / Base Color</p>
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*" className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleTextureUpload(e.target.files[0])}
                  />
                </label>
              </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
             <div className="flex items-center justify-between text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                <span>Mapping Scale</span>
                <Move className="w-3 h-3" />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <input 
                    type="number" step="0.1" 
                    value={materialSettings.repeatX} 
                    onChange={(e) => updateMaterial('repeatX', parseFloat(e.target.value))} 
                    className="w-full bg-black border border-[#333] rounded-lg p-2 text-xs focus:border-blue-500 outline-none text-center font-mono" 
                  />
                  <p className="text-[8px] text-center text-gray-600 uppercase font-bold">Repeat X</p>
                </div>
                <div className="space-y-1">
                  <input 
                    type="number" step="0.1" 
                    value={materialSettings.repeatY} 
                    onChange={(e) => updateMaterial('repeatY', parseFloat(e.target.value))} 
                    className="w-full bg-black border border-[#333] rounded-lg p-2 text-xs focus:border-blue-500 outline-none text-center font-mono" 
                  />
                  <p className="text-[8px] text-center text-gray-600 uppercase font-bold">Repeat Y</p>
                </div>
             </div>
          </div>
        </section>

        {/* GEOMETRY SETTINGS */}
        <section>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
             <Type className="w-3 h-3" /> Geometry & Layout
          </div>
          <div className="space-y-4">
            <textarea
              value={textSettings.text}
              onChange={(e) => updateText('text', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-sm focus:border-blue-500 outline-none font-medium leading-relaxed"
              placeholder="Enter text..."
              rows={2}
            />
            
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase flex justify-between px-1">
                Target Length <span>{textSettings.targetLength}m</span>
              </label>
              <input 
                type="range" min="1" max="25" step="0.1"
                value={textSettings.targetLength}
                onChange={(e) => updateText('targetLength', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-ew-resize"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase flex justify-between px-1">
                  Spacing <span>{Math.round(textSettings.letterSpacing * 100)}%</span>
                </label>
                <input 
                  type="range" min="-0.1" max="0.5" step="0.01"
                  value={textSettings.letterSpacing}
                  onChange={(e) => updateText('letterSpacing', parseFloat(e.target.value))}
                  className="w-full accent-blue-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase flex justify-between px-1">
                  Line Gap <span>{textSettings.lineHeight}x</span>
                </label>
                <input 
                  type="range" min="0.5" max="2.5" step="0.1"
                  value={textSettings.lineHeight}
                  onChange={(e) => updateText('lineHeight', parseFloat(e.target.value))}
                  className="w-full accent-blue-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded-lg border border-[#333]">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-400">Fix Rendering Holes</span>
              </div>
              <input 
                type="checkbox" 
                checked={textSettings.invertHoles}
                onChange={(e) => updateText('invertHoles', e.target.checked)}
                className="w-5 h-5 rounded border-[#333] accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Extrusion</label>
                <input 
                  type="number" step="0.05"
                  value={textSettings.height}
                  onChange={(e) => updateText('height', parseFloat(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-2 text-sm text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Font Size</label>
                <input 
                  type="number" step="0.1"
                  value={textSettings.size}
                  onChange={(e) => updateText('size', parseFloat(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-2 text-sm text-center"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-gray-400">Bevel Details</span>
                <input 
                  type="checkbox" 
                  checked={textSettings.bevelEnabled}
                  onChange={(e) => updateText('bevelEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-[#333] accent-blue-500 cursor-pointer"
                />
              </div>
              {textSettings.bevelEnabled && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase">Bevel Size</label>
                    <input 
                      type="number" step="0.01"
                      value={textSettings.bevelSize}
                      onChange={(e) => updateText('bevelSize', parseFloat(e.target.value))}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-2 text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase">Bevel Thick</label>
                    <input 
                      type="number" step="0.01"
                      value={textSettings.bevelThickness}
                      onChange={(e) => updateText('bevelThickness', parseFloat(e.target.value))}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-2 text-sm text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MATERIAL APPEARANCE */}
        <section>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
             <Palette className="w-3 h-3" /> Appearance
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <input 
                  type="color"
                  value={materialSettings.color}
                  onChange={(e) => updateMaterial('color', e.target.value)}
                  className="w-12 h-12 bg-transparent cursor-pointer rounded-xl overflow-hidden border-2 border-white/10 shadow-lg"
               />
               <input 
                  type="text"
                  value={materialSettings.color}
                  onChange={(e) => updateMaterial('color', e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-xs uppercase font-mono tracking-wider focus:border-blue-500 outline-none shadow-inner"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase">Metallic</label>
                <input 
                    type="range" min="0" max="1" step="0.01"
                    value={materialSettings.metalness}
                    onChange={(e) => updateMaterial('metalness', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase">Roughness</label>
                <input 
                    type="range" min="0" max="1" step="0.01"
                    value={materialSettings.roughness}
                    onChange={(e) => updateMaterial('roughness', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] text-gray-500 uppercase flex justify-between px-1">
                 Environment Power <span>{materialSettings.envMapIntensity}x</span>
               </label>
               <input 
                  type="range" min="0" max="8" step="0.1"
                  value={materialSettings.envMapIntensity}
                  onChange={(e) => updateMaterial('envMapIntensity', parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
               />
            </div>
          </div>
        </section>

        {/* EXPORT / FINISH */}
        <section className="space-y-3 pt-6 border-t border-[#262626]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3 px-1">
             <Download className="w-3 h-3" /> Finish Project
          </div>
          
          <button 
            onClick={onExportGLB}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 group"
          >
            <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" /> DOWNLOAD GLB
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onExportImage(1)}
              className="flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] hover:bg-[#262626] border border-[#333] rounded-xl text-xs transition-colors font-bold uppercase tracking-widest"
            >
              <ImageIcon className="w-3 h-3 text-blue-400" /> PNG
            </button>
            <button 
              onClick={() => onExportImage(2)}
              className="flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] hover:bg-[#262626] border border-[#333] rounded-xl text-xs transition-colors font-bold uppercase tracking-widest"
            >
              4K RENDER
            </button>
          </div>

          <div className="pt-2">
            <input 
              type="file" accept=".glb"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) onImportGLB(e.target.files[0]);
              }}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-dashed border-[#262626] rounded-xl text-[10px] text-gray-500 hover:text-white transition-all uppercase tracking-[0.2em] font-black"
            >
              VALIDATE GLB FILE
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SidebarRight;
