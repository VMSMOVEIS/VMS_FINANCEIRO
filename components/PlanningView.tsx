import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  Factory, 
  ShoppingCart, 
  Package, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  X,
  Info
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
  Legend
} from 'recharts';

interface PlanningViewProps {
  sector: string;
}

export const PlanningView: React.FC<PlanningViewProps> = ({ sector }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', priority: 'Média' });

  const data = [
    { name: 'Jan', planejado: 4000, realizado: 2400 },
    { name: 'Fev', planejado: 3000, realizado: 1398 },
    { name: 'Mar', planejado: 2000, realizado: 9800 },
    { name: 'Abr', planejado: 2780, realizado: 3908 },
    { name: 'Mai', planejado: 1890, realizado: 4800 },
    { name: 'Jun', planejado: 2390, realizado: 3800 },
  ];

  const getSectorConfig = () => {
    switch (sector.toLowerCase()) {
      case 'financeiro': 
        return { 
          icon: <TrendingUp className="text-blue-600" />, 
          color: 'blue', 
          bg: 'bg-blue-600', 
          hover: 'hover:bg-blue-700', 
          text: 'text-blue-600', 
          lightBg: 'bg-blue-50',
          shadow: 'shadow-blue-200'
        };
      case 'rh': 
        return { 
          icon: <Users className="text-pink-600" />, 
          color: 'pink', 
          bg: 'bg-pink-600', 
          hover: 'hover:bg-pink-700', 
          text: 'text-pink-600', 
          lightBg: 'bg-pink-50',
          shadow: 'shadow-pink-200'
        };
      case 'produção': 
        return { 
          icon: <Factory className="text-orange-600" />, 
          color: 'orange', 
          bg: 'bg-orange-600', 
          hover: 'hover:bg-orange-700', 
          text: 'text-orange-600', 
          lightBg: 'bg-orange-50',
          shadow: 'shadow-orange-200'
        };
      case 'vendas': 
        return { 
          icon: <ShoppingCart className="text-emerald-600" />, 
          color: 'emerald', 
          bg: 'bg-emerald-600', 
          hover: 'hover:bg-emerald-700', 
          text: 'text-emerald-600', 
          lightBg: 'bg-emerald-50',
          shadow: 'shadow-emerald-200'
        };
      case 'compras': 
        return { 
          icon: <Package className="text-indigo-600" />, 
          color: 'indigo', 
          bg: 'bg-indigo-600', 
          hover: 'hover:bg-indigo-700', 
          text: 'text-indigo-600', 
          lightBg: 'bg-indigo-50',
          shadow: 'shadow-indigo-200'
        };
      case 'projetos': 
        return { 
          icon: <ClipboardList className="text-violet-600" />, 
          color: 'violet', 
          bg: 'bg-violet-600', 
          hover: 'hover:bg-violet-700', 
          text: 'text-violet-600', 
          lightBg: 'bg-violet-50',
          shadow: 'shadow-violet-200'
        };
      default: 
        return { 
          icon: <Target className="text-gray-600" />, 
          color: 'gray', 
          bg: 'bg-gray-600', 
          hover: 'hover:bg-gray-700', 
          text: 'text-gray-600', 
          lightBg: 'bg-gray-50',
          shadow: 'shadow-gray-200'
        };
    }
  };

  const config = getSectorConfig();

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save this to the database
    console.log('Nova meta criada:', newGoal);
    setIsModalOpen(false);
    setNewGoal({ title: '', target: '', deadline: '', priority: 'Média' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {config.icon}
            Planejamento {sector}
          </h1>
          <p className="text-gray-500">Metas, objetivos e acompanhamento estratégico</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`${config.bg} text-white px-4 py-2 rounded-lg text-sm font-bold ${config.hover} transition-all flex items-center gap-2 shadow-lg ${config.shadow}`}
        >
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${config.lightBg} ${config.text} rounded-xl`}>
              <Target size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Meta Global</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">85% Atingida</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className={`${config.bg} h-full rounded-full`} style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">No Prazo</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Objetivos Concluídos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12 / 15</p>
          <p className="text-xs text-gray-400 mt-2">3 objetivos pendentes para este mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Atenção</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Tempo Restante</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">8 Dias</p>
          <p className="text-xs text-gray-400 mt-2">Para o fechamento do ciclo atual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Planejado vs Realizado</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="planejado" fill={config.bg.replace('bg-', '#').replace('600', '500')} radius={[4, 4, 0, 0]} name="Planejado" />
                <Bar dataKey="realizado" fill="#10b981" radius={[4, 4, 0, 0]} name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Evolução das Metas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="realizado" stroke={config.bg.replace('bg-', '#').replace('600', '500')} strokeWidth={3} dot={{ r: 4, fill: config.bg.replace('bg-', '#').replace('600', '500') }} name="Desempenho" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Principais Objetivos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { title: 'Aumentar eficiência operacional', status: 'Em andamento', progress: 65, priority: 'Alta' },
            { title: 'Reduzir custos fixos em 10%', status: 'Atrasado', progress: 30, priority: 'Urgente' },
            { title: 'Implementar novo sistema de gestão', status: 'Concluído', progress: 100, priority: 'Média' },
            { title: 'Treinamento da equipe técnica', status: 'Em andamento', progress: 45, priority: 'Média' },
          ].map((obj, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-gray-900">{obj.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    obj.priority === 'Urgente' ? 'bg-red-100 text-red-600' : 
                    obj.priority === 'Alta' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {obj.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${config.bg} h-full rounded-full`} style={{ width: `${obj.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{obj.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    obj.status === 'Concluído' ? 'text-emerald-600' : 
                    obj.status === 'Atrasado' ? 'text-red-600' : 
                    'text-amber-600'
                  }`}>
                    {obj.status}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Atualizado há 2 horas</p>
                </div>
                <button className={`p-2 text-gray-400 ${config.text} ${config.lightBg} rounded-xl transition-all opacity-0 group-hover:opacity-100`}>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nova Meta Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className={config.text} />
                Nova Meta - {sector}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título da Meta</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Aumentar produtividade em 20%"
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Objetivo</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: 500 unidades"
                    value={newGoal.target}
                    onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prazo</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prioridade</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Baixa', 'Média', 'Alta'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewGoal({...newGoal, priority: p})}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        newGoal.priority === p 
                          ? `${config.bg} text-white border-transparent` 
                          : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
                <Info className="text-blue-600 shrink-0" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Esta meta será vinculada ao planejamento estratégico do setor <strong>{sector}</strong> e poderá ser acompanhada por toda a equipe.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-bold text-white ${config.bg} ${config.hover} transition-all shadow-lg ${config.shadow}`}
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
