
import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Award, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Printer,
  Search,
  Plus,
  Wand2,
  Sparkles,
  ArrowLeft,
  BookMarked,
  Layers,
  Save,
  Loader2,
  Cpu,
  ShieldCheck,
  Zap,
  FileCheck,
  FileText,
  Upload
} from 'lucide-react';
import { EQPSUser, Course, TrainingModule } from '../types';
import { INITIAL_COURSES } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

type AcademyView = 'catalog' | 'active-course' | 'creator';

const TrainingAcademy: React.FC<{ user: EQPSUser }> = ({ user }) => {
  const [view, setView] = useState<AcademyView>('catalog');
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('eqps-academy-courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  
  const [progress, setProgress] = useState<Record<string, Record<number, 'locked' | 'unlocked' | 'passed'>>>(() => {
    const saved = localStorage.getItem('eqps-academy-progress');
    return saved ? JSON.parse(saved) : { 'c1': { 1: 'unlocked', 2: 'locked' } };
  });

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Creator State
  const [topic, setTopic] = useState('');
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('eqps-academy-courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eqps-academy-progress', JSON.stringify(progress));
  }, [progress]);

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeModule = activeCourse?.modules.find(m => m.id === activeModuleId);

  const courseProgress = activeCourseId ? progress[activeCourseId] || {} : {};
  const completedCount = Object.values(courseProgress).filter(p => p === 'passed').length;
  const courseTotalModules = activeCourse?.modules.length || 0;
  const courseCompletionPercent = courseTotalModules > 0 ? Math.round((completedCount / courseTotalModules) * 100) : 0;

  const handleEnroll = (courseId: string) => {
    setActiveCourseId(courseId);
    if (!progress[courseId]) {
      setProgress(prev => ({ ...prev, [courseId]: { 1: 'unlocked' } }));
    }
    setView('active-course');
    setActiveModuleId(null);
  };

  const handleModuleSelect = (id: number) => {
    if (courseProgress[id] === 'locked') return;
    setActiveModuleId(id);
    setExamResult(null);
    setAnswers({});
  };

  const handleSubmitExam = (mod: TrainingModule) => {
    let score = 0;
    mod.questions.forEach((q, idx) => {
      if (answers[`${mod.id}-${idx}`] === q.a) score++;
    });

    // Requisito: 70% de acerto (7 de 10)
    const passed = score >= 7;
    setExamResult({ score, passed });

    if (passed && activeCourseId) {
      setProgress(prev => {
        const courseProg = prev[activeCourseId] || {};
        const next = { ...courseProg, [mod.id]: 'passed' as const };
        if (mod.id < (activeCourse?.modules.length || 0)) {
          next[mod.id + 1] = 'unlocked' as const;
        }
        return { ...prev, [activeCourseId]: next };
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPdfData(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCourse = async () => {
    if (!topic && !pdfData) return;
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const parts: any[] = [
        {
          text: `Crie um curso corporativo industrial profissional em Português Brasileiro.
          ${topic ? `Tema principal: "${topic}".` : ''}
          ${pdfData ? `O curso deve ser baseado INTEIRAMENTE no documento PDF fornecido.` : ''}
          
          O curso deve ter EXATAMENTE 3 módulos.
          Cada módulo deve conter:
          1. Um título atraente e profissional.
          2. Conteúdo Teórico: 3 blocos de texto com títulos e explicações técnicas detalhadas.
          3. Avaliação Final: EXATAMENTE 10 questões de múltipla escolha (4 opções cada) com o índice da resposta correta (0-3). 
          
          Atenção: Garanta que as questões sejam desafiadoras mas baseadas no conteúdo apresentado.
          O tom geral deve ser técnico, industrial e altamente profissional seguindo padrões de excelência.
          Retorne o resultado estritamente em formato JSON em Português Brasileiro.`
        }
      ];

      if (pdfData) {
        parts.push({
          inlineData: {
            data: pdfData,
            mimeType: 'application/pdf'
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              totalDuration: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    content: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    },
                    questions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          q: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          a: { type: Type.INTEGER }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const generatedData = JSON.parse(response.text || '{}');
      const newCourse: Course = {
        ...generatedData,
        id: 'ai-' + Date.now(),
      };
      
      setCourses(prev => [...prev, newCourse]);
      setView('catalog');
      setTopic('');
      setPdfData(null);
      setPdfName(null);
    } catch (e) {
      console.error("Failed to generate course", e);
      alert("Falha ao gerar o curso por IA. Verifique sua conexão ou tente um tópico diferente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32">
      {/* Academy Header */}
      <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center text-slate-900 shadow-lg shadow-sky-500/20">
            <GraduationCap size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Academia Corporativa</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Planta de Extrema • Hub de Conhecimento Técnico</p>
          </div>
        </div>

        <div className="flex gap-3 relative z-10">
          <button 
            onClick={() => setView('catalog')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'catalog' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Layers size={16} /> Catálogo
          </button>
          <button 
            onClick={() => setView('creator')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'creator' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Plus size={16} /> Criar Curso (IA)
          </button>
        </div>
      </div>

      {view === 'catalog' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 bg-[#0f172a] border border-slate-800 px-8 py-5 rounded-[2.5rem] shadow-xl">
             <Search size={20} className="text-slate-500" />
             <input 
               type="text" 
               placeholder="Procurar treinamento ou competência..."
               className="bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-700 text-sm flex-1 font-medium"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => {
              const prog = progress[course.id] || {};
              const compCount = Object.values(prog).filter(p => p === 'passed').length;
              const perc = course.modules.length > 0 ? Math.round((compCount / course.modules.length) * 100) : 0;
              
              return (
                <div key={course.id} className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-8 hover:border-sky-500/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-sky-400 border border-slate-800 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                        <BookMarked size={20} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{course.category}</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed line-clamp-2">{course.description}</p>
                    
                    <div className="flex gap-6 mb-8">
                      <div className="flex items-center gap-2 text-slate-400">
                         <Clock size={14} /> <span className="text-[10px] font-bold">{course.totalDuration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <Layers size={14} /> <span className="text-[10px] font-bold">{course.modules.length} Módulos</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {perc > 0 && (
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase text-slate-600">
                           <span>Progresso</span>
                           <span>{perc}%</span>
                         </div>
                         <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${perc}%` }}></div>
                         </div>
                      </div>
                    )}
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      className="w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-sky-500 hover:text-slate-950 hover:border-sky-400 transition-all"
                    >
                      {perc > 0 ? 'Continuar Estudo' : 'Iniciar Treinamento'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'creator' && (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-[#0f172a] border border-slate-800 p-12 rounded-[4rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500"></div>
            <div className="flex justify-center">
               <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <Wand2 size={48} />
               </div>
            </div>
            <div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tight">Criação Autônoma de Cursos</h3>
               <p className="text-slate-500 mt-2 font-medium italic">Transforme qualquer documento PDF em uma jornada de aprendizado estruturada com IA.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {/* Opção 1: Texto/Tópico */}
              <div className="space-y-4 p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Gerar por Tópico</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Ex: NR-12, Liderança Lean..."
                  className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 placeholder:text-slate-700 outline-none focus:border-sky-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Opção 2: PDF Upload */}
              <div className="space-y-4 p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Gerar Baseado em PDF</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${pdfName ? 'border-sky-500 bg-sky-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  {pdfName ? (
                    <>
                      <FileCheck className="text-sky-500" size={32} />
                      <span className="text-[10px] font-black text-white truncate max-w-[200px]">{pdfName}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-slate-600" size={32} />
                      <span className="text-[10px] font-black text-slate-600 uppercase">Upload de PDF Técnico</span>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            <div className="pt-8">
              <button 
                disabled={(!topic && !pdfData) || isGenerating}
                onClick={generateCourse}
                className="w-full py-6 bg-sky-500 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-sky-400 disabled:opacity-20 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-sky-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Engatando Motor de IA...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} /> 
                    Gerar Currículo de Treinamento
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/50">
               {[
                 { label: 'Eficácia', val: '70%', icon: Zap, sub: 'Nota de Corte' },
                 { label: 'Estrutura', val: '10 Q', icon: Layers, sub: 'por Módulo' },
                 { label: 'Válido', val: 'SIM', icon: FileText, sub: 'Certificado' }
               ].map((item, i) => (
                 <div key={i} className="p-4 rounded-3xl">
                    <item.icon size={20} className="mx-auto text-slate-700 mb-2" />
                    <span className="block text-[10px] font-black text-white">{item.val}</span>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.sub}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {view === 'active-course' && activeCourse && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView('catalog')}
              className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors group"
            >
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl group-hover:border-sky-500 transition-all">
                 <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar ao Catálogo</span>
            </button>

            <div className="flex items-center gap-6 bg-[#0f172a] border border-slate-800 px-8 py-4 rounded-[2rem]">
               <div className="text-right">
                  <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Aderência Atual</span>
                  <span className="text-xl font-black text-sky-400">{courseCompletionPercent}%</span>
               </div>
               <div className="w-12 h-12 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                  <FileCheck size={20} className="text-emerald-500" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Module Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Módulos do Programa</h3>
              {activeCourse.modules.map(mod => {
                const status = courseProgress[mod.id] || 'locked';
                return (
                  <button 
                    key={mod.id}
                    onClick={() => handleModuleSelect(mod.id)}
                    className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                      activeModuleId === mod.id ? 'bg-sky-500 border-sky-400 text-slate-950 shadow-xl' :
                      status === 'passed' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
                      status === 'locked' ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed opacity-50' :
                      'bg-[#0f172a] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        activeModuleId === mod.id ? 'bg-slate-900 text-sky-400' : 'bg-slate-900'
                      }`}>
                        {mod.id}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-tight leading-none">{mod.title}</p>
                        <p className={`text-[9px] font-bold mt-1 ${activeModuleId === mod.id ? 'text-slate-800' : 'text-slate-500'}`}>
                          {mod.duration} • {mod.questions.length} Questões
                        </p>
                      </div>
                    </div>
                    {status === 'passed' ? <CheckCircle size={18} /> : status === 'locked' ? <Lock size={18} /> : <ChevronRight size={18} />}
                  </button>
                );
              })}

              <button 
                disabled={courseCompletionPercent < 100}
                onClick={() => setActiveModuleId(999)}
                className={`w-full p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                  courseCompletionPercent === 100 ? 'border-amber-500 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10' : 'border-slate-800 text-slate-700'
                }`}
              >
                 <Award size={48} className={courseCompletionPercent === 100 ? 'animate-bounce' : ''} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resgatar Certificado</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8 min-h-[600px]">
              {!activeModuleId ? (
                <div className="h-full bg-[#0f172a] border border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 text-slate-600">
                   <BookOpen size={80} strokeWidth={1} className="mb-6 opacity-20" />
                   <h3 className="text-xl font-black text-slate-300 uppercase">Portal de Estudo Técnico</h3>
                   <p className="max-w-xs text-sm mt-2">Você está matriculado em <b>{activeCourse.title}</b>. Selecione o primeiro módulo disponível para iniciar a leitura.</p>
                </div>
              ) : activeModuleId === 999 ? (
                <div className="bg-white p-16 rounded-[4rem] text-slate-900 text-center space-y-8 border-[20px] border-slate-100 shadow-2xl animate-in zoom-in-95 duration-700 print:p-0 print:border-none">
                   <div className="flex justify-center"><Award size={100} className="text-amber-500" /></div>
                   <h1 className="text-5xl font-black tracking-tighter uppercase border-b-4 border-slate-900 inline-block pb-4">Certificado de Qualificação</h1>
                   <div className="space-y-4">
                     <p className="text-lg font-medium italic">A planta industrial EQPS Extrema certifica que</p>
                     <h2 className="text-4xl font-black border-b-2 border-slate-200 inline-block px-12 py-2">{user.name}</h2>
                     <p className="text-lg font-medium">Concluiu com êxito o treinamento corporativo:</p>
                     <h3 className="text-2xl font-black text-sky-600 uppercase">{activeCourse.title}</h3>
                     <div className="flex justify-center gap-12 mt-12 text-slate-400">
                        <div className="text-center">
                          <p className="font-black text-slate-900">{activeCourse.totalDuration}</p>
                          <p className="text-[10px] uppercase font-bold">Carga Horária</p>
                        </div>
                        <div className="text-center">
                          <p className="font-black text-slate-900">{new Date().toLocaleDateString()}</p>
                          <p className="text-[10px] uppercase font-bold">Data de Emissão</p>
                        </div>
                     </div>
                   </div>
                   <div className="pt-12 flex justify-center">
                     <button onClick={() => window.print()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all print:hidden">
                       <Printer size={20} /> Salvar PDF / Imprimir
                     </button>
                   </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                  <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-[3rem] shadow-xl">
                     <div className="flex items-center justify-between mb-8">
                        <span className="px-4 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           <Clock size={12} /> {activeModule?.duration} de Leitura
                        </span>
                        <h2 className="text-2xl font-black text-white uppercase">{activeModule?.title}</h2>
                     </div>

                     <div className="space-y-10">
                        {activeModule?.content.map((c, i) => (
                          <div key={i} className="space-y-3">
                            <h4 className="text-sky-400 font-black flex items-center gap-2">
                               <BookOpen size={16} /> {c.title}
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-sm font-medium">{c.text}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Exam Section */}
                  <div className="bg-[#020617] border border-amber-500/30 p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 left-10 -translate-y-1/2 bg-amber-500 text-slate-950 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Exame de Proficiência (Módulo {activeModuleId})
                    </div>
                    
                    <div className="space-y-10 mt-6">
                       {activeModule?.questions.map((q, qIdx) => (
                         <div key={qIdx} className="space-y-4">
                            <p className="text-white font-black text-lg flex items-start gap-4">
                               <span className="text-amber-500 opacity-50 font-mono">{String(qIdx + 1).padStart(2, '0')}.</span> {q.q}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {q.options.map((opt, optIdx) => (
                                 <button 
                                   key={optIdx}
                                   onClick={() => setAnswers(prev => ({ ...prev, [`${activeModule.id}-${qIdx}`]: optIdx }))}
                                   className={`p-4 rounded-2xl text-left text-xs font-bold transition-all border ${
                                     answers[`${activeModule.id}-${qIdx}`] === optIdx ? 'bg-sky-500 border-sky-400 text-slate-950 shadow-lg shadow-sky-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                   }`}
                                 >
                                   <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${answers[`${activeModule.id}-${qIdx}`] === optIdx ? 'bg-slate-900 border-sky-400 text-sky-400' : 'border-slate-700 text-slate-700'}`}>
                                        {String.fromCharCode(65 + optIdx)}
                                      </div>
                                      {opt}
                                   </div>
                                 </button>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-10">
                       {examResult ? (
                          <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border ${examResult.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                             {examResult.passed ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                             <div>
                                <p className="font-black uppercase text-xs">{examResult.passed ? 'Aprovado com Sucesso!' : 'Reprovado'}</p>
                                <p className="text-[10px] font-bold">Nota Final: {examResult.score}/{activeModule?.questions.length} {examResult.passed ? '(Meta Atingida)' : '(Mínimo 7/10)'}</p>
                             </div>
                          </div>
                       ) : (
                          <div className="flex items-center gap-3 text-slate-600">
                             <ShieldCheck size={20} />
                             <p className="text-[10px] font-black uppercase tracking-widest italic">Aprovação: Mínimo 70% (7 acertos)</p>
                          </div>
                       )}

                       <button 
                        disabled={Object.keys(answers).length < (activeModule?.questions.length || 0)}
                        onClick={() => activeModule && handleSubmitExam(activeModule)}
                        className="px-12 py-4 bg-sky-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all disabled:opacity-20 shadow-xl shadow-sky-500/10"
                       >
                         Submeter Avaliação
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingAcademy;
