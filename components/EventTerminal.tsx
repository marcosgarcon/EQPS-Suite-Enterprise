
import React, { useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, ShieldCheck, Activity } from 'lucide-react';
import { TelemetryEvent } from '../types';

interface EventTerminalProps {
  events: TelemetryEvent[];
  isOpen: boolean;
  onClose: () => void;
}

const EventTerminal: React.FC<EventTerminalProps> = ({ events, isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[500px] bg-[#020617]/95 backdrop-blur-md border border-slate-800 rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <TerminalIcon size={18} className="text-emerald-500" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Event Telemetry Logs</h3>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {events.map((ev) => (
          <div key={ev.id} className="font-mono text-[11px] border-l border-slate-800 pl-4 py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-600">[{ev.timestamp}]</span>
              <span className={`font-black uppercase tracking-widest ${
                ev.type === 'AI_SEARCH' ? 'text-sky-400' : 
                ev.type === 'ERROR' ? 'text-rose-500' : 
                ev.type === 'SYNC' ? 'text-emerald-500' : 'text-indigo-400'
              }`}>{ev.type}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{ev.message}</p>
          </div>
        ))}
        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700">
            <Activity className="mb-4 opacity-20" size={48} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Aguardando eventos...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-emerald-500/5 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">System Secure & Online</span>
         </div>
         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Port: 8080</span>
      </div>
    </div>
  );
};

export default EventTerminal;
