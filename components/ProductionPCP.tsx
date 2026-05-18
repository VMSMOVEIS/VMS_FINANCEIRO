import React, { useState } from 'react';
import { 
  ClipboardList, 
  Clock, 
  Package, 
  Users, 
  FileText, 
  Layers, 
  BarChart3, 
  Wrench,
  Search,
  Filter,
  Plus,
  LayoutDashboard,
  CheckCircle2,
  TrendingUp,
  History as LucideHistory,
  Zap,
  Activity
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { ProductionOrder } from '../types';

export const ProductionPCP: React.FC = () => {
  const { productionOrders } = useProduction();
  const [view, setView] = useState<'kanban' | 'capacity' | 'timeline'>('kanban');

  const kanbanColumns = [
    { id: 'waiting', label: 'Aguardando Material', color: 'bg-gray-100', text: 'text-gray-600' },
    { id: 'corte', label: 'Corte', color: 'bg-blue-100', text: 'text-blue-600' },
    { id: 'montagem', label: 'Montagem', color: 'bg-purple-100', text: 'text-purple-600' },
    { id: 'acabamento', label: 'Acabamento', color: 'bg-orange-100', text: 'text-orange-600' },
    { id: 'instalacao', label: 'Instalação', color: 'bg-emerald-100', text: 'text-emerald-600' },
    { id: 'completed', label: 'Finalizado', color: 'bg-green-100', text: 'text-green-600' },
  ];

  const displayOrders = productionOrders.length > 0 ? productionOrders : [
    { id: 'OP-2024-912', productName: 'Cozinha Modulada Luxo', client: 'Residencial Aurora', deadline: '2024-06-15', status: 'waiting', progress: 0 },
    { id: 'OP-2024-913', productName: 'Painel Home Office', client: 'Condomínio Spazio', deadline: '2024-06-18', status: 'corte', progress: 15 },
    { id: 'OP-2024-914', productName: 'Dormitório Casal', client: 'Edifício Horizon', deadline: '2024-06-10', status: 'montagem', progress: 65 },
    { id: 'OP-2024-915', productName: 'Closet Master', client: 'Village Garden', deadline: '2024-06-22', status: 'acabamento', progress: 85 },
    { id: 'OP-2024-916', productName: 'Área Gourmet', client: 'Quinta das Videiras', deadline: '2024-06-25', status: 'instalacao', progress: 95 },
  ];

  const renderKanban = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px] sidebar-scroll">
      {kanbanColumns.map(column => (
        <div key={column.id} className="flex-shrink-0 w-80 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${column.color.replace('100', '500')}`}></span>
              {column.label}
              <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                {displayOrders.filter(o => o.status === column.id || (column.id === 'waiting' && o.status === 'waiting')).length}
              </span>
            </h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {displayOrders.filter(o => o.status === column.id || (column.id === 'waiting' && o.status === 'waiting')).map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{order.id}</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-2 truncate uppercase tracking-tight">{order.productName}</h4>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1 font-black uppercase"><Clock size={12} /> {new Date(order.deadline).toLocaleDateString('pt-BR')}</span>
                  <span className="font-black text-gray-700 uppercase tracking-tighter">{order.client}</span>
                </div>
                <div className="mt-3 h-1 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${order.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-orange-600" size={28} />
            PCP - Planejamento e Controle
          </h1>
          <p className="text-gray-500 text-sm mt-1">O cérebro operacional da fábrica • Gestão de Fila e Capacidade</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button 
            onClick={() => setView('kanban')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'kanban' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Kanban
          </button>
          <button 
            onClick={() => setView('capacity')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'capacity' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Capacidade
          </button>
        </div>
      </div>

      {/* Capacity View */}
      {view === 'capacity' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Capacidade Total', value: '450h', icon: Zap, color: 'text-blue-600' },
            { label: 'Carga Atual', value: '382h', icon: Activity, color: 'text-orange-600' },
            { label: 'Disponibilidade', value: '15.2%', icon: Clock, color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            </div>
          ))}
          
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">Fila de Produção por Setor</h3>
            <div className="space-y-6">
              {[
                { sector: 'Corte', queue: 45, load: 92 },
                { sector: 'Usinagem', queue: 12, load: 35 },
                { sector: 'Montagem', queue: 28, load: 78 },
                { sector: 'Acabamento', queue: 8, load: 42 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-700">{item.sector} ({item.queue} OPs)</span>
                    <span className={item.load > 90 ? 'text-rose-600' : 'text-gray-500'}>{item.load}% ocupado</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.load > 90 ? 'bg-rose-500' : 'bg-orange-500'}`} style={{ width: `${item.load}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'kanban' && renderKanban()}
    </div>
  );
};
