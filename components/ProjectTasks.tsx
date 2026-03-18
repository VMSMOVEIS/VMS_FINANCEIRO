import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ListTodo,
  CheckCircle,
  Play,
  History
} from 'lucide-react';

const ProjectTasks: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Definir escopo do projeto ERP', status: 'done', priority: 'high', assignee: 'Ricardo Silva', deadline: '20/03/2026', progress: 100 },
    { id: '2', title: 'Pesquisa de mercado - Logística', status: 'todo', priority: 'medium', assignee: 'Ana Paula', deadline: '25/03/2026', progress: 0 },
    { id: '3', title: 'Desenvolvimento do Módulo Financeiro', status: 'in_progress', priority: 'high', assignee: 'Carlos Eduardo', deadline: '15/04/2026', progress: 45 },
    { id: '4', title: 'Design da Interface - Dashboard', status: 'in_progress', priority: 'medium', assignee: 'Juliana Costa', deadline: '10/04/2026', progress: 70 },
    { id: '5', title: 'Testes de Integração - RH', status: 'todo', priority: 'low', assignee: 'Ricardo Silva', deadline: '05/04/2026', progress: 0 },
    { id: '6', title: 'Setup do Ambiente de Produção', status: 'done', priority: 'high', assignee: 'Ana Paula', deadline: '10/03/2026', progress: 100 },
    { id: '7', title: 'Treinamento Inicial da Equipe', status: 'done', priority: 'medium', assignee: 'Carlos Eduardo', deadline: '12/03/2026', progress: 100 },
  ]);

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar tarefas..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">Todas</button>
            <button className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider">Minhas</button>
            <button className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider">Atrasadas</button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarefa</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prazo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-500'
                      }`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: {task.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status === 'done' ? 'Concluído' :
                       task.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      task.priority === 'high' ? 'text-rose-600' :
                      task.priority === 'medium' ? 'text-amber-600' : 'text-indigo-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === 'high' ? 'bg-rose-500' :
                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      {task.priority === 'high' ? 'Alta' :
                       task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-slate-600">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className={`h-full rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {task.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;
