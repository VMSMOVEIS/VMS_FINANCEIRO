import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  User, 
  DollarSign,
  Trash2,
  Edit2,
  Send,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSales } from '../src/context/SalesContext';
import { useProduction } from '../src/context/ProductionContext';
import { Quote, BOMItem, ProductionOrder, Sale } from '../types';

export const SalesQuotes: React.FC = () => {
  const { quotes, addQuote, updateQuote, deleteQuote, addSale } = useSales();
  const { addProductionOrder } = useProduction();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Quote>>({
    client: '',
    productName: '',
    bomItems: [],
    profitMargin: 30,
    discount: 0,
    status: 'waiting_approval'
  });

  const handleOpenModal = (quote?: Quote) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData(quote);
    } else {
      setEditingQuote(null);
      setFormData({
        client: '',
        productName: '',
        bomItems: [],
        profitMargin: 30,
        discount: 0,
        status: 'waiting_approval'
      });
    }
    setShowModal(true);
  };

  const handleAddBOMItem = () => {
    const newItem: BOMItem = {
      id: Math.random().toString(36).substr(2, 9),
      materialName: '',
      quantity: 1,
      unit: 'UN',
      cost: 0
    };
    setFormData(prev => ({
      ...prev,
      bomItems: [...(prev.bomItems || []), newItem]
    }));
  };

  const handleRemoveBOMItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      bomItems: prev.bomItems?.filter(item => item.id !== id)
    }));
  };

  const handleBOMItemChange = (id: string, field: keyof BOMItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      bomItems: prev.bomItems?.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const calculateTotalCost = () => {
    return formData.bomItems?.reduce((acc, item) => acc + (item.quantity * item.cost), 0) || 0;
  };

  const calculateFinalPrice = () => {
    const cost = calculateTotalCost();
    const margin = formData.profitMargin || 0;
    const discount = formData.discount || 0;
    
    if (cost === 0) return 0;
    
    const priceWithMargin = cost / (1 - (margin / 100));
    const finalPrice = priceWithMargin * (1 - (discount / 100));
    return finalPrice;
  };

  const handleSave = () => {
    if (!formData.client || !formData.productName) {
      alert('Por favor, preencha o cliente e o nome do produto.');
      return;
    }

    const finalValue = calculateFinalPrice();
    const quoteData: Quote = {
      id: editingQuote?.id || `ORC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      client: formData.client!,
      productName: formData.productName!,
      date: editingQuote?.date || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bomItems: formData.bomItems || [],
      profitMargin: formData.profitMargin || 0,
      discount: formData.discount || 0,
      value: finalValue,
      status: formData.status as any || 'waiting_approval'
    };

    if (editingQuote) {
      updateQuote(quoteData);
    } else {
      addQuote(quoteData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteQuote(id);
    setShowDeleteConfirm(null);
  };

  const handleApprove = (quote: Quote) => {
    // 1. Update Quote Status
    updateQuote({ ...quote, status: 'approved' });

    // 2. Create Sales Order
    const salesOrder: Sale = {
      id: `PV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: quote.client,
      salesperson: 'Sistema',
      date: new Date().toISOString(),
      value: quote.value,
      status: 'waiting_production',
      items: [{
        productId: 'quote-item',
        code: 'ORC',
        name: quote.productName,
        unit: 'un',
        quantity: 1,
        listPrice: quote.value,
        discount: 0,
        unitPrice: quote.value,
        totalPrice: quote.value
      }],
      itemCount: 1,
      totalQuantity: 1,
      totalDiscount: 0,
      otherExpenses: 0,
      commission: 0,
      paymentStatus: 'pending',
      origin: 'order'
    };
    addSale(salesOrder);

    // 3. Create Production Order
    const productionOrder: ProductionOrder = {
      id: `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: quote.productName,
      client: quote.client,
      quantity: 1, // Simplified
      deadline: quote.expiryDate, // Using expiry date as deadline for now
      status: 'waiting',
      priority: 'medium',
      progress: 0,
      quoteId: quote.id
    };
    addProductionOrder(productionOrder);

    alert('Orçamento aprovado! Pedido de venda e Ordem de produção criados.');
  };

  const handleReject = (quote: Quote) => {
    updateQuote({ ...quote, status: 'rejected' });
  };

  const handleSend = (quote: Quote) => {
    updateQuote({ ...quote, status: 'sent' });
  };

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Aprovado</span>;
      case 'sent': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Send size={12} /> Enviado</span>;
      case 'waiting_approval': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Aguardando Aprovação</span>;
      case 'draft': return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Rascunho</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12} /> Rejeitado</span>;
      case 'expired': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Calendar size={12} /> Expirado</span>;
    }
  };

  const filteredQuotes = quotes.filter(q => 
    (statusFilter === 'all' || q.status === statusFilter) &&
    (q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Analytics Data
  const PERFORMANCE_DATA = [
    { month: 'Jan', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-01-')).reduce((acc, q) => acc + q.value, 0) || 45000, sent: quotes.filter(q => q.date.includes('-01-')).reduce((acc, q) => acc + q.value, 0) || 60000 },
    { month: 'Feb', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-02-')).reduce((acc, q) => acc + q.value, 0) || 52000, sent: quotes.filter(q => q.date.includes('-02-')).reduce((acc, q) => acc + q.value, 0) || 75000 },
    { month: 'Mar', approved: quotes.filter(q => q.status === 'approved' && q.date.includes('-03-')).reduce((acc, q) => acc + q.value, 0) || 38000, sent: quotes.filter(q => q.date.includes('-03-')).reduce((acc, q) => acc + q.value, 0) || 90000 },
  ];

  const STATUS_DATA = [
    { name: 'Aprovados', value: quotes.filter(q => q.status === 'approved').length, color: '#10b981' },
    { name: 'Enviados', value: quotes.filter(q => q.status === 'sent').length, color: '#3b82f6' },
    { name: 'Em Aberto', value: quotes.filter(q => q.status === 'draft').length, color: '#f59e0b' },
    { name: 'Rejeitados', value: quotes.filter(q => q.status === 'rejected').length, color: '#ef4444' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orçamentos</h1>
          <p className="text-gray-500 text-sm">Gestão de propostas e performance de conversão</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Orçamento
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" />
              Performance de Vendas (Orçado vs Aprovado)
            </h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Enviado</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Aprovado</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sent" name="Enviado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Aprovado" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-emerald-600" />
            Status das Propostas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orçado (Mês)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.reduce((acc, q) => acc + q.value, 0)), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Taxa de Conversão', value: `${((quotes.filter(q => q.status === 'approved').length / (quotes.length || 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ticket Médio', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.reduce((acc, q) => acc + q.value, 0) / (quotes.length || 1)), icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Aprovado', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotes.filter(q => q.status === 'approved').reduce((acc, q) => acc + q.value, 0)), icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar orçamento ou cliente..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="waiting_approval">Aguardando Aprovação</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors border border-gray-200 rounded-lg">
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID / Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Data Emissão</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-800">{quote.id}</p>
                      <p className="text-xs text-gray-500">{quote.client}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {quote.productName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.value)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quote.status !== 'approved' && quote.status !== 'rejected' && (
                        <>
                          <button 
                            onClick={() => handleApprove(quote)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                            title="Aprovar"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleReject(quote)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Rejeitar"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleSend(quote)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Enviar"
                          >
                            <Send size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleOpenModal(quote)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(quote.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingQuote ? `Editar Orçamento ${editingQuote.id}` : 'Novo Orçamento'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Nome do cliente"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ex: Mesa de Jantar"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>
              </div>

              {/* BOM List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Lista BOM (Matéria-prima)</h3>
                  <button 
                    onClick={handleAddBOMItem}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar Item
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2 text-left">Material</th>
                        <th className="px-4 py-2 text-center w-24">Qtd</th>
                        <th className="px-4 py-2 text-center w-24">Unid</th>
                        <th className="px-4 py-2 text-right w-32">Custo Unit.</th>
                        <th className="px-4 py-2 text-right w-32">Total</th>
                        <th className="px-4 py-2 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.bomItems?.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <input 
                              type="text"
                              className="w-full bg-transparent outline-none focus:text-emerald-600"
                              placeholder="Nome do material"
                              value={item.materialName}
                              onChange={(e) => handleBOMItemChange(item.id, 'materialName', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-transparent outline-none text-center focus:text-emerald-600"
                              value={item.quantity}
                              onChange={(e) => handleBOMItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="text"
                              className="w-full bg-transparent outline-none text-center focus:text-emerald-600"
                              value={item.unit}
                              onChange={(e) => handleBOMItemChange(item.id, 'unit', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-transparent outline-none text-right focus:text-emerald-600"
                              value={item.cost}
                              onChange={(e) => handleBOMItemChange(item.id, 'cost', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-gray-700">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.cost)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button 
                              onClick={() => handleRemoveBOMItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!formData.bomItems || formData.bomItems.length === 0) && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">
                            Nenhum item adicionado à lista BOM.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right uppercase text-gray-500">Custo Total de Materiais:</td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotalCost())}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Margem de Lucro (%)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({ ...formData, profitMargin: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desconto (%)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Preço Final Estimado</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateFinalPrice())}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-500">
                Tem certeza que deseja apagar este orçamento? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
