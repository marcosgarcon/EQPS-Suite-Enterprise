
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Settings2, 
  Zap, 
  ShieldAlert,
  ArrowUpRight,
  BarChart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  AreaChart, 
  Area 
} from 'recharts';

const IndustrialTV: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mockTimeline = [
    { t: '07:00', v: 82 }, { t: '08:00', v: 85 }, { t: '09:00', v: 88 },
    { t: '10:00', v: 84 }, { t: '11:00', v: 86 }, { t: '12:00', v: 91 },
    { t: '13:00', v: 89 }, { t: '14:00', v: 92 },
  ];

  return (
    <div className="h-full space-y-8 animate-in zoom-in-95 duration-700">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Status da Linha</span>
            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full font-black text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              PRODUÇÃO ATIVA
            </div>
          </div>
          <div className="w-px h-12 bg-slate-800"></div>
          <div>
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Turno Atual</span>
            <span className="text-2xl font-black text-white">01 (Manhã)</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Hora Sincronizada</span>
            <span className="text-4xl font-black text-white font-mono tabular-nums">
              {time.toLocaleTimeString()}
            </span>
          </div>
          <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center text-slate-900 shadow-lg shadow-sky-500/20">
            <Clock size={40} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* OEE Main Widget */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
             <BarChart size={240} />
          </div>
          <div className="z-10">
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Eficiência Global (OEE)</h3>
            <div className="flex items-baseline gap-4">
              <span className="text-[12rem] font-black text-white leading-none tracking-tighter">92</span>
              <span className="text-5xl font-black text-sky-500">%</span>
            </div>
          </div>
          
          <div className="h-48 mt-10 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimeline}>
                <defs>
                  <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorOee)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Counters */}
        <div className="space-y-8">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center">
            <Zap className="text-emerald-500 mb-6" size={48} />
            <span className="text-xs font-black text-emerald-500/60 uppercase tracking-widest mb-2">Kaizens Implementados</span>
            <span className="text-8xl font-black text-white">43</span>
            <div className="mt-4 px-4 py-1.5 bg-emerald-500 text-emerald-950 rounded-full text-[10px] font-black uppercase tracking-widest">Meta Superada</div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center">
            <ShieldAlert className="text-rose-500 mb-6" size={48} />
            <span className="text-xs font-black text-rose-500/60 uppercase tracking-widest mb-2">Nível de Rejeição</span>
            <span className="text-8xl font-black text-white">1.2</span>
            <span className="text-xl font-black text-rose-500 mt-2">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialTV;
