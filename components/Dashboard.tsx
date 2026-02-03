
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileUp, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { COLORS, LOCATION } from '../constants';

const statsData = [
  { label: 'Total de Validações', value: '1.284', icon: FileUp, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Taxa de Aprovação', value: '92.4%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Rejeitos Críticos', value: '7.6%', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'Pendentes Hoje', value: '24', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const chartData = [
  { name: 'Jan', aprovado: 400, reprovado: 24 },
  { name: 'Fev', aprovado: 300, reprovado: 45 },
  { name: 'Mar', aprovado: 200, reprovado: 32 },
  { name: 'Abr', aprovado: 278, reprovado: 12 },
  { name: 'Mai', aprovado: 189, reprovado: 56 },
  { name: 'Jun', aprovado: 239, reprovado: 43 },
];

const pieData = [
  { name: 'Aprovado', value: 850 },
  { name: 'Reprovado', value: 80 },
  { name: 'Pendente', value: 45 },
];

const PIE_COLORS = [COLORS.success, COLORS.danger, COLORS.warning];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Visão Geral EQPS</h2>
          <p className="text-slate-500 text-sm">Monitoramento de conformidade da {LOCATION}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Relatório Mensal</button>
          <button className="px-4 py-2 bg-panasonic-blue text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all">Exportar Dados</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-600">
              <TrendingUp size={12} className="mr-1" />
              <span>+3.2% vs mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest">Histórico de Conformidade</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="aprovado" fill={COLORS.panasonic} radius={[4, 4, 0, 0]} name="Aprovado" />
                <Bar dataKey="reprovado" fill={COLORS.danger} radius={[4, 4, 0, 0]} name="Reprovado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest">Distribuição por Status</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[i]}} />
                  <span className="text-slate-500 uppercase tracking-tighter">{d.name}</span>
                </div>
                <span className="text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
