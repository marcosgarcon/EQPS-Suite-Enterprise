
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Database,
  Briefcase,
  Cpu,
  FileSearch,
  Box,
  Binary,
  Settings,
  Rocket,
  Code2,
  GraduationCap,
  Activity,
  FileCheck,
  Wrench,
  ShieldCheck,
  History,
  ClipboardCheck,
  Package,
  Layers,
  FileText,
  Users
} from 'lucide-react';
import { NavigationState, ViewState, PlantNode, CustomModule } from '../types';

interface SidebarProps {
  onNavigate: (state: NavigationState | ViewState | string) => void;
  currentState: NavigationState;
  currentView: ViewState | string;
  customModules?: CustomModule[];
  structure: PlantNode[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentState, currentView, customModules = [], structure }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const getIcon = (name: string, type: string) => {
    if (type === 'BU') {
      if (name.includes('Manutenção')) return Wrench;
      if (name.includes('Qualidade')) return ShieldCheck;
      if (name.includes('Injetoras')) return Cpu;
      if (name.includes('Estamparia')) return Layers;
      return Briefcase;
    }
    if (type === 'DEPT') return Folder;
    if (type === 'MODEL') return Package;
    
    switch (name) {
      case 'Estoque': return Box;
      case 'Máquinas': return Cpu;
      case 'Histórico': return History;
      case 'Checklist': return ClipboardCheck;
      case 'FITP': return FileCheck;
      case 'Cartas de Controle': return FileSearch;
      default: return FileText;
    }
  };

  const renderNode = (node: PlantNode, level: number = 0, path: any = {}) => {
    const Icon = getIcon(node.name, node.type);
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    const currentPath = { ...path };
    if (node.type === 'BU') currentPath.business = node.name;
    if (node.type === 'DEPT') currentPath.department = node.name;
    if (node.type === 'MODEL') currentPath.model = node.name;
    if (node.type === 'DOC') currentPath.docType = node.name;

    const isActive = node.type === 'DOC' && 
                     currentState.business === currentPath.business && 
                     currentState.docType === currentPath.docType;

    return (
      <div key={node.id} className="w-full">
        <button 
          onClick={() => {
            if (hasChildren) {
              toggle(node.id);
            } else if (node.type === 'DOC') {
              onNavigate({
                business: currentPath.business,
                department: currentPath.department,
                model: currentPath.model || 'GERAL',
                docType: currentPath.docType
              });
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
            isActive ? 'bg-sky-500/10 text-sky-400 font-black' : 'hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
          }`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Icon size={14} className={isActive ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-400'} />
            <span className={`text-[11px] uppercase tracking-wider truncate ${isActive ? 'font-black' : 'font-bold'}`}>
              {node.name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasChildren && (
              <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                <ChevronRight size={12} />
              </div>
            )}
          </div>
        </button>
        
        {isExpanded && hasChildren && (
          <div className="mt-0.5 border-l border-slate-800/40 ml-4">
            {node.children!.map(child => renderNode(child, level + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 h-screen bg-[#020617] text-slate-400 flex flex-col border-r border-slate-800/60 z-[60] shadow-2xl no-print">
      <div className="p-8 border-b border-slate-800/40 flex items-center gap-4 bg-slate-900/20">
        <div className="bg-sky-500 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] border border-sky-400/30">
          <Database className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-white font-black text-lg tracking-tighter uppercase leading-none">EQPS Suite</h1>
          <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] mt-1">Enterprise 5.0</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <nav className="space-y-1">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'dashboard' && !currentState.business ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <LayoutGrid size={18} />
            <span className="text-xs uppercase tracking-widest font-black">Dashboard Central</span>
          </button>

          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Operação & Hub</div>
          
          <button onClick={() => onNavigate('training-academy')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'training-academy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'hover:bg-slate-900/50'}`}>
            <GraduationCap size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Academia</span>
          </button>

          <button onClick={() => onNavigate('asset-adjuster')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'asset-adjuster' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-slate-900/50'}`}>
            <Code2 size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Laboratório IA</span>
          </button>

          <button onClick={() => onNavigate('projects-mgmt')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'projects-mgmt' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-slate-900/50'}`}>
            <Rocket size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Projetos & Ativos</span>
          </button>

          <div className="pt-8 pb-3 px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Planta de Extrema</div>
          <div className="space-y-1">
            {structure.map(node => renderNode(node))}
          </div>
        </nav>
      </div>

      <div className="p-6 border-t border-slate-800/40 bg-slate-900/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div onClick={() => onNavigate('user-mgmt')} className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-xs font-black text-white shadow-xl cursor-pointer hover:scale-110 transition-all border border-white/10">AD</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">Administrador</p>
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest leading-none">Acesso Master</p>
          </div>
          <Settings onClick={() => onNavigate('business-mgmt')} size={14} className="text-slate-800 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
