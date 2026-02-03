
import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Database, 
  ChevronRight, 
  Briefcase, 
  Folder, 
  Cpu, 
  Save, 
  Trash2, 
  Layers, 
  Settings2,
  Box,
  Wrench,
  ShieldCheck,
  History,
  ClipboardCheck,
  Package,
  HardDrive,
  UploadCloud,
  FileText,
  FileCheck,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  X,
  FileSearch,
  Users,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { PlantNode, IndustrialAsset, DocumentType, EQPSUser } from '../types';

const BusinessManagement: React.FC<{ 
  onEvent: (type: 'SYNC', msg: string) => void;
  structure: PlantNode[];
  modelAssets: Record<string, IndustrialAsset[]>;
  onUpdateStructure: (newStructure: PlantNode[]) => void;
  onUpdateAssets: (newAssets: Record<string, IndustrialAsset[]>) => void;
}> = ({ onEvent, structure, modelAssets, onUpdateStructure, onUpdateAssets }) => {
  const [activeTab, setActiveTab] = useState<'architect' | 'data-hub' | 'users'>('architect');
  const [buName, setBuName] = useState('');
  const [selectedBu, setSelectedBu] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  
  const [targetModel, setTargetModel] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<DocumentType>('Desenhos');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usuários Mockados para Gestão Master (Fase 11)
  const [users, setUsers] = useState<EQPSUser[]>(() => {
    const saved = localStorage.getItem('eqps-master-users');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Marcos Garçon', email: 'm.garcon@panasonic.com', role: 'Admin' },
      { id: '2', name: 'Ana Silva', email: 'a.silva@panasonic.com', role: 'Master' },
      { id: '3', name: 'José Lima', email: 'j.lima@panasonic.com', role: 'Operator' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eqps-master-users', JSON.stringify(users));
  }, [users]);

  const iconMap: Record<string, any> = {
    'Manutenção': Wrench,
    'Qualidade': ShieldCheck,
    'Injetoras': Cpu,
    'Estamparia': Layers,
    'Lavadoras': Package,
    'Refrigeradores': Box
  };

  const handleAddBU = () => {
    if (!buName) return;
    const newNode: PlantNode = {
      id: 'bu-' + Math.random().toString(36).substr(2, 9),
      name: buName,
      type: 'BU',
      children: []
    };
    onUpdateStructure([...structure, newNode]);
    onEvent('SYNC', `Nova Unidade: ${buName}`);
    setBuName('');
  };

  const handleAddDept = (buId: string) => {
    if (!deptName) return;
    const newStructure = structure.map(bu => {
      if (bu.id === buId) {
        const deptId = 'dept-' + Math.random().toString(36).substr(2, 9);
        const newDept: PlantNode = {
          id: deptId,
          name: deptName,
          type: 'DEPT',
          children: [
            { id: deptId + '-stock', name: 'Estoque', type: 'DOC' },
            { id: deptId + '-machines', name: 'Máquinas', type: 'DOC' },
            { id: deptId + '-history', name: 'Histórico', type: 'DOC' },
            { id: deptId + '-checklist', name: 'Checklist', type: 'DOC' }
          ]
        };
        return { ...bu, children: [...(bu.children || []), newDept] };
      }
      return bu;
    });
    onUpdateStructure(newStructure);
    onEvent('SYNC', `Pasta industrial vinculada: ${deptName}`);
    setDeptName('');
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setStagedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const consolidateAssets = () => {
    if (!targetModel || stagedFiles.length === 0) return;
    
    const newAssets: IndustrialAsset[] = stagedFiles.map(f => ({
      id: 'asset-' + Math.random().toString(36).substr(2, 9),
      name: f.name.replace(/\.[^/.]+$/, ""),
      type: uploadCategory,
      fileName: f.name,
      fileSize: (f.size / 1024).toFixed(1) + ' KB',
      uploadDate: new Date().toLocaleDateString()
    }));

    const updatedModelAssets = { ...modelAssets };
    updatedModelAssets[targetModel] = [...(updatedModelAssets[targetModel] || []), ...newAssets];
    
    onUpdateAssets(updatedModelAssets);
    onEvent('SYNC', `${stagedFiles.length} arquivos salvos no repositório do modelo ${targetModel}.`);
    setStagedFiles([]);
    setTargetModel('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex justify-center">
        <div className="bg-[#0f172a] border border-slate-800 p-2 rounded-[2.5rem] flex gap-2 shadow-2xl">
          <button onClick={() => setActiveTab('architect')} className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'architect' ? 'bg-sky-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>
            <Settings2 size={18} /> Arquiteto
          </button>
          <button onClick={() => setActiveTab('data-hub')} className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'data-hub' ? 'bg-indigo-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>
            <HardDrive size={18} /> Data Hub
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>
            <Users size={18} /> Gestão Master
          </button>
        </div>
      </div>

      {activeTab === 'architect' && (
        <div className="bg-[#0f172a] border border-slate-800 p-12 rounded-[4rem] shadow-2xl space-y-12">
           <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-sky-500 rounded-[1.5rem] flex items-center justify-center text-slate-900 shadow-xl">
                <Settings2 size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Arquitetura de Planta</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Hierarquia Enterprise v5.0</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div className="p-8 bg-[#020617] border border-slate-800 rounded-[2.5rem] space-y-6">
                   <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest">Criar Unidade L1</h3>
                   <div className="flex gap-3">
                      <input value={buName} onChange={e => setBuName(e.target.value)} type="text" placeholder="Ex: Lavadoras..." className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500 outline-none" />
                      <button onClick={handleAddBU} className="px-6 bg-sky-500 text-slate-900 rounded-2xl font-black text-xs uppercase">Salvar</button>
                   </div>
                </div>

                {selectedBu && (
                  <div className="p-8 bg-[#020617] border border-emerald-500/20 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top-4">
                     <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Vincular Área L2</h3>
                     <div className="flex gap-3">
                        <input value={deptName} onChange={e => setDeptName(e.target.value)} type="text" placeholder="Ex: Engenharia..." className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none" />
                        <button onClick={() => handleAddDept(selectedBu)} className="px-6 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase">Vincular</button>
                     </div>
                  </div>
                )}
             </div>

             <div className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10 min-h-[400px]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Navegador Hierárquico</h3>
                <div className="space-y-3">
                   {structure.map(bu => {
                     const Icon = iconMap[bu.name] || Briefcase;
                     return (
                       <div key={bu.id}>
                          <div onClick={() => setSelectedBu(bu.id === selectedBu ? null : bu.id)} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${selectedBu === bu.id ? 'bg-sky-500 border-sky-400 text-slate-900 shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
                             <div className="flex items-center gap-3"><Icon size={18} /><span className="text-xs font-black uppercase tracking-tight">{bu.name}</span></div>
                          </div>
                          {selectedBu === bu.id && bu.children && (
                            <div className="ml-8 space-y-1 py-1 border-l-2 border-sky-500/20 pl-4">
                               {bu.children.map(dept => (
                                 <div key={dept.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                                    <Folder size={14} className="text-slate-600" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase">{dept.name}</span>
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#0f172a] border border-slate-800 p-12 rounded-[4rem] shadow-2xl space-y-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-slate-900 shadow-xl">
                    <Users size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Gestão Master</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Controle de Acessos Intranet</p>
                </div>
              </div>
              <button className="px-8 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800">Novo Usuário</button>
           </div>

           <div className="overflow-hidden border border-slate-800 rounded-[2.5rem]">
              <table className="w-full text-left">
                 <thead className="bg-[#020617] text-slate-500 font-black text-[10px] uppercase tracking-widest">
                    <tr>
                       <th className="px-8 py-5">Usuário</th>
                       <th className="px-8 py-5">Role</th>
                       <th className="px-8 py-5">Email</th>
                       <th className="px-8 py-5 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                       <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="px-8 py-6 flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-white">{u.name.charAt(0)}</div>
                             <span className="text-xs font-black text-white uppercase tracking-tight">{u.name}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'Admin' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>{u.role}</span>
                          </td>
                          <td className="px-8 py-6 text-xs text-slate-500 font-medium">{u.email}</td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 text-slate-600 hover:text-white transition-colors"><Settings2 size={16} /></button>
                             <button className="p-2 text-slate-600 hover:text-rose-500 transition-colors ml-2"><Trash2 size={16} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'data-hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-8">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3"><UploadCloud size={24} className="text-indigo-500" /> Upload Engenharia</h3>
                 <div className="space-y-6">
                    <input value={targetModel} onChange={e => setTargetModel(e.target.value)} placeholder="Modelo (Ex: W640)..." className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none" />
                    <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value as DocumentType)} className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none">
                       <option value="Desenhos">Desenhos CAD</option>
                       <option value="FITP">FITP</option>
                       <option value="Cartas de Controle">Cartas de Controle</option>
                       <option value="Checklist">Checklists</option>
                    </select>
                    <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500">
                       <Folder size={32} className="text-slate-700" />
                       <span className="text-[10px] text-slate-500 font-black uppercase">{stagedFiles.length > 0 ? `${stagedFiles.length} arquivos` : 'Selecionar Arquivos'}</span>
                       <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                    </div>
                    <button onClick={consolidateAssets} className="w-full py-5 bg-indigo-500 text-slate-950 rounded-[2rem] font-black text-xs uppercase shadow-2xl">Salvar no Hub</button>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-[4rem] p-12 shadow-2xl flex flex-col min-h-[500px]">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 border-b border-slate-800 pb-6 flex items-center gap-3">
                 <HardDrive size={24} className="text-indigo-400" /> Repositório Central
              </h3>
              <div className="space-y-6 overflow-y-auto custom-scrollbar">
                 {Object.entries(modelAssets).map(([model, assets]) => (
                    <div key={model} className="space-y-3">
                       <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{model}</span>
                       {assets.map(asset => (
                          <div key={asset.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><FileText size={16} /></div>
                                <div><p className="text-xs font-black text-white uppercase">{asset.name}</p><p className="text-[9px] text-slate-600 font-bold uppercase">{asset.type}</p></div>
                             </div>
                             <button className="text-slate-700 hover:text-rose-500"><Trash2 size={16} /></button>
                          </div>
                       ))}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BusinessManagement;
