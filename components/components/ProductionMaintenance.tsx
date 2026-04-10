import React from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Settings2, 
  Calendar, 
  Plus,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

const ProductionMaintenance: React.FC = () => {
  const maintenanceTasks = [
    { id: 'MT-001', machine: 'Torno CNC Mazak', type: 'preventive', date: '2026-03-20', status: 'scheduled', priority: 'high' },
    { id: 'MT-002', machine: 'Prensa Hidráulica 500T', type: 'corrective', date: '2026-03-18', status: 'in-progress', priority: 'critical' },
    { id: 'MT-003', machine: 'Centro de Usinagem Haas', type: 'predictive', date: '2026-03-25', status: 'scheduled', priority: 'medium' },
    { id: 'MT-004', machine: 'Robô de Solda ABB', type: 'preventive', date: '2026-03-15', status: 'completed', priority: 'low' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="text-orange-600" size={28} />
            Gestão de Manutenção
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manutenção preventiva, corretiva e preditiva de ativos</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Nova Ordem de Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Ordens Pendentes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-orange-600 mt-1 font-medium">4 críticas para esta semana</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Disponibilidade Média</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">94.5%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">+1.2% em relação ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Próximas Preventivas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Agendadas para os próximos 7 dias</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar ordens de serviço..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 py-4">ID OS</th>
                <th className="px-6 py-4">Máquina / Equipamento</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {maintenanceTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{task.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{task.machine}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      task.type === 'preventive' ? 'bg-blue-100 text-blue-700' : 
                      task.type === 'corrective' ? 'bg-rose-100 text-rose-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {task.type === 'preventive' ? 'Preventiva' : 
                       task.type === 'corrective' ? 'Corretiva' : 
                       'Preditiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {task.status === 'completed' ? 'Concluída' : 
                       task.status === 'in-progress' ? 'Em Execução' : 
                       'Agendada'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'critical' ? 'bg-rose-500' : 
                        task.priority === 'high' ? 'bg-orange-500' : 
                        task.priority === 'medium' ? 'bg-amber-500' : 
                        'bg-blue-500'
                      }`}></div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                        {task.priority === 'critical' ? 'Crítica' : 
                         task.priority === 'high' ? 'Alta' : 
                         task.priority === 'medium' ? 'Média' : 
                         'Baixa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(task.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 ml-auto">
                      Abrir
                      <ArrowRight size={14} />
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

export default ProductionMaintenance;
