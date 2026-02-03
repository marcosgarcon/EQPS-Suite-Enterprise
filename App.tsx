
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KpiDashboard from './components/KpiDashboard';
import KpiDetail from './components/KpiDetail';
import IndustrialTV from './components/IndustrialTV';
import QualityTools from './components/QualityTools';
import EventTerminal from './components/EventTerminal';
import TelemetrySearch from './components/TelemetrySearch';
import UserManagement from './components/UserManagement';
import BusinessManagement from './components/BusinessManagement';
import AssetAdjuster from './components/AssetAdjuster';
import HelpSection from './components/HelpSection';
import OperatorTerminal from './components/OperatorTerminal';
import TrainingAcademy from './components/TrainingAcademy';
import ProjectsManagement from './components/ProjectsManagement';
import ControlChartProcessor from './components/ControlChartProcessor';
import { Database, ViewState, KPIRecord, NavigationState, TelemetryEvent, EQPSUser, CustomModule, CustomTool, PlantNode, IndustrialAsset } from './types';
import { INITIAL_DB, LOCATION } from './constants';
import { 
  ChevronRight,
  User,
  Monitor,
  ShieldCheck,
  Terminal,
  FileText,
  LifeBuoy,
  Rocket,
  Layers,
  GraduationCap,
  Activity,
  Settings,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [db, setDb] = useState<Database>(() => {
    const saved = localStorage.getItem('eqps-enterprise-db-v5');
    return saved ? JSON.parse(saved) : INITIAL_DB;
  });
  
  const [view, setView] = useState<ViewState | string>('dashboard');
  const [selectedKpiKey, setSelectedKpiKey] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [customModules, setCustomModules] = useState<CustomModule[]>([]);
  const [selectedCustomTool, setSelectedCustomTool] = useState<CustomTool | null>(null);

  const [navState, setNavState] = useState<NavigationState>({
    business: null,
    department: null,
    model: null,
    docType: null
  });

  const [currentUser, setCurrentUser] = useState<EQPSUser>({
    id: '1',
    name: 'Admin',
    email: 'admin@panasonic.com',
    role: 'Admin'
  });

  useEffect(() => {
    localStorage.setItem('eqps-enterprise-db-v5', JSON.stringify(db));
    const savedModules = JSON.parse(localStorage.getItem('eqps-native-modules') || '[]');
    setCustomModules(savedModules);
  }, [db]);

  const addEvent = (type: TelemetryEvent['type'], message: string) => {
    const newEvent: TelemetryEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  const handleSidebarNavigate = (state: NavigationState | ViewState | string) => {
    if (typeof state === 'string') {
      setView(state);
      addEvent('NAV', `Acesso: ${state.toUpperCase()}`);
    } else {
      setNavState(state);
      
      const mappedTool = customModules.flatMap(m => m.tools).find(t => 
        t.mapping?.business === state.business &&
        (t.mapping?.department === state.department || !t.mapping?.department) &&
        t.mapping?.docType === state.docType
      );

      if (mappedTool) {
        setSelectedCustomTool(mappedTool);
        setView(`tool-mapped-${mappedTool.id}`);
      } else if (state.docType === 'FITP') {
        setView('operator-terminal');
      } else if (state.docType === 'Cartas de Controle') {
        setView('dimensional-lab');
      } else {
        setView('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans selection:bg-sky-500/30 overflow-hidden">
      <Sidebar 
        onNavigate={handleSidebarNavigate} 
        currentState={navState} 
        currentView={view as ViewState} 
        customModules={customModules}
        structure={db.structure}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-[#0f172a]/95 backdrop-blur-2xl border-b border-slate-800 flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-sky-500/10 p-2.5 rounded-2xl text-sky-400 border border-sky-500/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <span>{LOCATION}</span>
                  <ChevronRight size={10} />
                  <span className="text-sky-500">Intranet v5.0</span>
                </div>
                <h1 className="font-black text-sm text-white uppercase tracking-tighter mt-0.5">
                  {navState.business || 'Gestão Industrial'}
                </h1>
              </div>
            </div>
          </div>

          <TelemetrySearch onEvent={addEvent} />

          <div className="flex items-center gap-3">
            <button onClick={() => setView('tv-monitor')} className={`p-2.5 rounded-xl border ${view === 'tv-monitor' ? 'bg-sky-500 text-slate-900 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              <Monitor size={20} />
            </button>
            <button onClick={() => setShowTerminal(!showTerminal)} className={`p-2.5 rounded-xl border ${showTerminal ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              <Terminal size={20} />
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <button onClick={() => setView('user-mgmt')} className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg group hover:scale-105 transition-all">
              <User size={18} className="text-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <div className="max-w-[1500px] mx-auto pb-32">
            {view === 'dashboard' && !navState.business && <KpiDashboard db={db} onSelectKpi={(key) => { setSelectedKpiKey(key); setView('kpi-detail'); }} />}
            {view === 'business-mgmt' && <BusinessManagement onEvent={addEvent} structure={db.structure} modelAssets={db.modelAssets} onUpdateStructure={(ns) => setDb(prev => ({...prev, structure: ns}))} onUpdateAssets={(na) => setDb(prev => ({...prev, modelAssets: na}))} />}
            {view === 'dimensional-lab' && <ControlChartProcessor nav={navState} onSaveInspection={(ins) => addEvent('SYNC', `Inspeção Dimensional Modelo ${ins.model} Arquivada.`)} />}
            {view === 'operator-terminal' && <OperatorTerminal nav={navState} />}
            {view === 'quality-tools' && <QualityTools />}
            {view === 'training-academy' && <TrainingAcademy user={currentUser} />}
            {view === 'tv-monitor' && <IndustrialTV />}
            {view === 'projects-mgmt' && <ProjectsManagement onNavigate={handleSidebarNavigate} />}
            {view === 'asset-adjuster' && <AssetAdjuster onEvent={addEvent} nav={navState} structure={db.structure} />}
            {view === 'user-mgmt' && <UserManagement user={currentUser} onEvent={addEvent} />}
            {view === 'help' && <HelpSection />}
            
            {view.startsWith('tool-') && selectedCustomTool && (
              <div className="bg-[#0f172a] border border-slate-800 rounded-[3.5rem] p-12 min-h-[700px] shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
                <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-sky-500 rounded-[1.8rem] flex items-center justify-center text-slate-950 shadow-2xl"><Activity size={32} /></div>
                    <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedCustomTool.name}</h2>
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">SISTEMA LEGADO INTEGRADO</p>
                    </div>
                  </div>
                  {/* Fixed: X icon was missing from imports */}
                  <button onClick={() => setView('dashboard')} className="text-slate-500 hover:text-white"><X size={24} /></button>
                </div>
                <iframe 
                  title={selectedCustomTool.name}
                  className="w-full h-[600px] bg-transparent rounded-3xl border border-slate-800/50"
                  srcDoc={`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body style="background: transparent; color: white;">${selectedCustomTool.code}</body></html>`}
                />
              </div>
            )}
          </div>
        </main>
        <EventTerminal events={events} isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
      </div>
    </div>
  );
};

export default App;
