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
  Printer
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = MOCK_ORDERS.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
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
                    <FileText size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold text-gray-900">{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                  <p className="text-[10px] text-gray-500">{order.items} itens</p>
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
    </div>
  );
};

export default SalesOrders;
