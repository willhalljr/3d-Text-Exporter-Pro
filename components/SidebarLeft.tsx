
import React from 'react';
import { MATERIAL_PRESETS } from '../constants';
import { MaterialSettings, MaterialPreset } from '../types';
import { Package, Star, Plus, Trash2 } from 'lucide-react';

interface SidebarLeftProps {
  onApplyPreset: (settings: Partial<MaterialSettings>) => void;
  onSaveCustom: () => void;
  customPresets: MaterialPreset[];
  onDeleteCustom: (id: string) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onApplyPreset, onSaveCustom, customPresets, onDeleteCustom }) => {
  const categories = Array.from(new Set(MATERIAL_PRESETS.map(p => p.category)));

  return (
    <div className="w-72 bg-[#121212] border-r border-[#262626] h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#262626] flex items-center justify-between sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Materials</h2>
        </div>
        <button 
            onClick={onSaveCustom}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded text-[10px] font-bold transition-all border border-blue-500/30"
            title="Save Current Style"
          >
            <Plus className="w-3 h-3" /> SAVE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-10 scroll-smooth pb-20">
        {/* Saved Presets */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Star className="w-3 h-3" /> Your Collection
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
                  className="w-16 h-16 rounded-full mb-2 shadow-xl border border-white/5 overflow-hidden relative"
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
              <div className="col-span-2 py-8 text-center border border-dashed border-[#262626] rounded-xl text-gray-700 text-[10px] uppercase tracking-widest font-bold">
                No Presets Saved Yet
              </div>
            )}
          </div>
        </section>

        {/* Categories (Empty if MATERIAL_PRESETS is empty) */}
        {categories.map(category => (
          <section key={category}>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 border-b border-[#262626] pb-1 flex justify-between">
              {category}
              <span className="text-gray-700 text-[9px]">{MATERIAL_PRESETS.filter(p => p.category === category).length}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {MATERIAL_PRESETS.filter(p => p.category === category).map(preset => (
                <div 
                  key={preset.id}
                  className="flex flex-col items-center p-2 group cursor-pointer transition-transform active:scale-95"
                  onClick={() => onApplyPreset(preset.settings)}
                >
                  <div 
                    className="w-20 h-20 rounded-full mb-2 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden relative transition-all group-hover:border-blue-500/40 group-hover:shadow-blue-500/10"
                    style={{ 
                      backgroundColor: (preset.settings.color as string) || '#ffffff',
                      backgroundImage: preset.settings.map ? `url(${preset.settings.map})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-white/30 pointer-events-none rounded-full mix-blend-overlay" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-full" />
                  </div>
                  <span className="text-[9px] text-gray-400 text-center uppercase tracking-tighter leading-tight group-hover:text-white transition-colors px-1 truncate w-full font-bold">
                    {preset.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
