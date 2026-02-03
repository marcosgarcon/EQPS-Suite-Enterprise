
import React, { useMemo } from 'react';
import { Database, KPI } from '../types';
import { COLORS } from '../constants';
import { 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ArrowUpRight,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface KpiDashboardProps {
  db: Database;
  onSelectKpi: (key: string) => void;
}

const checkTarget = (val: number, comp: KPI['comparator'], target: number) => {
  switch (comp) {
    case '>=': return val >= target;
    case '<=': return val <= target;
    case '>': return val > target;
    case '<': return val < target;
    case '=': return val === target;
    default: return false;
  }
};

const KpiDashboard: React.FC<KpiDashboardProps> = ({ db, onSelectKpi }) => {
  const categories = ['Segurança', 'Qualidade', 'Produtividade e Eficiência'];
  
  const stats = useMemo(() => {
    return categories.map(cat => {
      const kpisInCat = (Object.values(db.kpis) as KPI[]).filter(k => k.category === cat);
      let hit = 0;
      let total = 0;

      kpisInCat.forEach(k => {
        const recs = db.records[k.key] || [];
        if (recs.length > 0) {
          total++;
          const last = recs[recs.length - 1];
          if (checkTarget(last.value, k.comparator, k.target)) hit++;
        }
      });

      return {
        name: cat,
        percentage: total > 0 ? Math.round((hit / total) * 100) : 0,
        total,
        hit
      };
    });
  }, [db]);

  const alerts = useMemo(() => {
    return (Object.values(db.kpis) as KPI[]).filter(k => {
      const recs = db.records[k.key] || [];
      if (recs.length === 0) return false;
      const last = recs[recs.length - 1];
      return !checkTarget(last.value, k.comparator, k.target);
    });
  }, [db]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Adherence Chart */}
        <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Activity size={16} className="text-sky-400" /> Desempenho Global
              </h3>
              <p className="text-[10px] text-slate-600 font-bold mt-1">PERCENTUAL DE ADERÊNCIA ÀS METAS</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#020617', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '16px', 
                    fontSize: '11px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)'
                  }}
                />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]} name="% Aderência" barSize={40}>
                  {stats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.percentage >= 90 ? COLORS.success : entry.percentage >= 70 ? COLORS.warning : COLORS.danger} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Deviations */}
        <div className="w-full lg:w-[420px] bg-[#0f172a] border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500" /> Desvios Ativos
            </h3>
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[10px] font-black">{alerts.length}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] lg:max-h-full pr-2 custom-scrollbar">
            {alerts.length > 0 ? alerts.map(k => {
              const last = db.records[k.key][db.records[k.key].length - 1];
              return (
                <div 
                  key={k.key} 
                  onClick={() => onSelectKpi(k.key)} 
                  className="group p-4 bg-[#020617] border border-slate-800 rounded-2xl hover:border-rose-500/40 hover:bg-rose-500/5 transition-all cursor-pointer border-l-4 border-l-rose-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-100 truncate pr-4 group-hover:text-white">{k.name}</span>
                    <span className="text-sm font-black text-rose-500 font-mono">{last.value}{k.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Objetivo: {k.comparator}{k.target}</div>
                    <ArrowUpRight size={12} className="text-slate-700 group-hover:text-rose-400 transition-colors" />
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 py-10">
                <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/10">
                  <CheckCircle2 size={32} className="text-emerald-500/40" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-black uppercase tracking-widest text-emerald-500/60">Sistema em Conformidade</span>
                  <p className="text-[10px] mt-1 font-medium text-slate-700">Todos os indicadores estão dentro da meta estabelecida.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {(Object.values(db.kpis) as KPI[]).map(k => {
          const recs = db.records[k.key] || [];
          const last = recs.length > 0 ? recs[recs.length - 1] : null;
          const isOk = last ? checkTarget(last.value, k.comparator, k.target) : true;

          return (
            <div 
              key={k.key} 
              onClick={() => onSelectKpi(k.key)}
              className="group bg-[#0f172a] border border-slate-800 p-6 rounded-[2rem] cursor-pointer hover:border-sky-500/40 hover:bg-[#1e293b]/30 hover:shadow-2xl hover:shadow-sky-500/5 transition-all relative overflow-hidden active:scale-[0.98]"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${!last ? 'bg-slate-700' : isOk ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]">{k.category}</span>
                <div className="p-2 bg-[#020617] rounded-xl border border-slate-800 group-hover:bg-sky-500 group-hover:border-sky-400 transition-all">
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
              <h4 className="text-[13px] font-bold text-slate-300 mb-6 leading-snug group-hover:text-white transition-colors h-10 overflow-hidden">{k.name}</h4>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                   <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">Realizado</span>
                   <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white tracking-tighter">{last ? last.value : '—'}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{k.unit}</span>
                   </div>
                </div>
                <div className="text-right pb-1">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <Target size={10} className="text-slate-600" />
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Meta</span>
                  </div>
                  <span className="text-xs font-black text-slate-400 font-mono bg-[#020617] px-2 py-0.5 rounded border border-slate-800">{k.comparator}{k.target}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KpiDashboard;
