import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  Settings2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Trash2,
  MessageSquare,
  Paperclip,
  ListTodo,
  History,
  ExternalLink,
  X,
  Edit,
  Save,
  Trash,
  ChevronLeft,
  Play
} from 'lucide-react';
import { ModuleId, Task, Board, ProjectDoc, Training, Workspace, Project, Subtask, Comment, Attachment } from '../types';
import { useTasks } from '../src/context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectManagementProps {
  activeModule: ModuleId;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({ activeModule }) => {
  const { 
    tasks, 
    boards, 
    docs, 
    trainings, 
    workspaces, 
    projects, 
    isLoading,
    addWorkspace,
    addProject,
    addTask
  } = useTasks();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(workspaces[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.find(p => p.workspaceId === selectedWorkspaceId)?.id || '');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const filteredProjects = projects.filter(p => p.workspaceId === selectedWorkspaceId);

  const handleWorkspaceChange = (id: string) => {
    setSelectedWorkspaceId(id);
    const firstProject = projects.find(p => p.workspaceId === id);
    setSelectedProjectId(firstProject?.id || '');
  };

  const handleNewClick = () => {
    if (activeModule === ModuleId.PROJETOS_QUADROS || activeModule === ModuleId.PROJETOS_TAREFAS) {
      if (!selectedProjectId) {
        setIsProjectModalOpen(true);
      } else {
        setIsTaskModalOpen(true);
      }
    } else {
      setIsProjectModalOpen(true);
    }
  };

  const renderContent = () => {
    if (!selectedProjectId && activeModule !== ModuleId.PROJETOS_CONFIG && activeModule !== ModuleId.PROJETOS_TREINAMENTOS) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700">Nenhum projeto selecionado</h3>
          <p className="text-slate-500 max-w-xs mt-1">Selecione um projeto ou crie um novo para começar.</p>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Criar Projeto
          </button>
        </div>
      );
    }
    switch (activeModule) {
      case ModuleId.PROJETOS_DASHBOARD:
        return <DashboardView tasks={tasks.filter(t => t.projectId === selectedProjectId)} boards={boards.filter(b => b.projectId === selectedProjectId)} />;
      case ModuleId.PROJETOS_QUADROS:
        return <BoardsView boards={boards.filter(b => b.projectId === selectedProjectId)} tasks={tasks.filter(t => t.projectId === selectedProjectId)} onTaskClick={setSelectedTask} />;
      case ModuleId.PROJETOS_TAREFAS:
        return <TasksView tasks={tasks.filter(t => t.projectId === selectedProjectId)} onTaskClick={setSelectedTask} />;
      case ModuleId.PROJETOS_CALENDARIO:
        return <CalendarView tasks={tasks.filter(t => t.projectId === selectedProjectId)} onTaskClick={setSelectedTask} />;
      case ModuleId.PROJETOS_TIMELINE:
        return <TimelineView tasks={tasks.filter(t => t.projectId === selectedProjectId)} onTaskClick={setSelectedTask} />;
      case ModuleId.PROJETOS_DOCS:
        return <DocsView docs={docs} />;
      case ModuleId.PROJETOS_TREINAMENTOS:
        return <TrainingsView trainings={trainings} />;
      case ModuleId.PROJETOS_CONFIG:
        return <SettingsView />;
      default:
        return <DashboardView tasks={tasks.filter(t => t.projectId === selectedProjectId)} boards={boards.filter(b => b.projectId === selectedProjectId)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {activeModule === ModuleId.PROJETOS_DASHBOARD && 'Dashboard'}
              {activeModule === ModuleId.PROJETOS_QUADROS && 'Quadros'}
              {activeModule === ModuleId.PROJETOS_TAREFAS && 'Tarefas'}
              {activeModule === ModuleId.PROJETOS_DOCS && 'Documentos'}
              {activeModule === ModuleId.PROJETOS_TREINAMENTOS && 'Treinamentos'}
              {activeModule === ModuleId.PROJETOS_CONFIG && 'Configurações'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <select 
                value={selectedWorkspaceId}
                onChange={(e) => handleWorkspaceChange(e.target.value)}
                className="text-xs font-medium text-slate-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                <option value="" disabled>Selecionar Workspace</option>
                {workspaces.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium text-slate-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                <option value="" disabled>Selecionar Projeto</option>
                {filteredProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNewClick}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule + selectedProjectId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}

      {isTaskModalOpen && (
        <NewTaskModal 
          projectId={selectedProjectId}
          workspaceId={selectedWorkspaceId}
          onClose={() => setIsTaskModalOpen(false)} 
        />
      )}

      {isProjectModalOpen && (
        <NewProjectModal 
          workspaceId={selectedWorkspaceId}
          onClose={() => setIsProjectModalOpen(false)} 
        />
      )}
    </div>
  );
};

// --- Sub-Views ---

const DashboardView: React.FC<{ tasks: Task[], boards: Board[] }> = ({ tasks, boards }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de Tarefas" value={stats.total} icon={ClipboardList} color="indigo" />
        <StatCard title="Concluídas" value={stats.completed} icon={CheckCircle2} color="emerald" />
        <StatCard title="Pendentes" value={stats.pending} icon={Clock} color="amber" />
        <StatCard title="Atrasadas" value={stats.overdue} icon={AlertCircle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Tarefas Recentes</h3>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-rose-500' : 
                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.status}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem data'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Quadros Ativos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boards.slice(0, 4).map(board => (
              <div key={board.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                <h4 className="font-medium text-slate-700 group-hover:text-indigo-600">{board.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{board.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {board.columns.length} Colunas
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BoardsView: React.FC<{ boards: Board[], tasks: Task[], onTaskClick: (task: Task) => void }> = ({ boards, tasks, onTaskClick }) => {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(boards[0] || null);

  // Update selected board if boards list changes (e.g. project switch)
  React.useEffect(() => {
    if (boards.length > 0 && (!selectedBoard || !boards.find(b => b.id === selectedBoard.id))) {
      setSelectedBoard(boards[0]);
    }
  }, [boards]);

  if (!selectedBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700">Nenhum quadro encontrado</h3>
        <p className="text-slate-500 max-w-xs mt-1">Crie seu primeiro quadro para começar a organizar suas tarefas.</p>
        <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Criar Quadro
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select 
            value={selectedBoard.id}
            onChange={(e) => setSelectedBoard(boards.find(b => b.id === e.target.value) || null)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                U{i}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {selectedBoard.columns.map(column => (
            <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-700">{column.title}</h4>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {tasks
                  .filter(t => t.status === column.id)
                  .map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onTaskClick(task)}
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</h5>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-rose-500" title="Alta Prioridade" />}
                          {task.priority === 'medium' && <span className="w-2 h-2 rounded-full bg-amber-500" title="Média Prioridade" />}
                          {task.priority === 'low' && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Baixa Prioridade" />}
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'S/D'}
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                          {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : '??'}
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

const TasksView: React.FC<{ tasks: Task[], onTaskClick: (task: Task) => void }> = ({ tasks, onTaskClick }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarefa</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Responsável</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prazo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map(task => (
              <tr 
                key={task.id} 
                onClick={() => onTaskClick(task)}
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
              >
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
                      <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
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
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : '--'}
                    </div>
                    <span className="text-sm text-slate-600">{task.assigneeName || 'Não atribuído'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem prazo'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DocsView: React.FC<{ docs: ProjectDoc[] }> = ({ docs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {docs.map(doc => (
        <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
            <FileText className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
          <p className="text-sm text-slate-500 line-clamp-3 mb-4">{doc.content}</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                {doc.authorId ? doc.authorId.substring(0, 2).toUpperCase() : '??'}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(doc.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-1">
              {doc.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <button className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all min-h-[200px]">
        <Plus className="w-8 h-8 mb-2" />
        <span className="font-medium">Novo Documento</span>
      </button>
    </div>
  );
};

const TrainingsView: React.FC<{ trainings: Training[] }> = ({ trainings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainings.map(training => (
        <div key={training.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
          <div className="h-40 bg-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                {training.category}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 text-indigo-600 fill-indigo-600" />
              </div>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{training.title}</h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{training.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{training.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{training.content.length} módulos</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all min-h-[300px]">
        <Plus className="w-8 h-8 mb-2" />
        <span className="font-medium">Novo Treinamento</span>
      </button>
    </div>
  );
};

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          Configurações do Setor de Projetos
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Setor</label>
              <input type="text" defaultValue="Gestão de Projetos" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Responsável Padrão</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Ricardo Silva</option>
                <option>Ana Paula</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Notificações</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm text-slate-600">Notificar sobre novas tarefas atribuídas</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm text-slate-600">Alertar sobre prazos próximos (24h)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm text-slate-600">Resumo semanal de progresso por e-mail</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all font-medium">
              Cancelar
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Task Detail Modal ---

const TaskDetailModal: React.FC<{ task: Task, onClose: () => void }> = ({ task, onClose }) => {
  const { updateTask, startTimer, stopTimer, addComment, addSubtask, toggleSubtask } = useTasks();
  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'subtasks' | 'comments' | 'attachments'>('details');

  const handleStartTimer = () => {
    startTimer(task.id);
  };

  const handleStopTimer = () => {
    stopTimer(task.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle);
    setNewSubtaskTitle('');
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              task.priority === 'urgent' ? 'bg-rose-100 text-rose-600' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
              task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{task.title}</h2>
              <p className="text-xs text-slate-500">ID: {task.id.substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={task.isTimerRunning ? handleStopTimer : handleStartTimer}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                task.isTimerRunning 
                  ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
              }`}
            >
              {task.isTimerRunning ? (
                <>
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Parar Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Iniciar Timer</span>
                </>
              )}
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-slate-100 flex gap-6">
          {[
            { id: 'details', label: 'Detalhes', icon: FileText },
            { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
            { id: 'subtasks', label: 'Subtarefas', icon: ListTodo },
            { id: 'comments', label: 'Comentários', icon: MessageSquare },
            { id: 'attachments', label: 'Anexos', icon: Paperclip },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Descrição</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {task.description || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempo Estimado</p>
                    <p className="text-lg font-semibold text-slate-700">{task.estimatedHours ? `${task.estimatedHours}h` : '--'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempo Real</p>
                    <p className="text-lg font-semibold text-indigo-600">{formatTime(task.actualHours || 0)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Etapa da Produção</h3>
                  <div className="flex gap-2">
                    {['corte', 'montagem', 'acabamento', 'entrega'].map(stage => (
                      <button
                        key={stage}
                        onClick={() => updateTask(task.id, { productionStage: stage as any })}
                        className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                          task.productionStage === stage
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                    <select 
                      value={task.status}
                      onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="todo">A Fazer</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="review">Revisão</option>
                      <option value="done">Concluído</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prioridade</label>
                    <select 
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, { priority: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Responsável</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : '??'}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{task.assigneeName || 'Não atribuído'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prazo</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem prazo'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800">Checklist da Tarefa</h3>
                <span className="text-xs text-slate-500">
                  {task.checklist.filter(i => i.completed).length} de {task.checklist.length} concluídos
                </span>
              </div>
              <div className="space-y-2">
                {task.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all group">
                    <button 
                      onClick={() => {
                        const newChecklist = task.checklist.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i);
                        updateTask(task.id, { checklist: newChecklist });
                      }}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent group-hover:border-indigo-500'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <input 
                    type="text" 
                    placeholder="Adicionar item ao checklist..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const text = (e.target as HTMLInputElement).value;
                        if (text.trim()) {
                          const newItem = { id: Math.random().toString(36).substr(2, 9), text, completed: false };
                          updateTask(task.id, { checklist: [...task.checklist, newItem] });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-6">
                {/* Comments would be fetched here, using task.id */}
                <div className="flex items-center justify-center h-32 text-slate-400 text-sm italic">
                  Nenhum comentário ainda. Comece a conversa!
                </div>
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva um comentário..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Enviar
                </button>
              </form>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Upload de Arquivo</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CalendarView: React.FC<{ tasks: Task[], onTaskClick: (task: Task) => void }> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 capitalize">{monthName} {year}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            Hoje
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-7 auto-rows-fr border-b border-slate-100">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100 last:border-r-0 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
        {padding.map(i => (
          <div key={`pad-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30" />
        ))}
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
          
          return (
            <div key={day} className={`border-r border-b border-slate-100 p-2 min-h-[120px] hover:bg-slate-50/50 transition-colors ${isToday ? 'bg-indigo-50/20' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-semibold ${isToday ? 'w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center' : 'text-slate-500'}`}>
                  {day}
                </span>
              </div>
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className={`px-2 py-1 rounded text-[10px] font-medium truncate cursor-pointer transition-all ${
                      task.priority === 'urgent' ? 'bg-rose-100 text-rose-700 border-l-2 border-rose-500' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700 border-l-2 border-orange-500' :
                      'bg-indigo-100 text-indigo-700 border-l-2 border-indigo-500'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimelineView: React.FC<{ tasks: Task[], onTaskClick: (task: Task) => void }> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get 30 days from current date
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getTaskPosition = (task: Task) => {
    if (!task.startDate || !task.deadline) return null;
    
    const start = new Date(task.startDate);
    const end = new Date(task.deadline);
    
    const timelineStart = days[0];
    const timelineEnd = days[days.length - 1];
    
    if (end < timelineStart || start > timelineEnd) return null;
    
    const totalDays = 30;
    const startOffset = Math.max(0, Math.floor((start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return { left: `${left}%`, width: `${Math.min(width, 100 - left)}%` };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Cronograma (Gantt)</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            Hoje
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="w-64 shrink-0 px-6 py-3 border-r border-slate-100 font-semibold text-xs text-slate-500 uppercase tracking-wider">
              Tarefa
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => (
                <div key={i} className={`flex-1 min-w-[40px] border-r border-slate-50 py-2 text-center ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-slate-50/50' : ''}`}>
                  <div className="text-[10px] text-slate-400 uppercase">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                  <div className={`text-xs font-bold ${day.toDateString() === new Date().toDateString() ? 'text-indigo-600' : 'text-slate-600'}`}>{day.getDate()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Body */}
          <div className="divide-y divide-slate-100">
            {tasks.map(task => {
              const pos = getTaskPosition(task);
              return (
                <div key={task.id} className="flex hover:bg-slate-50/50 transition-colors group">
                  <div className="w-64 shrink-0 px-6 py-4 border-r border-slate-100 flex flex-col justify-center">
                    <span className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors" title={task.title}>
                      {task.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{task.assigneeName || 'Sem responsável'}</span>
                  </div>
                  <div className="flex-1 relative h-14 flex items-center px-1">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map((day, i) => (
                        <div key={i} className={`flex-1 border-r border-slate-50/50 ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-slate-50/20' : ''}`} />
                      ))}
                    </div>
                    
                    {/* Task Bar */}
                    {pos && (
                      <div 
                        onClick={() => onTaskClick(task)}
                        style={{ left: pos.left, width: pos.width }}
                        className={`absolute h-8 rounded-lg shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex items-center px-3 overflow-hidden ${
                          task.priority === 'urgent' ? 'bg-rose-500 text-white' :
                          task.priority === 'high' ? 'bg-orange-500 text-white' :
                          task.status === 'done' ? 'bg-emerald-500 text-white' :
                          'bg-indigo-500 text-white'
                        }`}
                      >
                        <span className="text-[10px] font-bold truncate">{task.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- New Project Modal ---

const NewProjectModal: React.FC<{ workspaceId: string, onClose: () => void }> = ({ workspaceId, onClose }) => {
  const { addProject } = useTasks();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name,
      description,
      workspaceId,
      deadline,
      status: 'active',
      ownerId: 'current-user-id', // Placeholder, should be the logged-in user's ID
      members: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Novo Projeto</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Projeto</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Reforma Cozinha João"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do projeto..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prazo Final</label>
            <input 
              type="date" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
              Criar Projeto
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- New Task Modal ---

const NewTaskModal: React.FC<{ projectId: string, workspaceId: string, onClose: () => void }> = ({ projectId, workspaceId, onClose }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      description,
      projectId,
      workspaceId,
      priority,
      startDate,
      deadline,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      status: 'todo',
      reporterId: 'current-user-id', // Placeholder, should be the logged-in user's ID
      checklist: [],
      tags: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Nova Tarefa</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título da Tarefa</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mais detalhes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tempo Est. (h)</label>
              <input 
                type="number" 
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="Ex: 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prazo Final</label>
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
              Criar Tarefa
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Helper Components ---

const StatCard: React.FC<{ title: string, value: number, icon: any, color: 'indigo' | 'emerald' | 'amber' | 'rose' }> = ({ title, value, icon: Icon, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div className={`p-6 rounded-xl border shadow-sm bg-white ${colors[color].split(' ')[2]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
    </div>
  );
};
