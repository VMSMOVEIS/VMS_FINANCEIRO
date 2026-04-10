import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Users,
  Layout
} from 'lucide-react';

const ProjectBoards: React.FC = () => {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'A Fazer',
      tasks: [
        { id: '1', title: 'Definir escopo do projeto ERP', description: 'Reunião com stakeholders para alinhar expectativas.', priority: 'high', comments: 3, attachments: 2, assignee: 'RS', deadline: '20/03' },
        { id: '2', title: 'Pesquisa de mercado - Logística', description: 'Analise de concorrentes e novas tecnologias.', priority: 'medium', comments: 0, attachments: 1, assignee: 'AP', deadline: '25/03' },
      ]
    },
    {
      id: 'in-progress',
      title: 'Em Andamento',
      tasks: [
        { id: '3', title: 'Desenvolvimento do Módulo Financeiro', description: 'Implementação das APIs de fluxo de caixa.', priority: 'high', comments: 12, attachments: 5, assignee: 'CE', deadline: '15/04' },
        { id: '4', title: 'Design da Interface - Dashboard', description: 'Criação dos mockups em alta fidelidade.', priority: 'medium', comments: 8, attachments: 3, assignee: 'JC', deadline: '10/04' },
      ]
    },
    {
      id: 'review',
      title: 'Em Revisão',
      tasks: [
        { id: '5', title: 'Testes de Integração - RH', description: 'Validar sincronização de dados de funcionários.', priority: 'low', comments: 4, attachments: 1, assignee: 'RS', deadline: '05/04' },
      ]
    },
    {
      id: 'done',
      title: 'Concluído',
      tasks: [
        { id: '6', title: 'Setup do Ambiente de Produção', description: 'Configuração dos servidores e CI/CD.', priority: 'high', comments: 2, attachments: 0, assignee: 'AP', deadline: '10/03' },
        { id: '7', title: 'Treinamento Inicial da Equipe', description: 'Apresentação das ferramentas e processos.', priority: 'medium', comments: 1, attachments: 1, assignee: 'CE', deadline: '12/03' },
      ]
    }
  ]);

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {['RS', 'AP', 'CE', 'JC'].map((initials, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                {initials}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>4 Membros Ativos</span>
          </div>
        </div>
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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map(column => (
            <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-700">{column.title}</h4>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {column.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</h5>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MessageSquare className="w-3 h-3" />
                          {task.comments}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Paperclip className="w-3 h-3" />
                          {task.attachments}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {task.deadline}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-rose-500' : 
                          task.priority === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`} />
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                          {task.assignee}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Tarefa</span>
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-80 h-12 shrink-0 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>Adicionar Coluna</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoards;
