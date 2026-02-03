
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  CheckCircle2, 
  FileCode,
  Loader2,
  X,
  FileText,
  Layers,
  UploadCloud,
  Settings,
  ShieldCheck,
  Briefcase,
  Cpu,
  Box,
  Wand2,
  Dna,
  Folder,
  Image as ImageIcon,
  FileJson,
  FileDown
} from 'lucide-react';
import { NavigationState, CustomModule, CustomTool, TelemetryEvent, DocumentType, PlantNode } from '../types';

interface StagedFile {
  name: string;
  originalContent: string;
  refactoredContent: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  path: string;
  mimeType: string;
}

const CONVERSION_MODES = [
  { id: 'standard', label: 'Refatoração Simples', icon: FileCode },
  { id: 'fit', label: 'Conversão para FIT (Visual)', icon: Box },
  { id: 'control', label: 'Carta de Controle (Dimensional)', icon: Dna },
  { id: 'fitp', label: 'FITP (Instrução de Trabalho)', icon: Layers }
];

interface AssetAdjusterProps {
  onEvent: (t: TelemetryEvent['type'], m: string) => void;
  nav: NavigationState;
  onRefreshModules?: () => void;
  structure: PlantNode[];
}

const AssetAdjuster: React.FC<AssetAdjusterProps> = ({ onEvent, nav, onRefreshModules, structure }) => {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [moduleName, setModuleName] = useState('');
  const [conversionMode, setConversionMode] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isIntegrated, setIsIntegrated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [targetBU, setTargetBU] = useState<string>(structure[0]?.name || '');
  const [targetDept, setTargetDept] = useState<string>('');
  const [targetModel, setTargetModel] = useState<string>('GERAL');
  const [targetDocType, setTargetDocType] = useState<string>('Estoque');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File, path: string): Promise<StagedFile> => {
    return new Promise((resolve) => {
      const isBinary = file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.match(/\.(doc|docx|com|bin|exe)$/i);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve({
          name: file.name,
          originalContent: e.target?.result as string,
          refactoredContent: null,
          status: 'pending',
          path,
          mimeType: file.type || 'application/octet-stream'
        });
      };
      
      if (isBinary) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    const newStaged: StagedFile[] = [];
    for (const file of fileList) {
      // Aceita uma gama maior de extensões agora
      const staged = await readFile(file, file.webkitRelativePath || file.name);
      newStaged.push(staged);
    }
    setStagedFiles(prev => [...prev, ...newStaged]);
    onEvent('NAV', `${newStaged.length} arquivos carregados no Laboratório IA.`);
  };

  const processBatch = async () => {
    if (stagedFiles.length === 0) return;
    setIsProcessing(true);
    setIsIntegrated(false);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const updatedFiles = [...stagedFiles];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'done') continue;
      updatedFiles[i].status = 'processing';
      setStagedFiles([...updatedFiles]);

      const currentFile = updatedFiles[i];
      const isImage = currentFile.mimeType.startsWith('image/');
      const isDataURL = currentFile.originalContent.startsWith('data:');

      let specializedPrompt = "";
      if (conversionMode === 'fit') specializedPrompt = "Crie uma interface visual de FIT (Ficha de Inspeção Técnica).";
      if (conversionMode === 'control') specializedPrompt = "Crie uma Carta de Controle Dimensional Interativa.";
      if (conversionMode === 'fitp') specializedPrompt = "Crie uma FITP (Instrução de Processo) profissional.";
      if (currentFile.name.endsWith('.py')) specializedPrompt += " O arquivo original é Python, converta a lógica para uma interface web interativa.";

      try {
        let contents: any;

        if (isImage && isDataURL) {
          const base64Data = currentFile.originalContent.split(',')[1];
          contents = {
            parts: [
              { text: `Atue como Engenheiro de Qualidade Industrial da Panasonic. 
                Analise esta imagem industrial (${currentFile.name}) e crie um componente interativo em HTML/Tailwind que exiba os principais insights, desvios detectados e um dashboard visual. 
                Use Tailwind CSS Dark Mode (#020617). 
                ${specializedPrompt}` },
              { inlineData: { data: base64Data, mimeType: currentFile.mimeType } }
            ]
          };
        } else {
          contents = `Atue como Engenheiro de Software Industrial Sênior.
          Refatore o conteúdo do arquivo "${currentFile.name}" (Mime: ${currentFile.mimeType}) para o padrão EQPS NATIVO (Componente HTML/Tailwind Interativo).
          MAPEAMENTO: ${targetBU} > ${targetDocType}.
          Use Tailwind CSS Dark Mode (#020617).
          ${specializedPrompt}
          
          CONTEÚDO ORIGINAL:
          ${currentFile.originalContent}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents
        });

        updatedFiles[i].refactoredContent = response.text || '';
        updatedFiles[i].status = 'done';
      } catch (error) {
        console.error("AI processing error:", error);
        updatedFiles[i].status = 'error';
      }
      setStagedFiles([...updatedFiles]);
    }
    setIsProcessing(false);
  };

  const integrateModule = () => {
    if (stagedFiles.some(f => f.status !== 'done')) return;

    const newTools: CustomTool[] = stagedFiles.map(f => ({
      id: 'tool-' + Math.random().toString(36).substr(2, 9),
      name: f.name.replace(/\.[^/.]+$/, ""),
      code: f.refactoredContent || '',
      category: targetDocType,
      description: `Mapeado de ${f.name} para ${targetBU} > ${targetDocType}`,
      createdAt: new Date().toISOString(),
      mapping: {
        business: targetBU,
        department: targetDept,
        model: targetModel,
        docType: targetDocType as DocumentType
      }
    }));

    const existingModules: CustomModule[] = JSON.parse(localStorage.getItem('eqps-native-modules') || '[]');
    existingModules.push({ id: 'mod-' + Date.now(), name: moduleName || 'Ativo Industrial Refatorado', tools: newTools });

    localStorage.setItem('eqps-native-modules', JSON.stringify(existingModules));
    window.dispatchEvent(new Event('storage'));
    setIsIntegrated(true);
    if (onRefreshModules) onRefreshModules();
    onEvent('SYNC', `Ativos refatorados e integrados à planta.`);
  };

  const getFileIcon = (mimeType: string, fileName: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon size={18} />;
    if (fileName.endsWith('.py')) return <FileJson size={18} className="text-amber-500" />;
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileText size={18} className="text-blue-500" />;
    if (fileName.endsWith('.html')) return <FileCode size={18} className="text-orange-500" />;
    if (fileName.endsWith('.com') || fileName.endsWith('.bin')) return <Settings size={18} className="text-rose-500" />;
    return <FileText size={18} />;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-sky-500 rounded-[2rem] flex items-center justify-center text-slate-900 shadow-xl shadow-sky-500/20">
           <Wand2 size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Laboratório Multimodal</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic flex items-center gap-2">
             <ShieldCheck size={14} className="text-sky-500" /> SUPORTE A HTML, PYTHON, JPG, DOC, COM...
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-8 space-y-4 shadow-2xl">
              <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                 <Settings size={16} /> Configuração de Destino
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-2">Unidade de Negócio</label>
                    <select value={targetBU} onChange={e => setTargetBU(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none">
                       {structure.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-2">Pasta da Planta</label>
                    <select value={targetDocType} onChange={e => setTargetDocType(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none">
                       <option value="Estoque">Estoque</option>
                       <option value="Máquinas">Máquinas</option>
                       <option value="Histórico">Histórico de Ocorrências</option>
                       <option value="Checklist">Checklist / Forms</option>
                       <option value="FITP">FITP</option>
                       <option value="Cartas de Controle">Cartas de Controle</option>
                    </select>
                 </div>
              </div>
           </div>

           <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }} className={`bg-[#0f172a] border-4 border-dashed rounded-[3.5rem] p-10 transition-all flex flex-col items-center justify-center text-center gap-6 min-h-[200px] ${isDragging ? 'border-sky-500 bg-sky-500/5' : 'border-slate-800'}`}>
              <UploadCloud size={32} className="text-slate-700" />
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Arraste Código, Imagens ou Documentos Técnicos</div>
              <button onClick={() => folderInputRef.current?.click()} className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[9px] font-black text-slate-400 uppercase">Selecionar Localmente</button>
              <input ref={folderInputRef} type="file" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
           </div>

           <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-6 space-y-4">
              <label className="text-[9px] font-black text-slate-600 uppercase ml-2">Modo de Conversão IA</label>
              <div className="grid grid-cols-2 gap-2">
                 {CONVERSION_MODES.map(mode => (
                   <button 
                    key={mode.id} 
                    onClick={() => setConversionMode(mode.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border ${conversionMode === mode.id ? 'bg-sky-500 border-sky-400 text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                   >
                     <mode.icon size={14} /> {mode.label}
                   </button>
                 ))}
              </div>
           </div>

           <button onClick={processBatch} disabled={stagedFiles.length === 0 || isProcessing} className="w-full py-6 bg-sky-500 text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-105 disabled:opacity-20 transition-all shadow-2xl flex items-center justify-center gap-3">
              {isProcessing ? <><Loader2 className="animate-spin" /> Processando Arquivos...</> : <><Sparkles /> Iniciar Refatoração IA</>}
           </button>
        </div>

        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-[4rem] p-12 shadow-2xl flex flex-col min-h-[600px]">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 border-b border-slate-800 pb-6 flex items-center justify-between">
              Fila de Ativos Multimodais
              <span className="text-[10px] text-sky-500 uppercase">{stagedFiles.filter(f => f.status === 'done').length} Prontos</span>
           </h3>
           <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4">
              {stagedFiles.map((file, idx) => (
                <div key={idx} className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all ${file.status === 'done' ? 'bg-emerald-500/5 border-emerald-500/20' : file.status === 'error' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 ${file.status === 'done' ? 'text-emerald-500' : ''}`}>
                         {file.status === 'done' ? <CheckCircle2 size={20} /> : getFileIcon(file.mimeType, file.name)}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-300 uppercase block truncate max-w-[200px]">{file.name}</span>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{file.status} • {file.mimeType}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                     {file.status === 'processing' && <Loader2 size={16} className="text-sky-500 animate-spin" />}
                     <button onClick={() => setStagedFiles(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-slate-600 hover:text-rose-500"><X size={16} /></button>
                   </div>
                </div>
              ))}
              {stagedFiles.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
                  <Folder size={64} />
                  <p className="text-xs font-black mt-4 uppercase tracking-[0.3em]">Nenhum arquivo na fila</p>
                </div>
              )}
           </div>
           {stagedFiles.length > 0 && stagedFiles.every(f => f.status === 'done') && (
             <button onClick={integrateModule} disabled={isIntegrated} className={`mt-8 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all ${isIntegrated ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500 text-slate-950 hover:scale-105 shadow-2xl shadow-emerald-500/20'}`}>
               {isIntegrated ? 'Ativos Integrados com Sucesso' : 'Consolidar no Sistema EQPS'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AssetAdjuster;
