import React from 'react';
import { MaterialSettings, MaterialPreset, TextSettings, FontData } from '../types';
import { Star, Plus, Trash2, ChevronLeft, ChevronRight, Palette, Type, FileArchive, MousePointer2, X } from 'lucide-react';

interface SidebarLeftProps {
  textSettings: TextSettings;
  setTextSettings: (s: TextSettings) => void;
  onApplyPreset: (settings: Partial<MaterialSettings>) => void;
  onSaveCustom: () => void;
  customPresets: MaterialPreset[];
  onDeleteCustom: (id: string) => void;
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onDownloadZip: () => void;
  currentFont: FontData;
  onOpenFontDrawer: () => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  textSettings, setTextSettings, onApplyPreset, onSaveCustom, customPresets, 
  onDeleteCustom, isCollapsed, isMobile, onToggle, onDownloadZip, currentFont, onOpenFontDrawer
}) => {
  const updateText = (val: string) => setTextSettings({ ...textSettings, text: val });

  const containerClass = `h-full bg-[#0f0f0f] border-r border-[#222] flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden shrink-0 
    ${isMobile ? 'absolute left-0 top-0 shadow-[20px_0_50px_rgba(0,0,0,0.8)]' : 'relative'}
    ${isCollapsed ? 'w-12' : (isMobile ? 'w-full' : 'w-80')}`;

  return (
    <div className={containerClass}>
      <div className="flex h-full w-full">
        {/* Persistent Toggle Bar */}
        <div className="w-12 border-r border-[#222] flex flex-col items-center py-4 gap-6 shrink-0 bg-[#0a0a0a]">
          <button onClick={onToggle} className="p-2.5 hover:bg-blue-600/20 rounded-xl text-gray-500 hover:text-blue-400 transition-all active:scale-90">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <div className="h-px w-6 bg-white/5" />
          <div className="flex-1 flex flex-col justify-center">
             <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 select-none">Design Center</span>
          </div>
        </div>

        {/* Content - Hidden when collapsed */}
        <div className={`flex flex-col w-full transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f] shrink-0">
            <h2 className="font-black text-[11px] uppercase tracking-[0.3em] text-white">Design Center</h2>
            <div className="flex gap-2">
              <button 
                  onClick={onSaveCustom}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-all border border-blue-500/30 text-[9px] font-black uppercase"
                >
                  <Plus className="w-3.5 h-3.5" /> Save Style
              </button>
              {isMobile && !isCollapsed && (
                <button onClick={onToggle} className="p-1.5 bg-white/5 rounded-lg text-gray-500"><X className="w-4 h-4" /></button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Type className="w-4 h-4" /> Text Content
              </div>
              <textarea 
                value={textSettings.text} 
                onChange={(e) => updateText(e.target.value)} 
                className="w-full bg-black border border-[#222] rounded-2xl p-4 text-sm focus:border-blue-500 outline-none font-bold text-white transition-all min-h-[100px] resize-none shadow-inner" 
                placeholder="Type here..."
                rows={2} 
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <MousePointer2 className="w-4 h-4" /> Typography
              </div>
              <button 
                onClick={onOpenFontDrawer}
                className="w-full flex items-center justify-between p-5 bg-black border border-[#222] hover:border-blue-500/50 rounded-2xl transition-all group shadow-sm"
              >
                <div className="flex flex-col items-start text-left">
                   <span className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-wider">Active Typeface</span>
                   <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{currentFont.family}</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl text-gray-500 group-hover:text-blue-400 transition-all">
                   <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </section>

            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Palette className="w-4 h-4" /> Style Presets
              </div>
              <div className="grid grid-cols-2 gap-3">
                {customPresets.map(preset => (
                  <div 
                    key={preset.id}
                    className="group relative flex flex-col items-center p-3 bg-black rounded-2xl border border-[#222] hover:border-blue-500/50 cursor-pointer transition-all active:scale-95 overflow-hidden"
                    onClick={() => onApplyPreset(preset.settings)}
                  >
                    <div 
                      className="w-12 h-12 rounded-full mb-2 border border-white/5 overflow-hidden shadow-lg"
                      style={{ 
                        backgroundColor: (preset.settings.color as string) || '#ffffff',
                        backgroundImage: preset.settings.map ? `url(${preset.settings.map})` : 'none',
                        backgroundSize: 'cover'
                      }}
                    />
                    <span className="text-[9px] text-white truncate w-full text-center uppercase font-black tracking-tight">{preset.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteCustom(preset.id); }}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {customPresets.length === 0 && (
                  <div className="col-span-2 py-10 text-center border border-dashed border-[#222] rounded-2xl text-gray-600 text-[10px] uppercase font-black tracking-widest">
                    No Styles Saved
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="p-6 bg-[#0a0a0a] border-t border-[#222] shrink-0">
             <button 
               onClick={onDownloadZip}
               className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-[#222] text-gray-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
             >
                <FileArchive className="w-4 h-4" /> Export Assets
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;