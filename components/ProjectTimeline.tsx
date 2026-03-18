import React from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layout
} from 'lucide-react';

const ProjectTimeline: React.FC = () => {
  const projects = [
    { id: '1', name: 'Expansão Fábrica Sul', start: '01/03', end: '20/04', progress: 75, status: 'Em Execução', color: 'bg-indigo-500' },
    { id: '2', name: 'Novo ERP VMS', start: '15/03', end: '15/06', progress: 30, status: 'Em Planejamento', color: 'bg-emerald-500' },
    { id: '3', name: 'Otimização Logística', start: '05/03', end: '05/04', progress: 95, status: 'Em Revisão', color: 'bg-amber-500' },
    { id: '4', name: 'Campanha Marketing Q2', start: '20/03', end: '30/05', progress: 15, status: 'Em Execução', color: 'bg-rose-500' },
  ];

  const months = ['Março', 'Abril', 'Maio', 'Junho'];
  const weeks = Array.from({ length: 16 }, (_, i) => `S${(i % 4) + 1}`);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Timeline Header */}
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
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Março 2026 - Junho 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-md">Dia</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-md">Semana</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-md">Mês</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Timeline Header (Months and Weeks) */}
        <div className="flex border-b border-slate-200">
          <div className="w-64 border-r border-slate-200 bg-slate-50/50 p-4 shrink-0 font-bold text-xs text-slate-500 uppercase tracking-widest">
            Projetos
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex border-b border-slate-100">
              {months.map(month => (
                <div key={month} className="flex-1 min-w-[200px] py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
                  {month}
                </div>
              ))}
            </div>
            <div className="flex">
              {weeks.map((week, idx) => (
                <div key={idx} className="flex-1 min-w-[50px] py-1 text-center text-[8px] font-bold text-slate-300 border-r border-slate-50 last:border-r-0">
                  {week}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto">
          {projects.map((project, pIdx) => (
            <div key={project.id} className="flex border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
              <div className="w-64 border-r border-slate-200 p-4 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h4>
                  <button className="p-1 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{project.start} - {project.end}</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
              <div className="flex-1 relative p-4 flex items-center">
                {/* Timeline Bar */}
                <div 
                  className={`h-6 rounded-full ${project.color} relative group/bar cursor-pointer shadow-sm hover:shadow-md transition-all`}
                  style={{ 
                    width: `${project.progress}%`, 
                    marginLeft: `${pIdx * 10}%` // Mock positioning
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {project.name}: {project.progress}% concluído
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
