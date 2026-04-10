import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ArrowRight,
  Download,
  Printer,
  X,
  Edit2,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package
} from 'lucide-react';
import { PurchaseOrder } from '../types';
import { usePurchasing } from '../src/context/PurchasingContext';
import { useTransactions } from '../src/context/TransactionContext';
import { useSales } from '../src/context/SalesContext';

const PurchasingOrders: React.FC = () => {
  const { purchases, addPurchase, updatePurchase, deletePurchase, updatePurchaseStatus } = usePurchasing();
  const { accountPlans, addTransaction } = useTransactions();
  const { paymentMethods } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({
    supplier: '',
    value: 0,
    buyer: '',
    status: 'pending',
    paymentStatus: 'pending'
  });

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Temporal Filter State
  const [filterType, setFilterType] = useState('this-month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const isDateInSelectedRange = (dateStr: string) => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    const tDate = new Date(year, month - 1, day || 1);
    const tYear = tDate.getFullYear();
    const tMonth = tDate.getMonth();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (filterType) {
      case 'this-month':
        return tYear === currentYear && tMonth === currentMonth;
      case 'last-month':
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return tYear === lastMonthDate.getFullYear() && tMonth === lastMonthDate.getMonth();
      case 'this-year':
        return tYear === currentYear;
      case 'month':
        return tYear === currentYear && tMonth === parseInt(selectedMonth);
      case 'custom':
        if (!customRange.start || !customRange.end) return true;
        return dateStr >= customRange.start && dateStr <= customRange.end;
      default:
        return true;
    }
  };

  // Status Change Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState<{ id: string, status: PurchaseOrder['status'] } | null>(null);
  const [statusExtraData, setStatusExtraData] = useState({
    paymentMethod: '',
    accountPlanId: ''
  });

  const filteredOrders = purchases.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = isDateInSelectedRange(order.date);
    return matchesSearch && matchesDate;
  });

  // KPI Calculations based on filtered orders
  const kpis = useMemo(() => {
    const totalValue = filteredOrders.reduce((sum, order) => sum + order.value, 0);
    const orderCount = filteredOrders.length;
    const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'paid').length;
    const pendingOrders = filteredOrders.filter(o => o.paymentStatus === 'pending').length;
    const receivedOrders = filteredOrders.filter(o => o.status === 'completed').length;
    
    return {
      totalValue,
      orderCount,
      paidOrders,
      pendingOrders,
      receivedOrders
    };
  }, [filteredOrders]);

  const expenseAccounts = accountPlans.filter(ap => ap.type === 'despesa' && ap.level === 'analitica');

  const handleAddOrder = () => {
    if (newOrder.supplier && newOrder.value) {
      if (editingOrder) {
        updatePurchase({
          ...editingOrder,
          ...newOrder as PurchaseOrder
        });
        setEditingOrder(null);
      } else {
        const order: PurchaseOrder = {
          id: `PC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          supplier: newOrder.supplier!,
          date: new Date().toISOString(),
          dueDate: newOrder.dueDate,
          effectiveDate: newOrder.status === 'completed' ? new Date().toISOString() : undefined,
          value: Number(newOrder.value),
          status: newOrder.status || 'pending',
          items: 1,
          buyer: newOrder.buyer || 'Não informado',
          paymentStatus: newOrder.paymentStatus || 'pending',
          purchaseType: newOrder.purchaseType
        };
        addPurchase(order);
      }
      setShowAddModal(false);
      setNewOrder({
        supplier: '',
        value: 0,
        buyer: '',
        status: 'pending',
        paymentStatus: 'pending',
        dueDate: '',
        purchaseType: 'mercadoria'
      });
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setNewOrder(order);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deletePurchase(id);
    }
  };

  const handleStatusChangeClick = (id: string, status: PurchaseOrder['status']) => {
    if (status === 'completed') {
      setStatusChangeData({ id, status });
      setShowStatusModal(true);
    } else {
      updatePurchaseStatus(id, status);
    }
  };

  const confirmStatusChange = () => {
    if (statusChangeData && statusExtraData.paymentMethod && statusExtraData.accountPlanId) {
      const selectedOrder = purchases.find(p => p.id === statusChangeData.id);
      if (!selectedOrder) return;

      // Update purchase status
      updatePurchaseStatus(statusChangeData.id, statusChangeData.status, {
        paymentMethod: statusExtraData.paymentMethod,
        accountPlanId: statusExtraData.accountPlanId,
        paymentStatus: 'paid'
      });

      // Create financial transaction for the purchase
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Compra Pedido ${selectedOrder.id}`,
        category: accountPlans.find(ap => ap.id === statusExtraData.accountPlanId)?.name || 'Compras',
        categoryCode: accountPlans.find(ap => ap.id === statusExtraData.accountPlanId)?.code,
        value: selectedOrder.value,
        type: 'expense',
        transactionTypeId: 'pagamento',
        documentType: 'Pedido',
        orderNumber: selectedOrder.id,
        customerName: selectedOrder.supplier,
        status: 'completed',
        payments: [{
          id: Math.random().toString(36).substr(2, 9),
          method: statusExtraData.paymentMethod,
          value: selectedOrder.value,
          dueDate: new Date().toISOString().split('T')[0],
          destination: 'Fluxo de Caixa',
          status: 'completed'
        }]
      });

      setShowStatusModal(false);
      setStatusChangeData(null);
      setStatusExtraData({ paymentMethod: '', accountPlanId: '' });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Recebido</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200"><Clock size={12} /> Em Trânsito</span>;
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
            <ShoppingCart className="text-indigo-600" size={28} />
            Pedidos de Compra
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de suprimentos e ordens de compra</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Novo Pedido
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total em Compras</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalValue)}
              </h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{kpis.orderCount} pedidos no período</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pedidos Recebidos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpis.receivedOrders}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Mercadorias em estoque</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pagamentos Pendentes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpis.pendingOrders}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Aguardando pagamento</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Ticket Médio Compra</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.orderCount > 0 ? kpis.totalValue / kpis.orderCount : 0)}
              </h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShoppingBag className="text-indigo-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Valor médio por pedido</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por número do pedido ou fornecedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="this-month">Este Mês</option>
            <option value="last-month">Mês Passado</option>
            <option value="this-year">Este Ano</option>
            <option value="month">Por Mês</option>
            <option value="custom">Personalizado</option>
            <option value="all">Tudo</option>
          </select>

          {filterType === 'month' && (
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="0">Janeiro</option>
              <option value="1">Fevereiro</option>
              <option value="2">Março</option>
              <option value="3">Abril</option>
              <option value="4">Maio</option>
              <option value="5">Junho</option>
              <option value="6">Julho</option>
              <option value="7">Agosto</option>
              <option value="8">Setembro</option>
              <option value="9">Outubro</option>
              <option value="10">Novembro</option>
              <option value="11">Dezembro</option>
            </select>
          )}

          {filterType === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="processing">Em Trânsito</option>
            <option value="completed">Recebido</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pedido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fornecedor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Pedido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Efetivo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Comprador</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" />
                    <span className="text-sm font-bold text-gray-900">{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{order.supplier}</p>
                  <p className="text-[10px] text-gray-500">
                    {Array.isArray(order.items) ? order.items.length : order.items} itens
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.effectiveDate ? new Date(order.effectiveDate).toLocaleDateString('pt-BR') : '-'}
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
                      {order.buyer.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{order.buyer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-all"
                    >
                      Ver Detalhes
                    </button>
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => handleStatusChangeClick(order.id, 'completed')}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                        title="Receber Pedido"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(order)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Imprimir">
                      <Printer size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Download PDF">
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
              <h2 className="text-xl font-bold text-gray-800">Novo Pedido de Compra</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Nome do fornecedor"
                    value={newOrder.supplier}
                    onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Total (R$)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newOrder.value || ''}
                    onChange={(e) => setNewOrder({...newOrder, value: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comprador</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newOrder.buyer}
                    onChange={(e) => setNewOrder({...newOrder, buyer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status do Pedido</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value as any})}
                  >
                    <option value="pending">Pendente</option>
                    <option value="processing">Em Trânsito</option>
                    <option value="completed">Recebido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status de Pagamento</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({...newOrder, paymentStatus: e.target.value as any})}
                  >
                    <option value="pending">Aguardando Pagamento</option>
                    <option value="paid">Pago</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Vencimento</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newOrder.dueDate}
                    onChange={(e) => setNewOrder({...newOrder, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Compra</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newOrder.purchaseType}
                    onChange={(e) => setNewOrder({...newOrder, purchaseType: e.target.value as any})}
                  >
                    <option value="mercadoria">Mercadoria</option>
                    <option value="materia_prima">Matéria Prima</option>
                    <option value="insumos">Insumos</option>
                    <option value="escritorio">Materiais de Escritório</option>
                    <option value="outros">Outros</option>
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
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Salvar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <h2 className="text-xl font-bold text-gray-800">Receber Pedido</h2>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 italic">Informe os dados financeiros para concluir a compra.</p>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setStatusExtraData({...statusExtraData, paymentMethod: pm.name})}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        statusExtraData.paymentMethod === pm.name ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pm.name.toLowerCase().includes('pix') ? <QrCode size={14} /> : 
                       pm.name.toLowerCase().includes('cartão') ? <CreditCard size={14} /> : 
                       <Banknote size={14} />}
                      {pm.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Compra (Conta Custo/Despesa)</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                  value={statusExtraData.accountPlanId}
                  onChange={(e) => setStatusExtraData({...statusExtraData, accountPlanId: e.target.value})}
                >
                  <option value="">Selecione a conta...</option>
                  {expenseAccounts.map(ap => (
                    <option key={ap.id} value={ap.id}>{ap.code} - {ap.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Confirmar Recebimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalhes do Pedido {selectedOrder.id}</h2>
                <p className="text-sm text-indigo-600 font-medium">{selectedOrder.supplier}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data do Pedido</label>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data de Vencimento</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.dueDate ? new Date(selectedOrder.dueDate).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data Efetiva</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.effectiveDate ? new Date(selectedOrder.effectiveDate).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Compra</label>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedOrder.purchaseType?.replace('_', ' ') || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Comprador</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.buyer}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Lista de Itens</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100/50 text-gray-500 font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3 text-center">Qtd</th>
                        <th className="px-4 py-3 text-right">Unitário</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(selectedOrder.items) ? (
                        selectedOrder.items.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium text-gray-900">{item.name || 'Item de Compra'}</td>
                            <td className="px-4 py-3 text-center">{item.quantity || 1}</td>
                            <td className="px-4 py-3 text-right">R$ {(item.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">R$ {((item.quantity || 1) * (item.price || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-900">Itens Diversos</td>
                          <td className="px-4 py-3 text-center">{selectedOrder.items}</td>
                          <td className="px-4 py-3 text-right">R$ {(selectedOrder.value / Number(selectedOrder.items)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">R$ {selectedOrder.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-100/50 font-bold">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-gray-500">TOTAL DA COMPRA</td>
                        <td className="px-4 py-3 text-right text-indigo-600 text-sm">
                          R$ {selectedOrder.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                Fechar
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Printer size={18} /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasingOrders;
