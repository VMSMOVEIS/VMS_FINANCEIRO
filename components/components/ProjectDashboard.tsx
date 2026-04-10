import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const ProjectDashboard: React.FC = () => {
  const stats = [
    { title: 'Projetos Ativos', value: '12', change: '+2', trend: 'up', icon: LayoutDashboard, color: 'indigo' },
    { title: 'Tarefas Concluídas', value: '145', change: '+12%', trend: 'up', icon: CheckCircle2, color: 'emerald' },
    { title: 'Horas Lançadas', value: '1.240h', change: '-5%', trend: 'down', icon: Clock, color: 'amber' },
    { title: 'Atrasos Críticos', value: '3', change: '0', trend: 'neutral', icon: AlertCircle, color: 'rose' },
  ];

  const progressData = [
    { name: 'Jan', concluido: 45, planejado: 50 },
    { name: 'Fev', concluido: 52, planejado: 55 },
    { name: 'Mar', concluido: 48, planejado: 60 },
    { name: 'Abr', concluido: 61, planejado: 65 },
    { name: 'Mai', concluido: 55, planejado: 70 },
    { name: 'Jun', concluido: 67, planejado: 75 },
  ];

  const statusData = [
    { name: 'Em Planejamento', value: 3, color: '#6366f1' },
    { name: 'Em Execução', value: 7, color: '#10b981' },
    { name: 'Em Revisão', value: 2, color: '#f59e0b' },
    { name: 'Atrasado', value: 1, color: '#ef4444' },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const recentProjects = [
    { id: 1, name: 'Expansão Fábrica Sul', manager: 'Ricardo Silva', progress: 75, status: 'Em Execução', deadline: '20/04/2026' },
    { id: 2, name: 'Novo ERP VMS', manager: 'Ana Paula', progress: 30, status: 'Em Planejamento', deadline: '15/06/2026' },
    { id: 3, name: 'Otimização Logística', manager: 'Carlos Eduardo', progress: 95, status: 'Em Revisão', deadline: '05/04/2026' },
    { id: 4, name: 'Campanha Marketing Q2', manager: 'Juliana Costa', progress: 15, status: 'Em Execução', deadline: '30/05/2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' : 
                stat.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                 stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                {stat.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800">Progresso de Entregas</h3>
              <p className="text-xs text-slate-500">Comparativo entre planejado e realizado</p>
            </div>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="planejado" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Planejado" />
                <Bar dataKey="concluido" fill="#6366f1" radius={[4, 4, 0, 0]} name="Concluído" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Status dos Projetos</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {statusData.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                  <span className="text-slate-600">{status.name}</span>
                </div>
                <span className="font-bold text-slate-900">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Projetos em Destaque</h3>
          <button className="text-xs text-indigo-600 font-medium hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projeto</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gerente</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prazo</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{project.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {project.manager.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-slate-600">{project.manager}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'Em Execução' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'Em Planejamento' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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

export default ProjectDashboard;
