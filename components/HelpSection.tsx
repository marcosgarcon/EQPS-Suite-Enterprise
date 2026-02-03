
import React from 'react';
import { 
  HelpCircle, 
  Shield, 
  Target, 
  Activity, 
  FileText, 
  BrainCircuit, 
  Search, 
  Download, 
  Monitor, 
  Cpu, 
  LifeBuoy, 
  Info, 
  CheckCircle2,
  HardDrive,
  Globe,
  Smartphone
} from 'lucide-react';

const HelpSection: React.FC = () => {
  const sections = [
    {
      title: 'Relatório 8D',
      icon: FileText,
      color: 'text-sky-500',
      description: 'Metodologia estruturada para solução de problemas complexos. Use o módulo de Ferramentas de Qualidade para registrar de D2 (Problema) até D8 (Reconhecimento).',
      usage: 'Acesse o menu Lateral > Ferramentas de Qualidade > Selecione 8D.'
    },
    {
      title: 'Diagrama Ishikawa (6M)',
      icon: BrainCircuit,
      color: 'text-emerald-500',
      description: 'Análise de causa e efeito baseada nos 6 pilares industriais: Método, Máquina, Material, Medição, Mão de Obra e Meio Ambiente.',
      usage: 'Útil para sessões de brainstorming técnico após um desvio de KPI.'
    },
    {
      title: 'Industrial TV Monitor',
      icon: Activity,
      color: 'text-amber-500',
      description: 'Interface de telemetria de alta visibilidade projetada para telões de 50"+. Exibe OEE e Kaizens em tempo real.',
      usage: 'Ative o modo TV no ícone de Monitor no cabeçalho.'
    },
    {
      title: 'Projetos & Instruções',
      icon: Target,
      color: 'text-indigo-500',
      description: 'Gestão de melhorias industriais com campo dedicado para Instruções de Uso e exemplos práticos para a equipe de operação.',
      usage: 'Cada projeto possui um "Guia de Execução" editável pelo gestor.'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-sky-500/10 text-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
           <LifeBuoy size={40} className="opacity-80" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Manual de Operação EQPS</h2>
        <p className="text-slate-500 mt-2 font-medium">Documentação técnica e guia de instalação para a Unidade de Extrema.</p>
      </div>

      {/* GUIA DE INSTALAÇÃO OFFLINE / PWA */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Download size={200} />
        </div>
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Monitor size={24} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Guia de Instalação Offline (PWA)</h3>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Transformando o sistema em um Aplicativo Desktop (.exe)</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px]">01</span> Instalação
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abra o sistema no <b>Chrome</b> ou <b>Edge</b>. No lado direito da barra de endereços, clique no ícone de "Instalar" (computador com seta). O sistema será adicionado como um programa nativo ao seu Windows.
              </p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px]">02</span> Identidade
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                O aplicativo terá o ícone oficial <b>EQPS</b> na sua Área de Trabalho e Menu Iniciar. Ele abre em uma janela independente, sem barras de navegação, focando 100% na operação industrial.
              </p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px]">03</span> Suporte Offline
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Graças ao <b>Service Worker (sw.js)</b>, os recursos básicos e a interface são cacheados. Você pode abrir o app sem internet para consultar manuais e projetos já carregados anteriormente.
              </p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                 <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px]">04</span> Execução
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para baixar os arquivos e rodar localmente, salve a pasta do projeto. Use um servidor simples como <b>Live Server</b> ou <b>npx serve</b>. Após o primeiro acesso, a instalação PWA cuida do resto.
              </p>
           </div>
        </div>

        <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-4">
           <Info className="text-sky-400" size={20} />
           <p className="text-[11px] text-slate-500 font-medium">
             <b>Nota Técnica:</b> Funcionalidades de Inteligência Artificial (Gemini) ainda requerem conexão ativa para processamento em nuvem. A interface e consulta de documentos salvos funcionam offline.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] shadow-xl hover:border-slate-700 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 bg-slate-900 rounded-3xl border border-slate-800 ${s.color} group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{s.title}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.description}</p>
            <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-start gap-3">
               <CheckCircle2 size={16} className="text-sky-500 mt-0.5" />
               <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Como utilizar</span>
                 <p className="text-xs font-bold text-sky-400">{s.usage}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSection;
