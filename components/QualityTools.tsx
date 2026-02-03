
import React, { useState } from 'react';
import { 
  FileText, 
  Workflow, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle,
  HelpCircle,
  BrainCircuit
} from 'lucide-react';
import { IshikawaData } from '../types';

const QualityTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'8d' | 'ishikawa'>('8d');
  
  const [ishikawa, setIshikawa] = useState<IshikawaData>({
    method: ['Processo de soldagem fora do padrão'],
    machine: ['Bocal entupido', 'Pressão instável'],
    material: ['Arames com oxidação'],
    measurement: ['Calibração vencida'],
    manpower: ['Falta de treinamento'],
    milieu: ['Alta umidade no setor'],
    effect: 'Trinca na base do cesto W640'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="flex justify-between items-center bg-[#0f172a] border border-slate-800 p-6 rounded-3xl print:hidden">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTool('8d')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTool === '8d' ? 'bg-sky-500 text-slate-900' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <FileText size={18} /> Relatório 8D
          </button>
          <button 
            onClick={() => setActiveTool('ishikawa')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTool === 'ishikawa' ? 'bg-sky-500 text-slate-900' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Workflow size={18} /> Diagrama Ishikawa
          </button>
        </div>
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-slate-900 text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-3"
        >
          <Printer size={18} /> Imprimir Relatório
        </button>
      </div>

      {activeTool === '8d' && (
        <div className="bg-white text-slate-900 p-12 rounded-[3rem] shadow-2xl space-y-12 animate-in slide-in-from-bottom-8 duration-500 print:shadow-none print:p-0">
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Relatório de Solução de Problemas (8D)</h2>
              <p className="text-sm font-bold text-slate-400">METODOLOGIA PANASONIC QUALITY STANDARD</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
               <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Código do Registro</span>
               <span className="text-xl font-black text-slate-800">QA-2024-0082</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xs font-black text-sky-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">D2</span> Descrição do Problema
                </h3>
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium resize-none h-24"
                  placeholder="Descreva o desvio observado..."
                  defaultValue="Observado trinca recorrente na lateral do gabinete modelo W640 após processo de dobra."
                />
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px]">D4</span> Causa Raiz
                </h3>
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium resize-none h-24"
                  placeholder="Resultado da análise de causa..."
                  defaultValue="Pressão excessiva no cilindro hidráulico da dobradora nº 04 devido a falha no pressostato."
                />
              </div>
            </div>
            <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">D6</span> Ações Corretivas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">Troca imediata do pressostato digital</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">Implementação de redundância de leitura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'ishikawa' && (
        <div className="bg-[#0f172a] p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-12">
            <BrainCircuit size={48} className="text-sky-500" />
            <div>
              <h2 className="text-2xl font-black text-white">Análise Causa e Efeito (6M)</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Diagrama de Ishikawa - Industrial Pro</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 relative">
            {/* Espinha dorsal */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-sky-500/20 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 right-0 w-4 h-4 bg-sky-500 rounded-full -translate-y-1/2 shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>

            {/* Ishikawa Sections */}
            {[
              { label: 'Método', key: 'method', color: 'border-sky-500/30' },
              { label: 'Máquina', key: 'machine', color: 'border-emerald-500/30' },
              { label: 'Material', key: 'material', color: 'border-amber-500/30' },
              { label: 'Medição', key: 'measurement', color: 'border-rose-500/30' },
              { label: 'Mão de Obra', key: 'manpower', color: 'border-indigo-500/30' },
              { label: 'Meio Ambiente', key: 'milieu', color: 'border-purple-500/30' }
            ].map((m) => (
              <div key={m.key} className={`p-6 bg-slate-900 rounded-3xl border ${m.color} z-10 hover:scale-105 transition-transform cursor-pointer`}>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{m.label}</h4>
                <ul className="space-y-2">
                  {(ishikawa[m.key as keyof IshikawaData] as string[]).map((item, idx) => (
                    <li key={idx} className="text-xs font-bold text-white flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5"></div>
                      {item}
                    </li>
                  ))}
                  <li className="text-[10px] text-slate-600 font-black flex items-center gap-1 mt-4 hover:text-sky-400">
                    <Plus size={12} /> ADICIONAR CAUSA
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
             <div className="bg-sky-500 p-8 rounded-[2rem] border-4 border-sky-400/50 shadow-2xl shadow-sky-500/20 min-w-[300px] text-center">
                <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 opacity-60">Efeito / Problema</span>
                <span className="text-xl font-black text-slate-950 uppercase leading-none">{ishikawa.effect}</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityTools;
