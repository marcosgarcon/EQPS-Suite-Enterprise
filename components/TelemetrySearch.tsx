
import React, { useState } from 'react';
import { Search, Sparkles, X, Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TelemetrySearchProps {
  onEvent: (type: 'AI_SEARCH' | 'NAV' | 'ERROR' | 'SYNC', msg: string) => void;
}

const TelemetrySearch: React.FC<TelemetrySearchProps> = ({ onEvent }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    onEvent('AI_SEARCH', `Query Telemetria: "${query}"`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é o Telemetry Engine do sistema industrial EQPS da Panasonic. 
        Contexto: Fábrica de Lavadoras e Refrigeradores em Extrema. 
        Usuário pergunta: ${query}. 
        Responda em Português Brasileiro de forma técnica, curta e profissional.`
      });
      
      setAnswer(response.text || "Sem resposta do motor de telemetria.");
    } catch (error) {
      onEvent('ERROR', "Falha ao consultar motor de IA");
      setAnswer("Ocorreu um erro técnico na telemetria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-12 relative">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-sky-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
        <div className="relative flex items-center bg-[#020617] border border-slate-800 rounded-2xl px-5 py-3 gap-4 focus-within:border-sky-500/50 transition-all">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Perguntar ao Telemetry Engine (IA)..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-600 font-medium"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading ? (
            <Sparkles size={18} className="text-sky-400 animate-spin" />
          ) : (
            <button type="submit" className="text-slate-500 hover:text-sky-400 transition-colors">
              <Send size={18} />
            </button>
          )}
        </div>
      </form>

      {answer && (
        <div className="absolute top-full left-0 w-full mt-4 bg-[#0f172a] border border-sky-500/30 p-6 rounded-3xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} /> Insight da Telemetria
             </span>
             <button onClick={() => setAnswer(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">{answer}</p>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
             <button className="text-[10px] font-black text-slate-500 uppercase hover:text-sky-400 transition-colors">Ver Telemetria Completa</button>
             <button className="text-[10px] font-black text-slate-500 uppercase hover:text-sky-400 transition-colors">Gerar Relatório POP</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetrySearch;
