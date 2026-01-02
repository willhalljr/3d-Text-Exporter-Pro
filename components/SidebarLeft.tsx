import React from 'react';
import { MATERIAL_PRESETS } from '../constants';
import { MaterialSettings, MaterialPreset } from '../types';
import { Package, Star, Plus, Trash2, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

interface SidebarLeftProps {
  onApplyPreset: (settings: Partial<MaterialSettings>) => void;
  onSaveCustom: () => void;
  customPresets: MaterialPreset[];
  onDeleteCustom: (id: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  onApplyPreset, onSaveCustom, customPresets, onDeleteCustom, isCollapsed, onToggle 
}) => {
  const categories = Array.from(new Set(MATERIAL_PRESETS.map(p => p.category)));

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#121212] border-r border-[#262626] h-full flex flex-col items-center py-4 gap-6 transition-all">
        <button onClick={onToggle} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="h-px w-6 bg-white/5" />
        <Palette className="w-5 h-5 text-blue-500 opacity-50" />
        <div className="flex-1 flex flex-col justify-center">
           <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Materials</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-[#121212] border-r border-[#262626] h-full flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
      <div className="p-4 border-b border-[#262626] flex items-center justify-between sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" />
          <h2 className="font-black text-[11px] uppercase tracking-widest">Materials</h2>
        </div>
        <div className="flex items-center gap-1">
          <button 
              onClick={onSaveCustom}
              className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-all border border-blue-500/30"
              title="Save Preset"
            >
              <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggle} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-10 scroll-smooth pb-20">
        <section>
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                <Star className="w-3 h-3" /> Saved Styles
             </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {customPresets.map(preset => (
              <div 
                key={preset.id}
                className="group relative flex flex-col items-center p-3 bg-[#1a1a1a] rounded-xl border border-[#262626] hover:border-blue-500/50 cursor-pointer transition-all active:scale-95 shadow-md overflow-hidden"
                onClick={() => onApplyPreset(preset.settings)}
              >
                <div 
                  className="w-14 h-14 rounded-full mb-2 shadow-xl border border-white/5 overflow-hidden relative"
                  style={{ 
                    backgroundColor: (preset.settings.color as string) || '#ffffff',
                    backgroundImage: preset.settings.map ? `url(${preset.settings.map})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/20 pointer-events-none" />
                </div>
                <span className="text-[9px] text-gray-400 truncate w-full text-center uppercase tracking-tighter font-bold">{preset.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCustom(preset.id); }}
                  className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {customPresets.length === 0 && (
              <div className="col-span-2 py-8 text-center border border-dashed border-[#262626] rounded-xl text-gray-700 text-[9px] uppercase tracking-widest font-black">
                Empty Collection
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SidebarLeft;