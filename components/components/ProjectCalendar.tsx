import React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';

const ProjectCalendar: React.FC = () => {
  const days = Array.from({ length: 35 }, (_, i) => i - 4); // Simple mock calendar grid
  const monthName = "Março 2026";

  const events = [
    { day: 10, title: 'Setup Produção', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { day: 15, title: 'Kickoff ERP', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { day: 18, title: 'Review Design', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { day: 20, title: 'Entrega Escopo', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { day: 25, title: 'Pesquisa Logística', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button className="p-2 hover:bg-slate-50 transition-colors border-r border-slate-200">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Hoje
            </button>
            <button className="p-2 hover:bg-slate-50 transition-colors border-l border-slate-200">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-slate-800">{monthName}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-md">Mês</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-md">Semana</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-md">Dia</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-md">Agenda</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid Cells */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, idx) => {
            const isCurrentMonth = day > 0 && day <= 31;
            const dayEvents = events.filter(e => e.day === day);
            
            return (
              <div 
                key={idx} 
                className={`min-h-[120px] p-2 border-r border-b border-slate-50 last:border-r-0 flex flex-col gap-1 hover:bg-slate-50/50 transition-colors ${
                  !isCurrentMonth ? 'bg-slate-50/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${
                    day === 18 ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 
                    isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {day > 0 ? (day > 31 ? day - 31 : day) : 28 + day}
                  </span>
                  {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayEvents.map((event, eIdx) => (
                    <div 
                      key={eIdx} 
                      className={`px-2 py-1 rounded text-[10px] font-bold border truncate cursor-pointer hover:brightness-95 transition-all ${event.color}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;
