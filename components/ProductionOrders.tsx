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
import { useProduction } from '../src/context/ProductionContext';
import { ProductionOrder } from '../types';

interface ProductionOrdersProps {
  activeSubItem?: string | null;
}

export const ProductionOrders: React.FC<ProductionOrdersProps> = ({ activeSubItem }) => {
  const { productionOrders, updateProductionOrder, addProductionOrder } = useProduction();
  const [view, setView] = useState<'list' | 'new' | 'planning' | 'ficha' | 'consumo' | 'etapas' | 'custos'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');

  useEffect(() => {
    if (activeSubItem === 'pcp_ordens') setView('list');
    else if (activeSubItem === 'pcp_ficha') setView('ficha');
    else if (activeSubItem === 'pcp_consumo') setView('consumo');
    else if (activeSubItem === 'pcp_etapas') setView('etapas');
    else if (activeSubItem === 'pcp_custos') setView('custos');
    else if (activeSubItem === 'pcp_planejamento') setView('planning');
  }, [activeSubItem]);

  const getStatusBadge = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'waiting': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Aguardando</span>;
      case 'in_production': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Em Produção</span>;
      case 'completed': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Concluída</span>;
      case 'cancelled': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Cancelada</span>;
    }
  };

  const handleStatusChange = (id: string, newStatus: ProductionOrder['status']) => {
    const order = productionOrders.find(o => o.id === id);
    if (order) {
      updateProductionOrder({ ...order, status: newStatus, progress: newStatus === 'completed' ? 100 : order.progress });
    }
  };

  const filteredOrders = productionOrders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos os Status' || 
      (statusFilter === 'Em Produção' && order.status === 'in_production') ||
      (statusFilter === 'Pendentes' && order.status === 'waiting') ||
      (statusFilter === 'Concluídas' && order.status === 'completed');
    return matchesSearch && matchesStatus;
  });

  const renderList = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por OP ou produto..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>Todos os Status</option>
          <option>Em Produção</option>
          <option>Pendentes</option>
          <option>Concluídas</option>
        </select>
        <button 
          onClick={() => setView('new')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nova OP
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{order.id}</span>
                  {getStatusBadge(order.status)}
                  {order.priority === 'high' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase"><AlertCircle size={12} /> Alta Prioridade</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{order.productName}</h3>
                <p className="text-xs text-gray-500 mb-2">Cliente: {order.client}</p>
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
                {order.status === 'waiting' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'in_production')}
                    className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors" 
                    title="Iniciar"
                  >
                    <Play size={20} />
                  </button>
                )}
                {order.status === 'in_production' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'completed')}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors" 
                    title="Concluir"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-500">Nenhuma ordem de produção encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNew = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-orange-50/50">
        <h2 className="text-2xl font-bold text-gray-900">Nova Ordem de Produção</h2>
        <p className="text-gray-500 text-sm">Preencha os dados para iniciar uma nova fabricação</p>
      </div>
      <form 
        className="p-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as any;
          const newOrder: ProductionOrder = {
            id: `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            productName: target.product.value,
            client: target.client.value,
            quantity: parseInt(target.quantity.value),
            deadline: target.deadline.value,
            status: 'waiting',
            priority: target.priority.value.toLowerCase() as any,
            progress: 0
          };
          addProductionOrder(newOrder);
          setView('list');
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Produto / Referência</label>
            <input name="product" required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="Ex: Camiseta Algodão Premium" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
            <input name="client" required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="Nome do cliente" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Quantidade</label>
            <input name="quantity" required type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prazo de Entrega</label>
            <input name="deadline" required type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Prioridade</label>
            <select name="priority" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
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

  const renderPlaceholder = (title: string, description: string) => (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
      <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ClipboardList size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="text-orange-600" size={28} />
          PCP - Planejamento e Controle
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gestão, acompanhamento e planejamento da fabricação</p>
      </div>

      {view === 'list' && renderList()}
      {view === 'new' && renderNew()}
      {view === 'planning' && renderPlanning()}
      {view === 'ficha' && renderPlaceholder('Ficha Técnica', 'Gerencie as especificações técnicas e composições dos produtos.')}
      {view === 'consumo' && renderPlaceholder('Consumo de Matéria-Prima', 'Acompanhe o consumo real vs previsto de insumos na produção.')}
      {view === 'etapas' && renderPlaceholder('Etapas de Produção', 'Defina e monitore as fases do processo produtivo.')}
      {view === 'custos' && renderPlaceholder('Custos de Fabricação', 'Análise detalhada dos custos diretos e indiretos de produção.')}
    </div>
  );
};
