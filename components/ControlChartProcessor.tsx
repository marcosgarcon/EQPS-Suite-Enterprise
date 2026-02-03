
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  Upload, 
  Check, 
  X, 
  AlertCircle,
  Camera,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  Loader2,
  Sparkles,
  Save
} from 'lucide-react';
import { extractMeasurementPoints, aiValidateMeasurements } from '../services/gemini';
import { MOCK_MEASUREMENTS } from '../constants';
import { MeasurementPoint, NavigationState } from '../types';

interface ControlChartProcessorProps {
  nav: NavigationState;
  onSaveInspection?: (data: any) => void;
}

const ControlChartProcessor: React.FC<ControlChartProcessorProps> = ({ nav, onSaveInspection }) => {
  const [processing, setProcessing] = useState(false);
  const [validatingAI, setValidatingAI] = useState(false);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'VALIDATING' | 'COMPLETED'>('IDLE');
  const [overallStatus, setOverallStatus] = useState<'PENDENTE' | 'APROVADO' | 'REPROVADO'>('PENDENTE');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MeasurementPoint | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Zoom/Pan
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (nav.model && MOCK_MEASUREMENTS[nav.model]) {
      setPoints(MOCK_MEASUREMENTS[nav.model]);
      setStatus('VALIDATING');
      setIsSaved(false);
    } else {
      setPoints([]);
      setStatus('IDLE');
    }
  }, [nav.model]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('PROCESSING');
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const extracted = await extractMeasurementPoints(base64);
      setPoints(extracted);
      setStatus('VALIDATING');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleMeasurementChange = (id: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    setPoints(prev => prev.map(p => p.id === id ? { ...p, measured: isNaN(numValue) ? undefined : numValue } : p));
  };

  const handleValidate = async () => {
    if (points.some(p => p.measured === undefined)) {
      alert("Insira todos os valores medidos.");
      return;
    }
    setValidatingAI(true);
    try {
      const { points: validatedPoints, overall, analysis } = await aiValidateMeasurements(points);
      setPoints(validatedPoints);
      setOverallStatus(overall);
      setAiAnalysis(analysis);
      setStatus('COMPLETED');
    } catch (e) { console.error(e); }
    setValidatingAI(false);
  };

  const handleSaveToHistory = () => {
    if (onSaveInspection) {
      onSaveInspection({
        model: nav.model,
        date: new Date().toISOString(),
        overall: overallStatus,
        analysis: aiAnalysis,
        points: points
      });
      setIsSaved(true);
      alert("Laudo de inspeção dimensional salvo no banco de dados EQPS.");
    }
  };

  // Zoom Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {selectedPoint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] overflow-hidden max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ImageIcon size={24} className="text-sky-400" />
                <h3 className="text-xl font-black text-white uppercase">{selectedPoint.label}</h3>
              </div>
              <button onClick={() => setSelectedPoint(null)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div 
              className={`flex-1 relative overflow-hidden cursor-move ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)}
            >
              <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${zoom}) translate(${position.x/zoom}px, ${position.y/zoom}px)` }}>
                <img src={selectedPoint.imageUrl} className="max-w-full max-h-full object-contain pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><ShieldCheck size={28} /></div>
              <div><h3 className="text-xl font-black text-slate-800">Modelo: {nav.model || 'Geral'}</h3><p className="text-xs text-slate-500 font-bold uppercase">Laboratório de Metrologia IA</p></div>
           </div>
           <div className="flex gap-3">
              <button onClick={() => document.getElementById('cqIn')?.click()} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-slate-200 transition-all"><Upload size={14} /> Importar PDF</button>
              <input id="cqIn" type="file" className="hidden" onChange={handleFileUpload} />
           </div>
        </div>
      </div>

      {(status === 'VALIDATING' || status === 'COMPLETED') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Pontos de Controle Dimensional</h4>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                       <tr><th className="px-6 py-4">Ponto</th><th className="px-6 py-4">Evidência</th><th className="px-6 py-4">Nominal</th><th className="px-6 py-4">Medido</th><th className="px-6 py-4 text-right">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {points.map(p => (
                          <tr key={p.id} className="hover:bg-blue-50/30">
                             <td className="px-6 py-4 font-black text-slate-800 text-sm">{p.id}</td>
                             <td className="px-6 py-4">
                                {p.imageUrl && <button onClick={() => setSelectedPoint(p)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-sky-500 hover:text-white"><ImageIcon size={16} /></button>}
                             </td>
                             <td className="px-6 py-4 font-mono font-bold text-slate-600">{p.nominal.toFixed(2)}</td>
                             <td className="px-6 py-4">
                                <input type="number" step="0.01" className="w-20 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-center outline-none" value={p.measured ?? ''} onChange={(e) => handleMeasurementChange(p.id, e.target.value)} />
                             </td>
                             <td className="px-6 py-4 text-right">
                                {p.status === 'APROVADO' ? <Check size={18} className="text-emerald-500 ml-auto" /> : p.status === 'REPROVADO' ? <X size={18} className="text-rose-500 ml-auto" /> : <Clock size={18} className="text-slate-300 ml-auto" />}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button onClick={handleValidate} disabled={validatingAI} className="px-10 py-4 bg-sky-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20">
                    {validatingAI ? 'IA Analisando...' : 'Validar Cotes de Engenharia'}
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[400px]">
                 <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6 ${overallStatus === 'APROVADO' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : overallStatus === 'REPROVADO' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-slate-800 text-slate-700'}`}>
                    {overallStatus === 'APROVADO' ? <CheckCircle2 size={64} /> : overallStatus === 'REPROVADO' ? <XCircle size={64} /> : <Clock size={48} />}
                 </div>
                 <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{overallStatus}</h4>
                 <p className="text-[10px] font-black text-slate-500 uppercase mt-2">Veredito Dimensional v5.0</p>
                 
                 {aiAnalysis && (
                    <div className="mt-8 p-4 bg-sky-500/5 border border-sky-500/20 rounded-2xl animate-in zoom-in-95">
                       <p className="text-[11px] text-slate-300 italic leading-relaxed">"{aiAnalysis}"</p>
                    </div>
                 )}

                 {status === 'COMPLETED' && (
                    <button onClick={handleSaveToHistory} disabled={isSaved} className={`mt-8 w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isSaved ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                       {isSaved ? 'Laudo Arquivado' : 'Arquivar Laudo Industrial'}
                    </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ControlChartProcessor;
