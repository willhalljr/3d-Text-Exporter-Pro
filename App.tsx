import React, { useState, useRef, useEffect, useMemo } from 'react';
import Viewer, { ViewerRef } from './components/Viewer';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import FontDrawer from './components/FontDrawer';
import { INITIAL_TEXT_SETTINGS, INITIAL_MATERIAL_SETTINGS, GOOGLE_FONTS, PUBLIC_EMBED_URL } from './constants';
import { TextSettings, MaterialSettings, FontData, MaterialPreset } from './types';
import { 
  Type as FontIcon, 
  Code, 
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
  ArrowRight, 
  Layers, 
  HelpCircle,
  FileCode,
  FolderOpen,
  Monitor
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

  const viewerRef = useRef<ViewerRef>(null);

  const urlValidation = useMemo(() => {
    const rawValue = PUBLIC_EMBED_URL;
    const url = rawValue.trim();
    const regexMatch = /^https:\/\/[^\s]+$/i.test(url);
    const isProduction = !url.includes('localhost') && !url.includes('127.0.0.1');
    const isValid = regexMatch && isProduction;

    return { isValid, url, rawValue, isProduction };
  }, []);

  // Full source code for the drawer
  const projectFiles: Record<string, string> = {
    'package.json': `{
  "name": "3d-text-exporter-pro",
  "private": true,
  "version": "1.1.0",
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
    "three": "^0.182.0"
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
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Text Exporter Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; overflow: hidden; background: #0a0a0a; color: #fff; font-family: sans-serif; }
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
    'constants.tsx': `export const PUBLIC_EMBED_URL = "${PUBLIC_EMBED_URL}";
// ... other initial settings constants`,
    'types.ts': `export interface TextSettings { ... }
export interface MaterialSettings { ... }`,
    '_headers': `/*
  X-Frame-Options: ALLOWALL
  Access-Control-Allow-Origin: *
  Content-Security-Policy: frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com;`
  };

  useEffect(() => {
    const saved = localStorage.getItem('custom_presets_v2');
    if (saved) setCustomPresets(JSON.parse(saved));
  }, []);

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
  <iframe 
    src="${urlValidation.url}" 
    style="width: 100%; height: 100%; border: none; display: block;" 
    allow="clipboard-read; clipboard-write; fullscreen"
  ></iframe>
</div>

{% schema %}
{
  "name": "3D Text Editor Pro",
  "settings": [
    {
      "type": "range",
      "id": "editor_height",
      "min": 50,
      "max": 100,
      "step": 5,
      "unit": "vh",
      "label": "Height",
      "default": 90
    }
  ],
  "presets": [
    {
      "name": "3D Text Editor Pro"
    }
  ]
}
{% endschema %}
  `.trim();

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
      />

      <div className="flex-1 relative bg-gradient-to-b from-[#111] to-black">
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
             PBR Text Engine v3.1
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
          <div className="bg-[#121212] border border-[#262626] rounded-[2.5rem] w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
             {/* Header */}
             <div className="p-8 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]/50">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase tracking-wider">Deployment Dashboard</h2>
                      <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold">Overwrite Boilerplate → Fix "Vite is Working" Message</p>
                   </div>
                </div>
                <button onClick={() => setIsShopifyModalOpen(false)} className="p-4 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Steps Sidebar */}
                <div className="w-64 border-r border-[#262626] bg-[#0d0d0d] p-6 space-y-2">
                   <button 
                     onClick={() => setActiveTab('github')}
                     className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'github' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <div className="flex items-center gap-3"><Github className="w-4 h-4" /> 1. Repository Code</div>
                   </button>
                   <button 
                     onClick={() => setActiveTab('cloudflare')}
                     className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'cloudflare' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <Globe className="w-4 h-4" /> 2. Pages Setup
                   </button>
                   <button 
                     onClick={() => setActiveTab('shopify')}
                     className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'shopify' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <ShoppingBag className="w-4 h-4" /> 3. Shopify Liquid
                   </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0a]">
                   {activeTab === 'github' && (
                     <div className="flex-1 flex overflow-hidden animate-in fade-in slide-in-from-right-4 duration-400">
                        {/* File Explorer Sidebar */}
                        <div className="w-60 border-r border-white/5 bg-black/30 p-4 space-y-1 overflow-y-auto">
                           <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase mb-4 px-2 tracking-widest">
                              <FolderOpen className="w-3 h-3" /> Project Files
                           </div>
                           {Object.keys(projectFiles).map(fileName => (
                              <button 
                                key={fileName}
                                onClick={() => setSelectedFile(fileName)}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all ${selectedFile === fileName ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                              >
                                 <FileCode className="w-3.5 h-3.5 opacity-50" />
                                 {fileName}
                              </button>
                           ))}
                           
                           <div className="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                              <p className="text-[9px] text-red-400 font-black uppercase mb-2 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Overwrite Rule</p>
                              <p className="text-[9px] text-gray-400 leading-relaxed mb-2">
                                If you see <strong>"Vite is working"</strong>, you must delete the <code>src/</code> folder in your repo.
                              </p>
                              <p className="text-[9px] text-gray-500">
                                Place all code files at the <strong>ROOT</strong> of your repository.
                              </p>
                           </div>
                        </div>

                        {/* File Content Preview */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                           <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-mono text-blue-400">{selectedFile}</span>
                                 <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold px-2 py-0.5 border border-white/5 rounded">Full Source</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(projectFiles[selectedFile])}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                              >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied to Clipboard' : 'Copy File Content'}
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
                           <h3 className="text-2xl font-black">Final Cloudflare Steps</h3>
                        </div>
                        
                        <div className="bg-[#1a1a1a] border border-[#262626] rounded-3xl p-8 space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                 <Monitor className="w-5 h-5 text-orange-400" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold uppercase tracking-wider">Root Build Config</h4>
                                 <p className="text-xs text-gray-500">Ensure Cloudflare looks for files in the root, not <code>/src</code></p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-2 tracking-widest">Build Command</p>
                                 <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-white/5">
                                    <code className="text-orange-400 font-mono">npm run build</code>
                                    <button onClick={() => copyToClipboard('npm run build')} className="hover:text-white text-gray-600"><Copy className="w-4 h-4" /></button>
                                 </div>
                              </div>
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-2 tracking-widest">Output Directory</p>
                                 <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-white/5">
                                    <code className="text-orange-400 font-mono">dist</code>
                                    <button onClick={() => copyToClipboard('dist')} className="hover:text-white text-gray-600"><Copy className="w-4 h-4" /></button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                           <Info className="w-6 h-6 text-blue-400" />
                           <p className="text-xs text-blue-200">
                             <strong>Tip:</strong> After pushing the "Root Code" files, trigger a "Clear Cache and Redeploy" in Cloudflare to see the tool.
                           </p>
                        </div>
                     </div>
                   )}

                   {activeTab === 'shopify' && (
                     <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-400 overflow-y-auto">
                        <div className="flex items-center gap-4">
                           <ShoppingBag className="w-10 h-10 text-green-400" />
                           <h3 className="text-2xl font-black">Shopify Liquid Section</h3>
                        </div>
                        
                        <div className="space-y-6">
                           <div className="relative group">
                              <pre className="bg-black border border-[#262626] rounded-3xl p-10 text-[11px] font-mono text-gray-400 overflow-x-auto max-h-[400px] leading-relaxed">
                                 {shopifyFullToolCode}
                              </pre>
                              <button 
                                onClick={() => copyToClipboard(shopifyFullToolCode)}
                                className="absolute top-6 right-6 flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black rounded-xl shadow-2xl transition-all active:scale-95"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                COPY LIQUID CODE
                              </button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>

             {/* Footer Info */}
             <div className="px-10 py-5 bg-[#0d0d0d] border-t border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${urlValidation.isValid ? 'bg-green-500' : 'bg-orange-500'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                   <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                      {urlValidation.isValid ? `CONNECTED: ${urlValidation.url}` : 'INVALID PRODUCTION URL'}
                   </span>
                </div>
                <div className="text-[9px] text-gray-700 font-mono font-bold uppercase tracking-widest">
                   CORE ENGINE: V3.2.0-STABLE
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;