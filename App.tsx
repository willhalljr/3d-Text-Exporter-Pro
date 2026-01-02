import React, { useState, useRef, useEffect, useMemo } from 'react';
import Viewer, { ViewerRef } from './components/Viewer';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import FontDrawer from './components/FontDrawer';
import { INITIAL_TEXT_SETTINGS, INITIAL_MATERIAL_SETTINGS, GOOGLE_FONTS, PUBLIC_EMBED_URL } from './constants';
import { TextSettings, MaterialSettings, FontData, MaterialPreset } from './types';
import { Type as FontIcon, Code, X, Copy, CheckCircle2, AlertTriangle, Github, Globe, ShoppingBag, Terminal, Check, Info } from 'lucide-react';

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
  const [autoRotate, setAutoRotate] = useState(false);
  const [copied, setCopied] = useState(false);

  const viewerRef = useRef<ViewerRef>(null);

  const urlValidation = useMemo(() => {
    const rawValue = PUBLIC_EMBED_URL;
    const url = rawValue.trim();
    const regexMatch = /^https:\/\/[^\s]+$/i.test(url);
    const lowerUrl = url.toLowerCase();
    const restOfUrl = lowerUrl.slice(8);
    const hasDuplicateProtocol = restOfUrl.includes('http://') || restOfUrl.includes('https://');
    const hasWhitespace = /\s/.test(rawValue);
    const isProduction = !url.includes('localhost') && !url.includes('127.0.0.1');
    const isValid = regexMatch && !hasDuplicateProtocol && !hasWhitespace && isProduction;

    return { isValid, url, rawValue, isProduction, hasWhitespace, hasDuplicateProtocol, regexMatch };
  }, []);

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
  3D Text Exporter - PRO SECTION
  URL: ${urlValidation.url}
{% endcomment %}

<div id="three-d-text-editor-{{ section.id }}" class="three-d-editor-wrapper" style="height: {{ section.settings.editor_height }}vh; position: relative; background: #000; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
  <iframe 
    id="editor-frame-{{ section.id }}"
    src="${urlValidation.url}" 
    style="width: 100%; height: 100%; border: none; display: block;" 
    allow="clipboard-read; clipboard-write; fullscreen"
  ></iframe>
</div>

