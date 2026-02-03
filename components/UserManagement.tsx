
import React from 'react';
// Added missing Users import
import { User, Shield, Mail, Key, LogOut, Settings2, Trash2, Users } from 'lucide-react';
import { EQPSUser } from '../types';

interface UserManagementProps {
  user: EQPSUser;
  onEvent: (type: 'USER', msg: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-gradient-to-r from-sky-600/10 to-indigo-600/10 border border-slate-800 p-12 rounded-[3rem] flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 p-1 flex items-center justify-center shadow-2xl">
           <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center text-5xl font-black text-white">
             {user.name.charAt(0)}
           </div>
        </div>
        <div className="flex-1 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
             <h2 className="text-3xl font-black text-white">{user.name}</h2>
             <span className="px-3 py-1 bg-sky-500 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
           </div>
           <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
             <Mail size={16} /> {user.email}
           </p>
           <div className="flex gap-4 mt-8 justify-center md:justify-start">
             <button className="px-6 py-3 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Editar Perfil</button>
             <button className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Sair do Sistema</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] shadow-xl">
           <div className="flex items-center gap-3 mb-8">
             <Shield size={24} className="text-emerald-500" />
             <h3 className="text-xl font-black text-white">Permissões & Segurança</h3>
           </div>
           <div className="space-y-4">
             {[
               { label: 'Acesso a KPIs Críticos', value: true },
               { label: 'Processamento de Ativos IA', value: true },
               { label: 'Criação de Business Units', value: true },
               { label: 'Exclusão de Registros', value: false }
             ].map((p, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl border border-slate-800">
                 <span className="text-xs font-bold text-slate-300">{p.label}</span>
                 <div className={`w-10 h-6 rounded-full p-1 transition-all ${p.value ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                   <div className={`w-4 h-4 bg-white rounded-full transition-transform ${p.value ? 'translate-x-4' : 'translate-x-0'}`} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] shadow-xl">
           <div className="flex items-center gap-3 mb-8">
             {/* Fix: Users icon now properly imported from lucide-react */}
             <Users size={24} className="text-indigo-500" />
             <h3 className="text-xl font-black text-white">Equipe Autorizada</h3>
           </div>
           <div className="space-y-3">
             {[
               { name: 'Ana Souza', role: 'Master Quality' },
               { name: 'Pedro Lima', role: 'Engineering Lead' },
               { name: 'Carla Dias', role: 'Plant Manager' }
             ].map((u, i) => (
               <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-900 rounded-2xl transition-all cursor-pointer group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">{u.name.charAt(0)}</div>
                   <div>
                     <p className="text-xs font-black text-slate-200">{u.name}</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{u.role}</p>
                   </div>
                 </div>
                 <Trash2 size={14} className="text-slate-800 group-hover:text-rose-500 transition-colors" />
               </div>
             ))}
             <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-sky-500 hover:text-sky-500 transition-all mt-4">Convidar Novo Usuário</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
