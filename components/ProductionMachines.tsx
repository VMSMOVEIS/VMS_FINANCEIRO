import React from 'react';
import { 
  Factory, 
  Settings2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Wrench,
  Clock,
  Zap,
  Activity,
  Plus
} from 'lucide-react';

const ProductionMachines: React.FC = () => {
  const machines = [
    { id: '1', name: 'Torno CNC Romi D800', status: 'running', efficiency: 92, lastMaintenance: '2026-02-15', nextMaintenance: '2026-05-15', operator: 'Ricardo Silva', uptime: '12h 45m' },
    { id: '2', name: 'Fresadora Universal', status: 'idle', efficiency: 85, lastMaintenance: '2026-03-01', nextMaintenance: '2026-06-01', operator: 'Nenhum', uptime: '0h 00m' },
    { id: '3', name: 'Prensa Hidráulica 100T', status: 'maintenance', efficiency: 0, lastMaintenance: '2026-03-18', nextMaintenance: '2026-03-20', operator: 'Equipe Manutenção', uptime: '0h 00m' },
    { id: '4', name: 'Corte a Laser Fiber 3015', status: 'running', efficiency: 98, lastMaintenance: '2026-01-20', nextMaintenance: '2026-04-20', operator: 'Ana Paula', uptime: '8h 20m' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700"><CheckCircle2 size={12} /> Em Operação</span>;
      case 'idle':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700"><Clock size={12} /> Ociosa</span>;
      case 'maintenance':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700"><Wrench size={12} /> Manutenção</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Factory className="text-indigo-600" size={28} />
            Máquinas & Equipamentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitoramento de ativos, manutenção e eficiência operacional</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={18} />
            Cadastrar Equipamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total de Máquinas</p>
          <h4 className="text-2xl font-bold text-gray-900">12</h4>
          <p className="text-xs text-gray-400 mt-2">Ativos cadastrados no sistema</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Em Operação</p>
          <h4 className="text-2xl font-bold text-emerald-600">8</h4>
          <p className="text-xs text-emerald-600 mt-2">66% de utilização</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Em Manutenção</p>
          <h4 className="text-2xl font-bold text-red-600">2</h4>
          <p className="text-xs text-red-600 mt-2">1 corretiva, 1 preventiva</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Eficiência Média (OEE)</p>
          <h4 className="text-2xl font-bold text-indigo-600">88.5%</h4>
          <p className="text-xs text-emerald-600 mt-2">+2.1% vs semana anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {machines.map(machine => (
          <div key={machine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  machine.status === 'running' ? 'bg-emerald-50 text-emerald-600' : 
                  machine.status === 'idle' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{machine.name}</h3>
                  <div className="mt-1">
                    {getStatusBadge(machine.status)}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Eficiência</p>
                <p className="text-lg font-bold text-gray-900">{machine.efficiency}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Uptime</p>
                <p className="text-lg font-bold text-gray-900">{machine.uptime}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Operador</p>
                <p className="text-sm font-bold text-gray-900 truncate">{machine.operator}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Activity size={14} />
                Próxima Manutenção: {new Date(machine.nextMaintenance).toLocaleDateString('pt-BR')}
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Ver Telemetria
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionMachines;