{% schema %}
{
  "name": "3D Text Editor",
  "settings": [
    {
      "type": "range",
      "id": "editor_height",
      "min": 40,
      "max": 100,
      "step": 5,
      "unit": "vh",
      "label": "Editor Height (VH)",
      "default": 90
    }
  ],
  "presets": [
    {
      "name": "3D Text Editor"
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
            className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl shadow-2xl transition-all ${urlValidation.isValid ? 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-400' : 'bg-orange-600/20 border-orange-500/30 text-orange-400'}`}
          >
            {urlValidation.isValid ? <Code className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
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
             PBR Text Engine v3.0
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#121212] border border-[#262626] rounded-[2rem] w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             {/* Header */}
             <div className="p-8 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase tracking-wider">Deployment Hub</h2>
                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">End-to-End Connection Guide</p>
                   </div>
                </div>
                <button onClick={() => setIsShopifyModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Tabs Sidebar */}
                <div className="w-64 border-r border-[#262626] bg-[#0d0d0d] p-4 space-y-2">
                   <button 
                     onClick={() => setActiveTab('github')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'github' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <Github className="w-4 h-4" /> 1. GitHub
                   </button>
                   <button 
                     onClick={() => setActiveTab('cloudflare')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'cloudflare' ? 'bg-orange-500/10 text-orange-400 shadow-lg border border-orange-500/20' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <Globe className="w-4 h-4" /> 2. Cloudflare
                   </button>
                   <button 
                     onClick={() => setActiveTab('shopify')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'shopify' ? 'bg-green-500/10 text-green-400 shadow-lg border border-green-500/20' : 'text-gray-500 hover:bg-white/5'}`}
                   >
                     <ShoppingBag className="w-4 h-4" /> 3. Shopify
                   </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 bg-[#0a0a0a]">
                   {activeTab === 'github' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                           <Github className="w-8 h-8 text-gray-400" />
                           <h3 className="text-2xl font-black">Push to Repository</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                           Ensure your GitHub repository has all files at the <strong>project root</strong>. This flat structure is required for Cloudflare to build the app correctly.
                        </p>
                        
                        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 font-mono text-[11px]">
                           <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-white/5 pb-2">
                              <Info className="w-3 h-3" />
                              <span>Required Files (at root)</span>
                           </div>
                           <div className="space-y-1.5 text-gray-300">
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> package.json</div>
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> vite.config.ts</div>
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> index.html</div>
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> index.tsx</div>
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> App.tsx</div>
                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> _headers <span className="text-[9px] text-gray-600">(crucial for security)</span></div>
                           </div>
                        </div>

                        <div className="bg-[#0d0d0d] border border-white/5 p-4 rounded-xl">
                          <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Terminal Commands</p>
                          <code className="text-blue-400 block text-xs">git add .<br/>git commit -m "initial deploy"<br/>git push origin main</code>
                        </div>
                     </div>
                   )}

                   {activeTab === 'cloudflare' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                           <Globe className="w-8 h-8 text-orange-400" />
                           <h3 className="text-2xl font-black">Configure Cloudflare</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                           When setting up your <strong>Cloudflare Pages</strong> project, use these exact values in the "Build Settings" section:
                        </p>

                        <div className="space-y-4">
                           <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 flex justify-between items-center group">
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Framework Preset</p>
                                 <code className="text-white font-mono">None</code>
                              </div>
                           </div>
                           <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 flex justify-between items-center group">
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Build Command</p>
                                 <code className="text-orange-400 font-mono text-lg">npm run build</code>
                              </div>
                              <button onClick={() => copyToClipboard('npm run build')} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-90">
                                 <Copy className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 flex justify-between items-center group">
                              <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Build Output Directory</p>
                                 <code className="text-orange-400 font-mono text-lg">dist</code>
                              </div>
                              <button onClick={() => copyToClipboard('dist')} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-90">
                                 <Copy className="w-4 h-4" />
                              </button>
                           </div>
                        </div>

                        <div className={`p-5 rounded-2xl border flex items-center gap-4 ${urlValidation.isValid ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${urlValidation.isValid ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {urlValidation.isValid ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                           </div>
                           <div className="flex-1">
                              <p className="text-xs font-bold uppercase tracking-wider">Status: {urlValidation.isValid ? 'Valid Production URL' : 'Development Mode'}</p>
                              <p className="text-[11px] text-gray-400 font-mono truncate">{urlValidation.url}</p>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'shopify' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                           <ShoppingBag className="w-8 h-8 text-green-400" />
                           <h3 className="text-2xl font-black">Shopify Integration</h3>
                        </div>
                        
                        {!urlValidation.isValid ? (
                           <div className="p-10 bg-orange-950/20 border border-orange-500/30 rounded-3xl text-center">
                              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                              <h3 className="text-lg font-bold text-orange-400 uppercase tracking-widest mb-2">Production URL Missing</h3>
                              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
                                 Your <code>PUBLIC_EMBED_URL</code> in <code>constants.tsx</code> is currently localhost or invalid. Update it with your Cloudflare URL to get the production Liquid code.
                              </p>
                           </div>
                        ) : (
                           <div className="space-y-6">
                              <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2">Section Code</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                  Go to <strong>Online Store > Themes > Edit Code</strong>. Create a new section named <code>3d-text-editor.liquid</code> and paste the following:
                                </p>
                              </div>
                              
                              <div className="relative group">
                                 <pre className="bg-black border border-[#262626] rounded-2xl p-6 text-[11px] font-mono text-gray-400 overflow-x-auto max-h-[300px] leading-relaxed">
                                    {shopifyFullToolCode}
                                 </pre>
                                 <button 
                                   onClick={() => copyToClipboard(shopifyFullToolCode)}
                                   className="absolute top-4 right-4 flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black rounded-xl shadow-xl transition-all active:scale-95"
                                 >
                                   {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                   {copied ? 'COPY LIQUID' : 'COPY LIQUID'}
                                 </button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Step 1</p>
                                  <p className="text-[10px] text-gray-400 italic">"I've added the code, what's next?"</p>
                                  <p className="text-[10px] text-white mt-1">Open the Shopify Customizer.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Step 2</p>
                                  <p className="text-[10px] text-gray-400 italic">"How do I see it live?"</p>
                                  <p className="text-[10px] text-white mt-1">Click "Add Section" and select "3D Text Editor".</p>
                                </div>
                              </div>
                           </div>
                        )}
                     </div>
                   )}
                </div>
             </div>

             {/* Footer Status */}
             <div className="px-8 py-4 bg-[#0d0d0d] border-t border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${urlValidation.isValid ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {urlValidation.isValid ? 'Ready for Production' : 'Local Development Mode'}
                   </span>
                </div>
                <div className="text-[10px] text-gray-700 font-mono flex gap-4">
                   <span>Output Folder: <strong>dist/</strong></span>
                   <span>Build: v3.1-PRO</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;