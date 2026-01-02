
import React, { useState } from 'react';
import { GOOGLE_FONTS } from '../constants';
import { FontData } from '../types';
import { Search, Upload, X, Check } from 'lucide-react';

interface FontDrawerProps {
  currentFont: FontData;
  onSelect: (font: FontData) => void;
  uploadedFonts: FontData[];
  onUpload: (file: File) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FontDrawer: React.FC<FontDrawerProps> = ({ currentFont, onSelect, uploadedFonts, onUpload, isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  const filteredGoogle = GOOGLE_FONTS.filter(f => f.family.toLowerCase().includes(search.toLowerCase()));
  const filteredUploads = uploadedFonts.filter(f => f.family.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#262626] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Font Library</h2>
            <p className="text-sm text-gray-500">Choose a font or upload your own .ttf/.otf</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#262626] rounded-full text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text"
                placeholder="Search fonts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <label className="flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors font-semibold">
              <Upload className="w-4 h-4" />
              <span>UPLOAD</span>
              <input 
                type="file" accept=".ttf,.otf,.woff,.woff2"
                onChange={(e) => {
                  if (e.target.files?.[0]) onUpload(e.target.files[0]);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
          {/* Uploaded Section */}
          {(filteredUploads.length > 0 || uploadedFonts.length > 0) && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Your Fonts</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredUploads.map(font => (
                  <button 
                    key={font.url}
                    onClick={() => onSelect(font)}
                    className={`p-4 rounded-xl border text-left transition-all ${currentFont.url === font.url ? 'bg-blue-600/10 border-blue-500' : 'bg-[#1a1a1a] border-[#262626] hover:border-gray-600'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest">UPLOADED</span>
                       {currentFont.url === font.url && <Check className="w-3 h-3 text-blue-500" />}
                    </div>
                    <div className="text-xl mb-1">Aa</div>
                    <div className="text-sm font-medium truncate">{font.family}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Google Fonts Section */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Google Fonts</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredGoogle.map(font => (
                <button 
                  key={font.url}
                  onClick={() => onSelect(font as FontData)}
                  className={`p-4 rounded-xl border text-left transition-all ${currentFont.url === font.url ? 'bg-blue-600/10 border-blue-500' : 'bg-[#1a1a1a] border-[#262626] hover:border-gray-600'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest">GOOGLE</span>
                     {currentFont.url === font.url && <Check className="w-3 h-3 text-blue-500" />}
                  </div>
                  <div className="text-2xl mb-1">Aa</div>
                  <div className="text-sm font-medium truncate">{font.family}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FontDrawer;
