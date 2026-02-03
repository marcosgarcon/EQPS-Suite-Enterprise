
import React, { useState } from 'react';
import { KPI, KPIRecord, ActionPlan } from '../types';
import { COLORS } from '../constants';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  History,
  TrendingUp,
  LayoutList,
  Save,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface KpiDetailProps {
  kpi: KPI;
  records: KPIRecord[];
  plans: ActionPlan[];
  onAddRecord: (rec: Omit<KPIRecord, 'id'>) => void;
  onDeleteRecord: (id: number) => void;
  onAddPlan: (plan: Omit<ActionPlan, 'id'>) => void;
  onDeletePlan: (id: number) => void;
}

const KpiDetail: React.FC<KpiDetailProps> = ({ 
  kpi, records, plans, onAddRecord, onDeleteRecord, onAddPlan, onDeletePlan 
}) => {
  const [tab, setTab] = useState<'overview' | 'history' | 'plans'>('overview');
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  // Record Form State
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    reason: ''
  });

  // Action Plan Form State
  const [planForm, setPlanForm] = useState({
    title: '',
    responsible: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Aberto' as ActionPlan['status']
  });

  const lastRecord = records.length > 0 ? records[records.length - 1] : null;
  
  const checkTarget = (val: number) => {
    switch (kpi.comparator) {
      case '>=': return val >= kpi.target;
      case '<=': return val <= kpi.target;
      case '>': return val > kpi.target;
      case '<': return val < kpi.target;
      case '=': return val === kpi.target;
      default: return false;
    }
  };

  const isOk = lastRecord ? checkTarget(lastRecord.value) : true;

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.value) return;
    onAddRecord({
      date: form.date,
      value: parseFloat(form.value),
      reason: form.reason
    });
    setForm({ ...form, value: '', reason: '' });
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.title) return;
    onAddPlan(planForm);
    setPlanForm({
      title: '',
      responsible: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Aberto'
    });
    setShowPlanModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header KPI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0f172a] border border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-black text-sky-400 uppercase tracking-widest">{kpi.category}</span>
          <h2 className="text-3xl font-black text-white tracking-tight">{kpi.name}</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase">Meta</span>
              <span className="text-xs font-bold text-slate-200">{kpi.comparator} {kpi.target} {kpi.unit}</span>
            </div>
            {lastRecord && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isOk ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                {isOk ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                <span className="text-[10px] font-black uppercase">{isOk ? 'Conforme' : 'Fora da Meta'}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-[10px] font-black text-slate-500 uppercase mb-1">Última Medição</span>
            <div className={`text-4xl font-black ${!lastRecord ? 'text-slate-700' : isOk ? 'text-emerald-500' : 'text-rose-500'}`}>
              {lastRecord ? lastRecord.value : '—'}
              <span className="text-sm font-bold text-slate-500 ml-1">{kpi.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Lançamento */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-lg border-l-4 border-l-sky-500">
        <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Data da Medição</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="date" 
                className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:ring-1 focus:ring-sky-500 transition-all outline-none"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Valor ({kpi.unit})</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00"
              className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-bold focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              value={form.value}
              onChange={e => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Observação / Causa</label>
            <input 
              type="text" 
              placeholder="Justificativa técnica..."
              className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2 bg-sky-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-400 transition-all flex items-center justify-center gap-2"
          >
            <Save size={14} /> Salvar Registro
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        <button 
          onClick={() => setTab('overview')}
          className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === 'overview' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {tab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400"></div>}
          <div className="flex items-center gap-2"><TrendingUp size={14} /> Evolução</div>
        </button>
        <button 
          onClick={() => setTab('history')}
          className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === 'history' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {tab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400"></div>}
          <div className="flex items-center gap-2"><History size={14} /> Histórico</div>
        </button>
        <button 
          onClick={() => setTab('plans')}
          className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === 'plans' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {tab === 'plans' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400"></div>}
          <div className="flex items-center gap-2"><LayoutList size={14} /> Planos ({plans.length})</div>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {tab === 'overview' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 animate-in zoom-in-95 duration-300">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Gráfico de Tendência Industrial</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#64748b' }} 
                    tickFormatter={(str) => new Date(str).toLocaleDateString()}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <ReferenceLine y={kpi.target} label={{ position: 'right', value: 'META', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} stroke="#10b981" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#38bdf8" 
                    strokeWidth={3} 
                    dot={{ fill: '#38bdf8', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in duration-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#020617] text-slate-500 uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Observação</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[...records].reverse().map(r => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-medium">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-white font-black">{r.value} <span className="text-[10px] text-slate-500">{kpi.unit}</span></td>
                    <td className="px-6 py-4">
                      {checkTarget(r.value) ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold uppercase text-[9px]">
                          <CheckCircle size={10} /> Conforme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-500 font-bold uppercase text-[9px]">
                          <AlertTriangle size={10} /> Desvio
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">{r.reason || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && (
              <div className="p-20 text-center text-slate-600 font-bold italic">Nenhum registro encontrado para este indicador.</div>
            )}
          </div>
        )}

        {tab === 'plans' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Ações Corretivas e Preventivas</h3>
              <button 
                onClick={() => setShowPlanModal(true)}
                className="px-4 py-2 bg-slate-800 text-sky-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Novo Plano
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(p => (
                <div key={p.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-3xl relative group hover:border-sky-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                      p.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' : 
                      p.status === 'Em Andamento' ? 'bg-amber-500/10 text-amber-500' : 
                      'bg-sky-500/10 text-sky-500'
                    }`}>
                      {p.status}
                    </div>
                    <button 
                      onClick={() => onDeletePlan(p.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-white mb-2 leading-snug">{p.title}</h4>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800/50">
                    <div className="space-y-1">
                      <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">Responsável</span>
                      <span className="text-xs font-bold text-slate-400">{p.responsible}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">Prazo</span>
                      <span className="text-xs font-bold text-slate-400">{new Date(p.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="col-span-full bg-[#0f172a] border border-dashed border-slate-800 p-12 rounded-3xl text-center text-slate-600 font-bold italic">
                  Nenhum plano de ação cadastrado para tratar desvios.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Plano de Ação */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-black text-white">Novo Plano de Ação</h3>
              <button onClick={() => setShowPlanModal(false)} className="text-slate-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddPlan} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Descrição da Ação</label>
                <textarea 
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-xs text-white h-24 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
                  placeholder="Descreva a atividade..."
                  required
                  value={planForm.title}
                  onChange={e => setPlanForm({ ...planForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Responsável</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Nome"
                    required
                    value={planForm.responsible}
                    onChange={e => setPlanForm({ ...planForm, responsible: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Prazo</label>
                  <input 
                    type="date" 
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500"
                    required
                    value={planForm.date}
                    onChange={e => setPlanForm({ ...planForm, date: e.target.value })}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-sky-500 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all mt-4"
              >
                Criar Plano
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiDetail;
