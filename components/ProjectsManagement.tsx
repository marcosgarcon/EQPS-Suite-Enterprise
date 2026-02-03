
import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  CheckSquare, 
  Square, 
  X, 
  Save, 
  ChevronRight, 
  TrendingUp, 
  Target, 
  ArrowLeft, 
  History, 
  Layout, 
  Maximize2, 
  AlertCircle,
  Camera,
  FileText,
  Zap,
  MoreHorizontal,
  BookOpen,
  Info,
  Terminal,
  Lightbulb,
  Wrench,
  Wand2,
  ExternalLink,
  Code,
  Activity
} from 'lucide-react';
import { Project, ProjectTask, CustomTool, CustomModule, ViewState, NavigationState } from '../types';
import { LOCATION } from '../constants';

interface ProjectsManagementProps {
  onNavigate?: (state: string | ViewState | NavigationState) => void;
}

const CATEGORIES = [
  'Plano de Ação', 
  'Padronização', 
  'Lean Six Sigma', 
  'Monitoramento', 
  'Análise de Falha', 
  'Kaizen/5S', 
  'Comitê', 
  'Treinamento'
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Redução de Defeitos WM - Analista de Qualidade',
    category: 'Plano de Ação',
    description: 'Mapeamento e mitigação de defeitos críticos na linha de Lavadoras utilizando ferramentas de qualidade avançadas.',
    responsible: 'Analista de Qualidade WM',
    status: 'Em Execução',
    progress: 40,
    startDate: '2024-05-01',
    endDate: '2024-07-15',
    instructions: '### GUIA DE EXECUÇÃO TÉCNICA\n\nEste projeto foca na redução de PPM através da análise de dados do SAP.\n\n**Exemplo Prático de Coleta:**\n1. Acesse a transação ZQA_LOGS no SAP.\n2. Filtre pela Linha 03 (WM).\n3. Exporte para Excel e utilize a Macro de Pareto.\n\n**Exemplo de Ação Imediata:**\nCaso o defeito "Ruído Excessivo" atinja 5%, pare a linha e verifique o torque da porca do batedor.',
    tasks: [
      { id: 't1', title: 'Mapear principais defeitos com Pareto', completed: true },
      { id: 't2', title: 'Investigar causas com 5 Porquês e Ishikawa', completed: true },
      { id: 't3', title: 'Planejar ações corretivas com 5W2H', completed: false },
      { id: 't4', title: 'Implementar melhorias e treinar equipe', completed: false },
      { id: 't5', title: 'Monitorar resultados com KPIs (PPM, retrabalho)', completed: false }
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  }
];

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'tools'>('projects');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('eqps-projects-vfinal-v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [displayTools, setDisplayTools] = useState<(CustomTool & { moduleId: string })[]>([]);
  
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Sincronização com o Laboratório de IA
  useEffect(() => {
    const loadIntegratedTools = () => {
      const savedModules: CustomModule[] = JSON.parse(localStorage.getItem('eqps-native-modules') || '[]');
      const flattened = savedModules.flatMap(m => m.tools.map(t => ({ ...t, moduleId: m.id })));
      setDisplayTools(flattened);
    };

    loadIntegratedTools();
    window.addEventListener('storage', loadIntegratedTools);
    return () => window.removeEventListener('storage', loadIntegratedTools);
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Plano de Ação',
      description: '',
      responsible: 'Gestor da Unidade',
      status: 'Planejamento',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: '',
      tasks: []
    });
    setIsModalOpen(true);
  };

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormData(project);
    setIsModalOpen(true);
  };

  useEffect(() => {
    localStorage.setItem('eqps-projects-vfinal-v3', JSON.stringify(projects));
  }, [projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleSave = () => {
    if (!formData.title) return;
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } as Project : p));
    } else {
      const newProject: Project = { 
        ...formData, 
        id: 'p-' + Date.now(), 
        progress: 0, 
        tasks: formData.tasks || [] 
      } as Project;
      setProjects(prev => [newProject, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleToolDelete = (id: string, moduleId: string) => {
    if (confirm('Excluir este ativo industrial permanentemente?')) {
      const savedModules: CustomModule[] = JSON.parse(localStorage.getItem('eqps-native-modules') || '[]');
      const updatedModules = savedModules.map(m => {
        if (m.id === moduleId) {
          return { ...m, tools: m.tools.filter(t => t.id !== id) };
        }
        return m;
      }).filter(m => m.tools.length > 0);

      localStorage.setItem('eqps-native-modules', JSON.stringify(updatedModules));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const addTask = () => {
    if (!newTaskTitle) return;
    const newTask = { id: 't-' + Date.now(), title: newTaskTitle, completed: false };
    setFormData(prev => ({ ...prev, tasks: [...(prev.tasks || []), newTask] }));
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    const currentTasks = formData.tasks || [];
    const updated = currentTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    const progress = updated.length > 0 ? Math.round((updated.filter(t => t.completed).length / updated.length) * 100) : 0;
    
    setFormData(prev => ({ ...prev, tasks: updated, progress }));
    
    if (selectedProjectId) {
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...p, tasks: updated, progress } : p));
    }
  };

  const removeTask = (id: string) => {
    const updated = (formData.tasks || []).filter(t => t.id !== id);
    setFormData(prev => ({ ...prev, tasks: updated }));
  };

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (viewMode === 'detail' && selectedProject) {
    return (
      <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 pb-32">
        <div className="flex justify-between items-center">
          <button onClick={() => setViewMode('grid')} className="flex items-center gap-4 text-slate-500 hover:text-white group">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl group-hover:border-indigo-500"><ArrowLeft size={20} /></div>
            <span className="text-xs font-bold">Voltar ao Painel</span>
          </button>
          <button 
            onClick={(e) => handleEditProject(e, selectedProject)}
            className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-indigo-500 transition-all flex items-center gap-2"
          >
            <Edit2 size={14} /> Editar
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-[#0f172a] border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Rocket size={180} />
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">{selectedProject.title}</h1>
                <p className="text-slate-400 font-medium leading-relaxed max-w-3xl text-base">{selectedProject.description}</p>
                <div className="grid grid-cols-3 gap-8 mt-12 border-t border-slate-800 pt-10 text-slate-100 font-black text-sm">
                   <div><span className="block text-[10px] text-slate-600 uppercase mb-1">Responsável</span>{selectedProject.responsible}</div>
                   <div><span className="block text-[10px] text-slate-600 uppercase mb-1">Início</span>{new Date(selectedProject.startDate).toLocaleDateString()}</div>
                   <div><span className="block text-[10px] text-slate-600 uppercase mb-1">Status</span>{selectedProject.status}</div>
                </div>
             </div>

             <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-12 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Evolução de Atividades</h3>
                <div className="space-y-5">
                   {selectedProject.tasks.map((task) => (
                     <div key={task.id} className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#020617] border-slate-800'}`}>
                        <div className="flex items-center gap-6">
                           <button onClick={() => toggleTask(task.id)} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-900 border border-slate-700 text-slate-600 hover:text-white transition-all">
                             {task.completed ? <CheckCircle className="text-emerald-500" /> : <div className="w-5 h-5 rounded border-2 border-current opacity-30"></div>}
                           </button>
                           <span className={`text-base font-black uppercase tracking-tight ${task.completed ? 'text-slate-600 line-through' : 'text-slate-100'}`}>{task.title}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-[#0f172a] border border-slate-800 rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Aderência Industrial</span>
                <div className="text-6xl font-black text-white">{selectedProject.progress}%</div>
                <div className="h-2 w-full bg-slate-900 rounded-full mt-8 overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-500" style={{width: `${selectedProject.progress}%`}}></div></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-center">
        <div className="bg-[#0f172a] border border-slate-800 p-2 rounded-[2.5rem] flex gap-2 shadow-2xl">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'projects' ? 'bg-indigo-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Rocket size={18} /> Roadmap de Projetos
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'tools' ? 'bg-sky-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Wrench size={18} /> Utilitários Integrados
          </button>
        </div>
      </div>

      {activeTab === 'projects' ? (
        <>
          <div className="bg-[#0f172a] border border-slate-800 p-14 rounded-[4.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-10 relative z-10">
              <div className="w-28 h-28 bg-indigo-500 rounded-[3rem] flex items-center justify-center text-slate-900 shadow-2xl shadow-indigo-500/30">
                <Rocket size={56} />
              </div>
              <div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3">Industrial Roadmap</h2>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[11px]">Centro de Gestão de Ativos</span>
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                  <span className="text-indigo-500 font-black uppercase tracking-widest text-[11px]">{LOCATION}</span>
                </div>
              </div>
            </div>
            <button onClick={openCreateModal} className="px-12 py-6 bg-indigo-500 text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all flex items-center gap-4 relative z-10 shadow-2xl shadow-indigo-500/20">
              <Plus size={28} /> Iniciar Iniciativa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map(project => (
              <div key={project.id} onClick={() => { setSelectedProjectId(project.id); setViewMode('detail'); }} className="bg-[#0f172a] border border-slate-800 rounded-[4rem] overflow-hidden flex flex-col group hover:border-indigo-500/50 transition-all shadow-2xl cursor-pointer active:scale-95">
                <div className="h-56 w-full relative overflow-hidden bg-slate-900">
                  {project.image ? <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-30" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Rocket size={100} /></div>}
                  <div className="absolute top-10 left-10"><span className="text-[10px] font-black text-white bg-indigo-600 px-5 py-2 rounded-full uppercase tracking-widest">{project.category}</span></div>
                </div>
                <div className="p-12">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-6 group-hover:text-indigo-400 h-14 overflow-hidden">{project.title}</h3>
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase"><span>Aderência</span><span className="text-indigo-400">{project.progress}%</span></div>
                    <div className="h-2.5 bg-[#020617] rounded-full overflow-hidden border border-slate-800"><div className="h-full bg-indigo-500" style={{ width: `${project.progress}%` }}></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-12">
          <div className="bg-[#0f172a] border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-sky-500 rounded-[2rem] flex items-center justify-center text-slate-900 shadow-xl shadow-sky-500/20">
                   <Wrench size={40} />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tight">Ativos Refatorados</h2>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Sistemas Legados Integrados ao Ecossistema EQPS</p>
                </div>
             </div>
             <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl text-sky-400 font-black text-xs uppercase tracking-widest">
                {displayTools.length} ARQUIVOS INTEGRADOS
             </div>
          </div>

          {displayTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {displayTools.map(tool => (
                 <div key={tool.id} className="bg-[#0f172a] border border-slate-800 rounded-[3.5rem] p-10 shadow-2xl hover:border-sky-500/40 transition-all flex flex-col group active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-8">
                       <div className="p-5 bg-slate-900 rounded-[1.5rem] text-sky-400 border border-slate-800 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                          <Code size={24} />
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleToolDelete(tool.id, tool.moduleId); }}
                         className="p-3 text-slate-800 hover:text-rose-500 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{tool.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mb-10 leading-relaxed italic line-clamp-2">{tool.description}</p>
                    
                    <button 
                      onClick={() => onNavigate && onNavigate(`tool-${tool.moduleId}-${tool.id}`)}
                      className="w-full py-5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-slate-950 transition-all flex items-center justify-center gap-3"
                    >
                       Executar no Sandbox <ExternalLink size={14} />
                    </button>
                 </div>
               ))}
            </div>
          ) : (
            <div className="bg-[#0f172a] border border-dashed border-slate-800 p-24 rounded-[4rem] text-center space-y-6">
               <div className="flex justify-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-slate-800">
                     <Wand2 size={48} />
                  </div>
               </div>
               <h3 className="text-xl font-black text-slate-300 uppercase">Nenhum Ativo Industrial Detectado</h3>
               <p className="text-sm text-slate-600 max-w-sm mx-auto">Utilize o **Laboratório de IA** para importar seus arquivos .html e .js legados.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal - Unified Project Creator & Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[5rem] w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="p-12 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tight">{editingProject ? 'Refinar Iniciativa' : 'Estruturar Iniciativa'}</h3>
                <p className="text-xs text-slate-600 font-black uppercase tracking-[0.4em] mt-3">Modelagem Técnica Industrial v2.0</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-5 hover:bg-slate-800 rounded-[2rem] text-slate-500 hover:text-white transition-all"><X size={32} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-14 custom-scrollbar space-y-16">
              <div className="grid grid-cols-2 gap-16">
                 <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-6">Título do Projeto</label>
                      <input 
                        className="w-full bg-[#020617] border border-slate-800 rounded-[2.5rem] px-10 py-6 text-white outline-none focus:border-indigo-500 transition-all"
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                 </div>
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-6">Roadmap de Milestones</label>
                       <div className="flex gap-3">
                          <input 
                            className="flex-1 bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white outline-none"
                            placeholder="Nova meta..."
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                          />
                          <button onClick={addTask} className="p-4 bg-indigo-500 text-slate-950 rounded-2xl hover:bg-indigo-400 transition-all"><Plus size={20} /></button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            <div className="p-14 border-t border-slate-800 bg-slate-900/40 flex justify-end gap-6">
              <button onClick={() => setIsModalOpen(false)} className="px-14 py-6 text-slate-500 font-black uppercase hover:text-white transition-all">Cancelar</button>
              <button onClick={handleSave} className="px-20 py-6 bg-indigo-500 text-slate-950 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20">Consolidar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
