import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ArrowRight,
  Download,
  Printer,
  X,
  UserCheck
} from 'lucide-react';
import { useSales } from '../src/context/SalesContext';
import { Sale } from '../types';

const MOCK_ORDERS = [
  {
    id: 'PV-2026-001',
    customer: 'Tech Solutions Ltda',
    date: '2026-03-05',
    value: 45000,
    status: 'completed',
    items: 5,
    salesperson: 'João Silva',
    paymentStatus: 'paid'
  },
  {
    id: 'PV-2026-002',
    customer: 'Indústria Metalúrgica Silva',
    date: '2026-03-07',
    value: 120000,
    status: 'processing',
    items: 12,
    salesperson: 'Maria Costa',
    paymentStatus: 'pending'
  },
  {
    id: 'PV-2026-003',
    customer: 'Varejo Express',
    date: '2026-03-08',
    value: 25000,
    status: 'pending',
    items: 3,
    salesperson: 'João Silva',
    paymentStatus: 'pending'
  },
  {
    id: 'PV-2026-004',
    customer: 'Logística Global S.A.',
    date: '2026-03-09',
    value: 85000,
    status: 'shipped',
    items: 8,
    salesperson: 'Ana Souza',
    paymentStatus: 'paid'
  }
];

const SalesOrders: React.FC = () => {
  const { sales, addSale } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Sale>>({
    customer: '',
    value: 0,
    salesperson: '',
    status: 'pending',
    paymentStatus: 'pending'
  });

  const filteredOrders = sales.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    if (newOrder.customer && newOrder.value) {
      const order: Sale = {
        id: `PV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: newOrder.customer!,
        date: new Date().toISOString(),
        value: Number(newOrder.value),
        status: newOrder.status || 'pending',
        items: 1,
        salesperson: newOrder.salesperson || 'Não informado',
        paymentStatus: newOrder.paymentStatus || 'pending',
        origin: 'order'
      };
      addSale(order);
      setShowAddModal(false);
      setNewOrder({
        customer: '',
        value: 0,
        salesperson: '',
        status: 'pending',
        paymentStatus: 'pending'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Concluído</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200"><Clock size={12} /> Processando</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200"><Truck size={12} /> Enviado</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200"><AlertCircle size={12} /> Pendente</span>;
      case 'waiting_production':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200"><Clock size={12} /> Aguardando Produção</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="text-emerald-600" size={28} />
            Pedidos de Venda
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhamento de pedidos, faturamento e logística</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Novo Pedido
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por número do pedido ou cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="waiting_production">Aguardando Produção</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Concluído</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pedido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendedor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className={order.origin === 'pdv' ? 'text-blue-600' : 'text-emerald-600'} />
                    <span className="text-sm font-bold text-gray-900">{order.id}</span>
                    {order.origin === 'pdv' && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">PDV</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                  <p className="text-[10px] text-gray-500">
                    {Array.isArray(order.items) ? order.items.length : order.items} itens
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value)}
                  </p>
                  <span className={`text-[10px] font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Pago' : 'Aguardando Pagto'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {order.salesperson.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{order.salesperson}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Imprimir">
                      <Printer size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Download PDF">
                      <Download size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Novo Pedido de Venda</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Nome do cliente ou empresa"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Total (R$)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newOrder.value || ''}
                    onChange={(e) => setNewOrder({...newOrder, value: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vendedor</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newOrder.salesperson}
                    onChange={(e) => setNewOrder({...newOrder, salesperson: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status do Pedido</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value as any})}
                  >
                    <option value="pending">Pendente</option>
                    <option value="waiting_production">Aguardando Produção</option>
                    <option value="processing">Processando</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status de Pagamento</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({...newOrder, paymentStatus: e.target.value as any})}
                  >
                    <option value="pending">Aguardando Pagamento</option>
                    <option value="paid">Pago</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddOrder}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Salvar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;
