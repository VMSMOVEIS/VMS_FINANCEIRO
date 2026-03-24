import React, { useState, useMemo, useEffect } from 'react';
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
  UserCheck,
  Edit2,
  Trash2,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { useSales } from '../src/context/SalesContext';
import { useTransactions } from '../src/context/TransactionContext';
import { useProduction } from '../src/context/ProductionContext';
import { useEmployees } from '../src/context/EmployeeContext';
import { Sale, SaleItem } from '../types';

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

const STORES = ['Loja Principal', 'Showroom Centro', 'Loja Online', 'Filial Sul'];

const SalesOrders: React.FC = () => {
  const { sales, addSale, updateSaleStatus, updateSale, deleteSale, paymentMethods, isLoading } = useSales();
  const { accountPlans, transactions, addTransaction } = useTransactions();
  const { inventory } = useProduction();
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Sale | null>(null);
  
  const initialOrderState: Partial<Sale> = {
    customer: '',
    operator: '',
    store: STORES[0],
    date: new Date().toISOString().split('T')[0],
    effectiveDate: '',
    dueDate: new Date().toISOString().split('T')[0],
    items: [],
    itemCount: 0,
    totalQuantity: 0,
    totalDiscount: 0,
    deliveryTime: '',
    otherExpenses: 0,
    commission: 0,
    value: 0,
    status: 'pending',
    paymentStatus: 'pending',
    origin: 'order',
    saleType: 'pronta_entrega',
    accountPlanId: '',
    notes: ''
  };

  const [newOrder, setNewOrder] = useState<Partial<Sale>>(initialOrderState);

  const [currentItem, setCurrentItem] = useState<Partial<SaleItem>>({
    productId: '',
    code: '',
    name: '',
    unit: 'un',
    quantity: 1,
    listPrice: 0,
    discount: 0,
    unitPrice: 0,
    totalPrice: 0
  });

  const [selectedOrder, setSelectedOrder] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Status Change Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState<{ id: string, status: Sale['status'] } | null>(null);
  const [statusExtraData, setStatusExtraData] = useState({
    paymentMethod: '',
    accountPlanId: '',
    selectedAdvances: [] as string[],
    advanceTotal: 0
  });

  const orderAdvances = useMemo(() => {
    if (!selectedOrder) return [];
    return transactions.filter(t => 
      t.transactionTypeId === 'adiantamento_cliente' && 
      (t.orderNumber === selectedOrder.id || t.customerName === selectedOrder.customer)
    );
  }, [transactions, selectedOrder]);

  useEffect(() => {
    if (showStatusModal && selectedOrder) {
      const autoAdvances = orderAdvances.map(a => a.id.toString());
      const total = orderAdvances.reduce((sum, a) => sum + a.value, 0);
      setStatusExtraData(prev => ({
        ...prev,
        selectedAdvances: autoAdvances,
        advanceTotal: total
      }));
    }
  }, [showStatusModal, selectedOrder, orderAdvances]);

  const filteredOrders = sales.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const revenueAccounts = accountPlans.filter(ap => ap.type === 'receita' && ap.level === 'analitica');

  const handleAddItem = () => {
    if (currentItem.name && currentItem.quantity && currentItem.unitPrice) {
      const newItem = {
        ...currentItem,
        totalPrice: (currentItem.unitPrice || 0) * (currentItem.quantity || 0)
      } as SaleItem;
      
      const updatedItems = [...(newOrder.items || []), newItem];
      updateOrderTotals(updatedItems);
      
      setCurrentItem({
        productId: '',
        code: '',
        name: '',
        unit: 'un',
        quantity: 1,
        listPrice: 0,
        discount: 0,
        unitPrice: 0,
        totalPrice: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = (newOrder.items || []).filter((_, i) => i !== index);
    updateOrderTotals(updatedItems);
  };

  const updateOrderTotals = (items: SaleItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.listPrice - item.unitPrice) * item.quantity, 0);
    
    const finalValue = subtotal + (newOrder.otherExpenses || 0);
    
    setNewOrder({
      ...newOrder,
      items,
      itemCount: items.length,
      totalQuantity,
      totalDiscount,
      value: finalValue
    });
  };

  const handleAddOrder = () => {
    if (newOrder.customer && newOrder.items && newOrder.items.length > 0) {
      if (editingOrder) {
        updateSale({
          ...editingOrder,
          ...newOrder as Sale
        });
        setEditingOrder(null);
      } else {
        const order: Sale = {
          ...newOrder as Sale,
          id: `PV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          origin: 'order',
        };
        addSale(order);
      }
      setShowAddModal(false);
      setNewOrder(initialOrderState);
    } else {
      alert('Por favor, preencha o cliente e adicione pelo menos um item.');
    }
  };

  const handleEdit = (order: Sale) => {
    setEditingOrder(order);
    setNewOrder(order);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteSale(id);
    }
  };

  const handleStatusChangeClick = (id: string, status: Sale['status']) => {
    if (status === 'completed') {
      setStatusChangeData({ id, status });
      setShowStatusModal(true);
    } else {
      updateSaleStatus(id, status);
    }
  };

  const confirmStatusChange = () => {
    if (statusChangeData && statusExtraData.paymentMethod && statusExtraData.accountPlanId) {
      const balance = selectedOrder!.value - statusExtraData.advanceTotal;
      
      // Update sale status
      updateSaleStatus(statusChangeData.id, statusChangeData.status, {
        paymentMethod: statusExtraData.paymentMethod,
        accountPlanId: statusExtraData.accountPlanId,
        paymentStatus: balance <= 0 ? 'paid' : 'partial'
      });

      // Create or update transaction for the sale
      addTransaction({
        date: new Date().toISOString(),
        description: `Venda Pedido ${selectedOrder!.id}`,
        category: accountPlans.find(ap => ap.id === statusExtraData.accountPlanId)?.name || 'Vendas',
        categoryCode: accountPlans.find(ap => ap.id === statusExtraData.accountPlanId)?.code,
        value: selectedOrder!.value,
        type: 'income',
        transactionTypeId: 'recebimento',
        documentType: 'Pedido',
        orderNumber: selectedOrder!.id,
        customerName: selectedOrder!.customer,
        status: 'completed',
        payments: balance > 0 ? [{
          id: Math.random().toString(36).substr(2, 9),
          method: statusExtraData.paymentMethod,
          value: balance,
          dueDate: new Date().toISOString(),
          destination: 'Fluxo de Caixa',
          status: 'completed'
        }] : []
      });

      setShowStatusModal(false);
      setStatusChangeData(null);
      setStatusExtraData({ paymentMethod: '', accountPlanId: '', selectedAdvances: [], advanceTotal: 0 });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleViewDetails = (order: Sale) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
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
            {isLoading && <Clock className="animate-spin text-blue-500" size={20} />}
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
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Pedido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Efetivo</th>
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
                      {order.operator.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{order.operator}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-all"
                    >
                      Ver Detalhes
                    </button>
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => handleStatusChangeClick(order.id, 'completed')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                        title="Concluir Pedido"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{editingOrder ? 'Editar Pedido de Venda' : 'Novo Pedido de Venda'}</h2>
                <p className="text-xs text-gray-500">Preencha todos os campos para registrar a venda</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Section 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Cliente</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    placeholder="Nome do cliente ou empresa"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Operador</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                    value={newOrder.operator}
                    onChange={(e) => setNewOrder({...newOrder, operator: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {employees.filter(emp => emp.status === 'active').map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Loja</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                    value={newOrder.store}
                    onChange={(e) => setNewOrder({...newOrder, store: e.target.value})}
                  >
                    {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria (Receita)</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                    value={newOrder.accountPlanId}
                    onChange={(e) => setNewOrder({...newOrder, accountPlanId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {revenueAccounts.map(ap => (
                      <option key={ap.id} value={ap.id}>{ap.code} - {ap.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data do Pedido</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={newOrder.date}
                    onChange={(e) => setNewOrder({...newOrder, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data Efetivo</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={newOrder.effectiveDate}
                    onChange={(e) => setNewOrder({...newOrder, effectiveDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data de Vencimento</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={newOrder.dueDate}
                    onChange={(e) => setNewOrder({...newOrder, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Venda</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                    value={newOrder.saleType}
                    onChange={(e) => setNewOrder({...newOrder, saleType: e.target.value as any})}
                  >
                    <option value="pronta_entrega">A pronta entrega</option>
                    <option value="encomenda">Por encomenda</option>
                    <option value="prazo">A prazo</option>
                  </select>
                </div>
              </div>

              {/* Section 2: Order Items */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart size={16} className="text-emerald-600" />
                  Itens do Pedido
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Produto</label>
                      <select 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                        value={currentItem.productId}
                        onChange={(e) => {
                          const prod = inventory.find(p => p.id === e.target.value);
                          if (prod) {
                            setCurrentItem({
                              ...currentItem,
                              productId: prod.id,
                              code: prod.id.substring(0, 8),
                              name: prod.name,
                              listPrice: prod.value,
                              unitPrice: prod.value,
                              unit: prod.unit || 'un'
                            });
                          } else {
                            setCurrentItem({...currentItem, productId: '', name: '', code: ''});
                          }
                        }}
                      >
                        <option value="">Selecionar Produto...</option>
                        {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        <option value="new">+ Novo Produto...</option>
                      </select>
                    </div>
                    {currentItem.productId === 'new' && (
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Novo Produto</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Qtd</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={currentItem.quantity}
                        onChange={(e) => setCurrentItem({...currentItem, quantity: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Preço Lista</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={currentItem.listPrice}
                        onChange={(e) => setCurrentItem({...currentItem, listPrice: parseFloat(e.target.value) || 0, unitPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Desconto (%)</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={currentItem.discount}
                        onChange={(e) => {
                          const disc = parseFloat(e.target.value) || 0;
                          const up = (currentItem.listPrice || 0) * (1 - disc / 100);
                          setCurrentItem({...currentItem, discount: disc, unitPrice: up});
                        }}
                      />
                    </div>
                    <div>
                      <button 
                        onClick={handleAddItem}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Cód</th>
                        <th className="px-4 py-3">Produto</th>
                        <th className="px-4 py-3 text-center">UN</th>
                        <th className="px-4 py-3 text-center">Qtd</th>
                        <th className="px-4 py-3 text-right">P. Lista</th>
                        <th className="px-4 py-3 text-right">Desc %</th>
                        <th className="px-4 py-3 text-right">P. Unit</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(newOrder.items || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-[10px]">{item.code}</td>
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3 text-center uppercase">{item.unit}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.listPrice)}</td>
                          <td className="px-4 py-3 text-right text-red-500">{item.discount}%</td>
                          <td className="px-4 py-3 text-right font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(newOrder.items || []).length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-gray-400 italic">Nenhum item adicionado ao pedido</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Totals & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Prazo de Entrega</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="Ex: 15 dias"
                        value={newOrder.deliveryTime}
                        onChange={(e) => setNewOrder({...newOrder, deliveryTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Comissão (%)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={newOrder.commission}
                        onChange={(e) => setNewOrder({...newOrder, commission: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Outras Despesas (R$)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        value={newOrder.otherExpenses}
                        onChange={(e) => {
                          const exp = parseFloat(e.target.value) || 0;
                          const subtotal = (newOrder.items || []).reduce((sum, item) => sum + item.totalPrice, 0);
                          setNewOrder({...newOrder, otherExpenses: exp, value: subtotal + exp});
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Observações</label>
                    <textarea 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm h-24 resize-none"
                      placeholder="Informações adicionais sobre o pedido..."
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4">Resumo dos Totais</h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Número de Itens:</span>
                    <span className="font-bold">{newOrder.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Soma das Quantidades:</span>
                    <span className="font-bold">{newOrder.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Desconto Total:</span>
                    <span className="font-bold text-red-500">-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newOrder.totalDiscount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Outras Despesas:</span>
                    <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newOrder.otherExpenses || 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t border-emerald-200">
                    <span>VALOR TOTAL:</span>
                    <span className="text-emerald-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newOrder.value || 0)}</span>
                  </div>
                  {newOrder.commission && newOrder.commission > 0 ? (
                    <div className="flex justify-between text-[10px] text-gray-500 italic">
                      <span>Comissão Estimada ({newOrder.commission}%):</span>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((newOrder.value || 0) * (newOrder.commission / 100))}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddOrder}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Salvar Pedido de Venda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Finalizar Pedido</h2>
                <p className="text-xs text-emerald-600 font-medium">{selectedOrder.id} - {selectedOrder.customer}</p>
              </div>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor do Pedido</label>
                  <p className="text-lg font-bold text-gray-800">R$ {selectedOrder.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Saldo a Receber</label>
                  <p className="text-lg font-bold text-emerald-700">R$ {(selectedOrder.value - statusExtraData.advanceTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {orderAdvances.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Adiantamentos Encontrados</label>
                  <div className="space-y-2">
                    {orderAdvances.map(adv => (
                      <div key={adv.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <DollarSign size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-blue-800">Adiantamento #{adv.id}</p>
                            <p className="text-[10px] text-blue-600">{new Date(adv.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-bold text-blue-700">R$ {adv.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <input 
                            type="checkbox"
                            checked={statusExtraData.selectedAdvances.includes(adv.id.toString())}
                            onChange={(e) => {
                              const selected = e.target.checked 
                                ? [...statusExtraData.selectedAdvances, adv.id.toString()]
                                : statusExtraData.selectedAdvances.filter(id => id !== adv.id.toString());
                              const total = orderAdvances.filter(a => selected.includes(a.id.toString())).reduce((sum, a) => sum + a.value, 0);
                              setStatusExtraData({...statusExtraData, selectedAdvances: selected, advanceTotal: total});
                            }}
                            className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Forma de Recebimento (Saldo)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setStatusExtraData({...statusExtraData, paymentMethod: pm.name})}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          statusExtraData.paymentMethod === pm.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Categoria de Receita</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm font-medium"
                    value={statusExtraData.accountPlanId}
                    onChange={(e) => setStatusExtraData({...statusExtraData, accountPlanId: e.target.value})}
                  >
                    <option value="">Selecione a conta...</option>
                    {revenueAccounts.map(ap => (
                      <option key={ap.id} value={ap.id}>{ap.code} - {ap.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Confirmar Recebimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalhes do Pedido {selectedOrder.id}</h2>
                <p className="text-sm text-emerald-600 font-medium">{selectedOrder.customer}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Loja</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.store || 'Não informada'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Venda</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedOrder.saleType === 'pronta_entrega' ? 'A pronta entrega' : 
                     selectedOrder.saleType === 'encomenda' ? 'Por encomenda' : 
                     selectedOrder.saleType === 'prazo' ? 'A prazo' : 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Operador</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.operator}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Prazo de Entrega</label>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.deliveryTime || '-'}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Lista de Produtos</h3>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3">Cód</th>
                        <th className="px-4 py-3">Produto</th>
                        <th className="px-4 py-3 text-center">UN</th>
                        <th className="px-4 py-3 text-center">Qtd</th>
                        <th className="px-4 py-3 text-right">P. Lista</th>
                        <th className="px-4 py-3 text-right">P. Unit</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{item.code}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-center uppercase">{item.unit}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-400">R$ {item.listPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-medium">R$ {item.unitPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">R$ {item.totalPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Observações</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                    {selectedOrder.notes || 'Nenhuma observação registrada.'}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Número de Itens:</span>
                    <span className="font-bold">{selectedOrder.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Soma das Quantidades:</span>
                    <span className="font-bold">{selectedOrder.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Desconto Total:</span>
                    <span className="font-bold text-red-500">-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.totalDiscount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Outras Despesas:</span>
                    <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.otherExpenses || 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t border-gray-200">
                    <span>VALOR TOTAL:</span>
                    <span className="text-emerald-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.value || 0)}</span>
                  </div>
                  {selectedOrder.commission ? (
                    <div className="flex justify-between text-[10px] text-gray-500 italic">
                      <span>Comissão ({selectedOrder.commission}%):</span>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.value * (selectedOrder.commission / 100))}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                Fechar
              </button>
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                <Printer size={18} /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;
