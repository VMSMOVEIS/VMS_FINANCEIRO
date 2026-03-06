import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  Play,
  Pause,
  StopCircle,
  Calendar,
  Package,
  Users
} from 'lucide-react';

interface ProductionOrdersProps {
  activeSubItem?: string | null;
}

interface Order {
  id: string;
  product: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  progress: number;
}

const MOCK_ORDERS: Order[] = [
  { id: 'OP-2026-001', product: 'Camiseta Algodão Premium G', quantity: 500, status: 'in_progress', priority: 'high', deadline: '2026-03-15', progress: 65 },
  { id: 'OP-2026-002', product: 'Calça Jeans Slim 42', quantity: 200, status: 'pending', priority: 'medium', deadline: '2026-03-20', progress: 0 },
  { id: 'OP-2026-003', product: 'Moletom Canguru M', quantity: 150, status: 'paused', priority: 'low', deadline: '2026-03-25', progress: 30 },
  { id: 'OP-2026-004', product: 'Bermuda Sarja 40', quantity: 300, status: 'completed', priority: 'medium', deadline: '2026-03-05', progress: 100 },
];

export const ProductionOrders: React.FC<ProductionOrdersProps> = ({ activeSubItem }) => {
  const [view, setView] = useState<'list' | 'new' | 'planning'>('list');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    if (activeSubItem === 'op_lista') setView('list');
    else if (activeSubItem === 'op_nova') setView('new');
    else if (activeSubItem === 'op_planejamento') setView('planning');
  }, [activeSubItem]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Pendente</span>;
      case 'in_progress': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Em Produção</span>;
      case 'paused': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pausada</span>;
      case 'completed': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Concluída</span>;
    }
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Buscar por OP ou produto..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option>Todos os Status</option>
          <option>Em Produção</option>
          <option>Pendentes</option>
          <option>Concluídas</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
          <Plus size={18} /> Nova OP
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{order.id}</span>
                  {getStatusBadge(order.status)}
                  {order.priority === 'high' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase"><AlertCircle size={12} /> Alta Prioridade</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{order.product}</h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package size={16} className="text-gray-400" />
                    <span>Qtd: {order.quantity} un</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Prazo: {new Date(order.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-64">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500 font-medium">Progresso</span>
                  <span className="text-gray-900 font-bold">{order.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${order.progress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors" title="Iniciar">
                    <Play size={20} />
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <button className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors" title="Pausar">
                    <Pause size={20} />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNew = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-orange-50/50">
        <h2 className="text-2xl font-bold text-gray-900">Nova Ordem de Produção</h2>
        <p className="text-gray-500 text-sm">Preencha os dados para iniciar uma nova fabricação</p>
      </div>
      <form className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Produto / Referência</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="Ex: Camiseta Algodão Premium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Quantidade</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prazo de Entrega</label>
            <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prioridade</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Linha de Produção</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
              <option>Corte & Costura</option>
              <option>Estamparia</option>
              <option>Acabamento</option>
            </select>
          </div>
        </div>
        <div className="pt-6 flex justify-end gap-4">
          <button type="button" onClick={() => setView('list')} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
          <button type="submit" className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20">Criar Ordem</button>
        </div>
      </form>
    </div>
  );

  const renderPlanning = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              Carga de Trabalho por Máquina
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Corte Automático', load: 85, status: 'Crítico' },
                { name: 'Costura Reta 01', load: 45, status: 'Normal' },
                { name: 'Overlock 03', load: 60, status: 'Normal' },
                { name: 'Prensa Térmica', load: 92, status: 'Sobrecarga' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{m.name}</span>
                    <span className={`font-bold ${m.load > 90 ? 'text-red-600' : m.load > 80 ? 'text-orange-600' : 'text-emerald-600'}`}>{m.load}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${m.load > 90 ? 'bg-red-500' : m.load > 80 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${m.load}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Resumo da Semana</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Total Peças</span>
                </div>
                <span className="font-bold text-gray-900">1.250</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Operadores</span>
                </div>
                <span className="font-bold text-gray-900">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="text-orange-600" size={28} />
          Ordens de Produção
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gestão, acompanhamento e planejamento da fabricação</p>
      </div>

      {view === 'list' && renderList()}
      {view === 'new' && renderNew()}
      {view === 'planning' && renderPlanning()}
    </div>
  );
};
