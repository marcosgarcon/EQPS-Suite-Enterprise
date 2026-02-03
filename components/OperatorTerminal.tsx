
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Target,
  Maximize2,
  Camera,
  RotateCcw
} from 'lucide-react';
import { NavigationState, FITPStep, MeasurementPoint } from '../types';
import { MOCK_FITP, MOCK_MEASUREMENTS } from '../constants';

interface OperatorTerminalProps {
  nav: NavigationState;
}

const OperatorTerminal: React.FC<OperatorTerminalProps> = ({ nav }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [fitpSteps, setFitpSteps] = useState<FITPStep[]>([]);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);

  useEffect(() => {
    if (nav.model && MOCK_FITP[nav.model]) {
      setFitpSteps(MOCK_FITP[nav.model]);
      setPoints(MOCK_MEASUREMENTS[nav.model] || []);
    }
  }, [nav.model]);

  if (!nav.model) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <Target size={64} className="opacity-20" />
        <p className="font-black uppercase tracking-widest">Selecione um Modelo no Navegador</p>
      </div>
    );
  }

  const currentStep = fitpSteps[currentStepIdx];
  const relatedPoints = points.filter(p => currentStep?.points.includes(p.id));

  const handleValidation = (pointId: string, status: 'APROVADO' | 'REPROVADO') => {
    setPoints(prev => prev.map(p => p.id === pointId ? { ...p, status, measured: p.nominal } : p));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Cabeçalho da Etapa */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-lg shadow-sky-500/20">
            {currentStep?.step || 1}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{currentStep?.description || 'Carregando...'}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Processo: FITP Standard</span>
              {currentStep?.critical && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-black uppercase">
                  <AlertTriangle size={10} /> Ponto Crítico
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <button 
            onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
            disabled={currentStepIdx === 0}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center min-w-[100px]">
            <span className="block text-[10px] font-black text-slate-600 uppercase tracking-widest">Etapa</span>
            <span className="text-xl font-black text-white">{currentStepIdx + 1} / {fitpSteps.length}</span>
          </div>
          <button 
            onClick={() => setCurrentStepIdx(Math.min(fitpSteps.length - 1, currentStepIdx + 1))}
            disabled={currentStepIdx === fitpSteps.length - 1}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guia Visual */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] overflow-hidden flex flex-col relative group">
          <div className="absolute top-6 left-6 z-10">
            <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:bg-black/60 transition-all">
              <Maximize2 size={20} />
            </button>
          </div>
          <img 
            src={currentStep?.image || 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800'} 
            className="w-full h-[400px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            alt="Guia de Operação"
          />
          <div className="p-8 bg-gradient-to-t from-[#020617] via-[#0f172a] to-transparent">
             <div className="flex items-start gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem]">
               <Info className="text-sky-400 shrink-0 mt-1" size={20} />
               <div>
                 <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Instrução de Trabalho</span>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed">
                   {relatedPoints[0]?.instruction || 'Realize o encaixe conforme gabarito de montagem. Verifique alinhamento lateral.'}
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Centro de Validação */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Medições Requeridas</h3>
          {relatedPoints.map(p => (
            <div key={p.id} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] shadow-xl space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Referência: {p.id}</span>
                  <h4 className="text-xl font-black text-white uppercase mt-1">{p.label}</h4>
                </div>
                <div className="text-right">
                   <span className="block text-[10px] font-black text-slate-500 uppercase mb-1">Cota Nominal</span>
                   <span className="text-3xl font-black text-white font-mono">{p.nominal.toFixed(2)}<span className="text-sm text-slate-600 ml-1">mm</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                  <span className="block text-[9px] font-black text-slate-600 uppercase mb-1">Limite Superior</span>
                  <span className="text-sm font-black text-emerald-500 font-mono">+{(p.nominal + p.tolerancePlus).toFixed(2)}</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                  <span className="block text-[9px] font-black text-slate-600 uppercase mb-1">Limite Inferior</span>
                  <span className="text-sm font-black text-rose-500 font-mono">-{(p.nominal - p.toleranceMinus).toFixed(2)}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleValidation(p.id, 'REPROVADO')}
                  className={`py-8 rounded-[2rem] font-black uppercase tracking-widest flex flex-col items-center gap-3 transition-all active:scale-95 border-2 ${p.status === 'REPROVADO' ? 'bg-rose-500 border-rose-400 text-slate-950 shadow-lg shadow-rose-500/20' : 'bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10'}`}
                >
                  <XCircle size={40} />
                  <span>REPROVAR</span>
                </button>
                <button 
                  onClick={() => handleValidation(p.id, 'APROVADO')}
                  className={`py-8 rounded-[2rem] font-black uppercase tracking-widest flex flex-col items-center gap-3 transition-all active:scale-95 border-2 ${p.status === 'APROVADO' ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'}`}
                >
                  <CheckCircle size={40} />
                  <span>APROVAR</span>
                </button>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all">
                  <Camera size={16} /> Registrar Foto
                </button>
                <button className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all">
                  <RotateCcw size={16} /> Resetar Ponto
                </button>
              </div>
            </div>
          ))}

          {relatedPoints.length === 0 && (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center flex flex-col items-center gap-4 text-slate-600">
               <CheckCircle size={48} className="opacity-20 text-emerald-500" />
               <p className="font-black uppercase tracking-widest text-[10px]">Nenhuma medição para esta etapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorTerminal;
