import React, { useState, useRef, useEffect, useMemo } from 'react';
import Viewer, { ViewerRef } from './components/Viewer';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import FontDrawer from './components/FontDrawer';
import { INITIAL_TEXT_SETTINGS, INITIAL_MATERIAL_SETTINGS, GOOGLE_FONTS, PUBLIC_EMBED_URL } from './constants';
import { TextSettings, MaterialSettings, FontData, MaterialPreset } from './types';
import JSZip from 'https://esm.sh/jszip';
import { 
  Type as FontIcon, 
  X, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Github, 
  Globe, 
  ShoppingBag, 
  Terminal, 
  Check, 
  Info, 
  Layers, 
  FileCode,
  FolderOpen,
  Monitor,
  Box,
  Download,
  FileArchive,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

type SetupTab = 'github' | 'cloudflare' | 'shopify';

const App: React.FC = () => {
  const [textSettings, setTextSettings] = useState<TextSettings>(INITIAL_TEXT_SETTINGS);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>(INITIAL_MATERIAL_SETTINGS);
  const [currentFont, setCurrentFont] = useState<FontData>(GOOGLE_FONTS[0] as FontData);
  const [uploadedFonts, setUploadedFonts] = useState<FontData[]>([]);
  const [customPresets, setCustomPresets] = useState<MaterialPreset[]>([]);
  const [isFontDrawerOpen, setIsFontDrawerOpen] = useState(false);
  const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SetupTab>('github');
  const [selectedFile, setSelectedFile] = useState<string>('App.tsx');
  const [autoRotate, setAutoRotate] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Collapsible Sidebar States
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true); // Materials collapsed by default
  const [isRightCollapsed, setIsRightCollapsed] = useState(false); // Properties open by default

  const viewerRef = useRef<ViewerRef>(null);

  const urlValidation = useMemo(() => {
    const rawValue = PUBLIC_EMBED_URL;
    const url = rawValue.trim();
    const regexMatch = /^https:\/\/[^\s]+$/i.test(url);
    const isProduction = !url.includes('localhost') && !url.includes('127.0.0.1');
    const isValid = regexMatch && isProduction;
    return { isValid, url, rawValue, isProduction };
  }, []);

  // COMPLETE PROJECT SOURCE CODE FOR ZIP EXPORT
  const projectFiles: Record<string, string> = {
    'package.json': `{
  "name": "3d-text-exporter-pro",
  "private": true,
  "version": "1.2.5",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.462.0",
    "opentype.js": "^1.3.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.182.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.0"
  }
}`,
    'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext'
  }
});`,
    'wrangler.jsonc': `{
  "name": "3d-text-exporter-pro",
  "compatibility_date": "2026-01-02",
  "assets": {
    "directory": "./dist"
  }
}`,
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Text Exporter Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background: #0a0a0a; color: #fff; font-family: 'Inter', sans-serif; }
        canvas { display: block; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
</body>
</html>`,
    'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);`,
    'types.ts': `export interface TextSettings {
  text: string; size: number; height: number; curveSegments: number; bevelEnabled: boolean; bevelThickness: number; bevelSize: number; bevelOffset: number; bevelSegments: number; letterSpacing: number; lineHeight: number; align: 'left' | 'center' | 'right'; targetLength: number; lockThickness: boolean; invertHoles: boolean;
}
export interface MaterialSettings {
  color: string; metalness: number; roughness: number; envMapIntensity: number; emissive: string; emissiveIntensity: number; map?: string; repeatX: number; repeatY: number; rotation: number; offsetX: number; offsetY: number;
}
export interface FontData { family: string; url: string; source: 'google' | 'upload'; }
export interface MaterialPreset { id: string; name: string; category: string; settings: Partial<MaterialSettings>; }`,
    'constants.tsx': `export const PUBLIC_EMBED_URL = "${PUBLIC_EMBED_URL}";
export const INITIAL_TEXT_SETTINGS = { text: "Vibe Code", size: 1, height: 0.3, curveSegments: 24, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelOffset: 0, bevelSegments: 8, letterSpacing: 0.02, lineHeight: 1.2, align: 'center', targetLength: 8, lockThickness: true, invertHoles: false };
export const INITIAL_MATERIAL_SETTINGS = { color: "#0066ff", metalness: 0.1, roughness: 0.1, envMapIntensity: 2.0, emissive: "#000000", emissiveIntensity: 0, repeatX: 1, repeatY: 1, rotation: 0, offsetX: 0, offsetY: 0 };
export const GOOGLE_FONTS = [{ family: 'Righteous', url: 'https://cdn.jsdelivr.net/gh/google/fonts@master/ofl/righteous/Righteous-Regular.ttf' }];`,
    '_headers': `/*
  X-Frame-Options: ALLOWALL
  Access-Control-Allow-Origin: *
  Content-Security-Policy: frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com;`
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    Object.entries(projectFiles).forEach(([name, content]) => {
      zip.file(name, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `3d-text-exporter-project.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyPreset = (settings: Partial<MaterialSettings>) => {
    setMaterialSettings({ ...materialSettings, ...settings });
  };

  const handleSaveCustom = () => {
    const name = prompt("Enter a name for this style:", `Custom Style ${customPresets.length + 1}`);
    if (!name) return;
    const newPreset: MaterialPreset = {
      id: Date.now().toString(),
      name: name,
      category: 'Your Collection',
      settings: { ...materialSettings }
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('custom_presets_v2', JSON.stringify(updated));
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem('custom_presets_v2', JSON.stringify(updated));
  };

  const handleFontUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const newFont: FontData = { family: file.name.split('.')[0], url, source: 'upload' };
    setUploadedFonts([...uploadedFonts, newFont]);
    setCurrentFont(newFont);
  };

  const shopifyFullToolCode = `
{% comment %}
  3D Text Exporter - Pro Section
  Production URL: ${urlValidation.url}
{% endcomment %}
<div id="three-d-text-editor-{{ section.id }}" style="height: {{ section.settings.editor_height }}vh; position: relative; background: #000; overflow: hidden; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
  <iframe src="${urlValidation.url}" style="width: 100%; height: 100%; border: none; display: block;" allow="clipboard-read; clipboard-write; fullscreen"></iframe>
</div>
{% schema %}
{
  "name": "3D Text Editor Pro",
  "settings": [
    { "type": "range", "id": "editor_height", "min": 50, "max": 100, "step": 5, "unit": "vh", "label": "Height", "default": 90 }
  ],
  "presets": [{ "name": "3D Text Editor Pro" }]
}
{% endschema %}`.trim();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-inter">
      <SidebarLeft 
        onApplyPreset={handleApplyPreset}
        onSaveCustom={handleSaveCustom}
        customPresets={customPresets}
        onDeleteCustom={handleDeleteCustom}
        isCollapsed={isLeftCollapsed}
        onToggle={() => setIsLeftCollapsed(!isLeftCollapsed)}
      />

      <div className="flex-1 relative bg-gradient-to-b from-[#111] to-black transition-all">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button 
            onClick={() => setIsFontDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur-md hover:bg-[#262626] border border-white/10 rounded-xl shadow-2xl transition-all"
          >
            <FontIcon className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{currentFont.family}</span>
          </button>
          
          <button 
            onClick={() => setIsShopifyModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl shadow-2xl transition-all ${urlValidation.isValid ? 'bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'}`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Connect & Deploy</span>
          </button>
        </div>

        <Viewer 
          ref={viewerRef}
          textSettings={textSettings}
          materialSettings={materialSettings}
          currentFontUrl={currentFont.url}
          autoRotate={autoRotate}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
           <div className="px-5 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/5 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black">
             PBR Text Engine v3.2.5
           </div>
        </div>
      </div>

      <SidebarRight 
        textSettings={textSettings}
        setTextSettings={setTextSettings}
        materialSettings={materialSettings}
        setMaterialSettings={setMaterialSettings}
        onExportGLB={() => viewerRef.current?.exportGLB(`3d-text-${textSettings.text.replace(/\s/g, '-').slice(0, 10)}`)}
        onExportImage={(scale) => viewerRef.current?.exportImage(scale)}
        onImportGLB={(file) => viewerRef.current?.importGLB(file)}
        onResetView={() => viewerRef.current?.resetView()}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        isCollapsed={isRightCollapsed}
        onToggle={() => setIsRightCollapsed(!isRightCollapsed)}
      />

      <FontDrawer 
        isOpen={isFontDrawerOpen}
        onClose={() => setIsFontDrawerOpen(false)}
        currentFont={currentFont}
        onSelect={(font) => { setCurrentFont(font); setIsFontDrawerOpen(false); }}
        uploadedFonts={uploadedFonts}
        onUpload={handleFontUpload}
      />

      {isShopifyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4">
          <div className="bg-[#121212] border border-[#262626] rounded-[2.5rem] w-full max-w-6xl h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
             {/* Header */}
             <div className="p-8 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]/50">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase tracking-wider">Fast-Track Deployment</h2>
                      <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold">Download Bundle → Push to Github → Embed in Shopify</p>
                   </div>
                </div>
                <button onClick={() => setIsShopifyModalOpen(false)} className="p-4 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>

             <div className="flex-1 flex overflow-hidden">
                <div className="w-64 border-r border-[#262626] bg-[#0d0d0d] p-6 space-y-2">
                   <button onClick={() => setActiveTab('github')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'github' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:bg-white/5'}`}>
                     <Github className="w-4 h-4" /> 1. Project Files
                   </button>
                   <button onClick={() => setActiveTab('cloudflare')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'cloudflare' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:bg-white/5'}`}>
                     <Globe className="w-4 h-4" /> 2. Pages Config
                   </button>
                   <button onClick={() => setActiveTab('shopify')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'shopify' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-500 hover:bg-white/5'}`}>
                     <ShoppingBag className="w-4 h-4" /> 3. Theme Liquid
                   </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0a]">
                   {activeTab === 'github' && (
                     <div className="flex-1 flex overflow-hidden animate-in fade-in slide-in-from-right-4 duration-400">
                        <div className="w-60 border-r border-white/5 bg-black/30 p-4 space-y-1 overflow-y-auto">
                           <button 
                             onClick={downloadZip}
                             className="w-full flex items-center justify-center gap-2 mb-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                           >
                              <FileArchive className="w-4 h-4" /> Download ZIP
                           </button>
                           <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase mb-4 px-2 tracking-widest border-b border-white/5 pb-2">
                              <FolderOpen className="w-3 h-3" /> File Explorer
                           </div>
                           {Object.keys(projectFiles).map(fileName => (
                              <button key={fileName} onClick={() => setSelectedFile(fileName)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all ${selectedFile === fileName ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:bg-white/5'}`}>
                                 <FileCode className="w-3.5 h-3.5 opacity-50" /> {fileName}
                              </button>
                           ))}
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden">
                           <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-mono text-blue-400">{selectedFile}</span>
                              </div>
                              <button onClick={() => copyToClipboard(projectFiles[selectedFile])} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'COPIED' : 'COPY FILE'}
                              </button>
                           </div>
                           <div className="flex-1 overflow-auto p-6 font-mono text-[11px] leading-relaxed">
                              <pre className="text-gray-400 bg-black/50 p-8 rounded-3xl border border-white/5 min-h-full whitespace-pre-wrap">
                                {projectFiles[selectedFile]}
                              </pre>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'cloudflare' && (
                     <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-400 overflow-y-auto">
                        <div className="flex items-center gap-4">
                           <Globe className="w-10 h-10 text-orange-400" />
                           <h3 className="text-2xl font-black">Build Configuration</h3>
                        </div>
                        <div className="bg-[#1a1a1a] border border-[#262626] rounded-3xl p-8 space-y-6">
                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">Build Command</p>
                                 <div className="flex items-center justify-between bg-black p-5 rounded-xl border border-white/5 font-mono text-orange-400">npm run build</div>
                              </div>
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">Output Directory</p>
                                 <div className="flex items-center justify-between bg-black p-5 rounded-xl border border-white/5 font-mono text-orange-400">dist</div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'shopify' && (
                     <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-400 overflow-y-auto">
                        <div className="flex items-center gap-4">
                           <ShoppingBag className="w-10 h-10 text-green-400" />
                           <h3 className="text-2xl font-black">Shopify Section Code</h3>
                        </div>
                        <div className="relative group">
                           <pre className="bg-black border border-[#262626] rounded-3xl p-10 text-[11px] font-mono text-gray-400 overflow-x-auto max-h-[400px] leading-relaxed">
                              {shopifyFullToolCode}
                           </pre>
                           <button onClick={() => copyToClipboard(shopifyFullToolCode)} className="absolute top-6 right-6 flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black rounded-xl shadow-2xl transition-all">
                             {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} COPY CODE
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>

             <div className="px-10 py-5 bg-[#0d0d0d] border-t border-[#262626] flex items-center justify-between text-[9px] font-black text-gray-700 uppercase tracking-widest">
                <span>BUNDLE ENGINE v3.2.5</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;