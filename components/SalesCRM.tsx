import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Building2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Lead, LeadStatus, Quote, ProductionOrder, Sale } from '../types';
import { useSales } from '../src/context/SalesContext';
import { useProduction } from '../src/context/ProductionContext';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    company: 'Tech Solutions Ltda',
    contactName: 'Carlos Oliveira',
    email: 'carlos@techsolutions.com',
    phone: '(11) 98765-4321',
    value: 45000,
    status: LeadStatus.NEW,
    lastContact: '2026-03-05',
    source: 'Indicação',
    probability: 20,
    expectedCloseDate: '2026-04-15'
  },
  {
    id: '2',
    company: 'Indústria Metalúrgica Silva',
    contactName: 'Ana Paula',
    email: 'ana.paula@silvametal.com.br',
    phone: '(11) 91234-5678',
    value: 120000,
    status: LeadStatus.QUALIFICATION,
    lastContact: '2026-03-07',
    source: 'Google Ads',
    probability: 40,
    expectedCloseDate: '2026-05-20'
  },
  {
    id: '3',
    company: 'Varejo Express',
    contactName: 'Roberto Santos',
    email: 'roberto@varejoexpress.com',
    phone: '(21) 99887-7665',
    value: 25000,
    status: LeadStatus.QUOTE,
    lastContact: '2026-03-08',
    source: 'LinkedIn',
    probability: 60,
    expectedCloseDate: '2026-03-25'
  },
  {
    id: '4',
    company: 'Logística Global S.A.',
    contactName: 'Fernanda Lima',
    email: 'fernanda.lima@logglobal.com',
    phone: '(41) 97766-5544',
    value: 85000,
    status: LeadStatus.NEGOTIATION,
    lastContact: '2026-03-09',
    source: 'Site',
    probability: 80,
    expectedCloseDate: '2026-03-30'
  },
  {
    id: '5',
    company: 'Construtora Horizonte',
    contactName: 'Marcos Reus',
    email: 'marcos@horizonte.com.br',
    phone: '(31) 96655-4433',
    value: 210000,
    status: LeadStatus.WON,
    lastContact: '2026-03-01',
    source: 'Indicação',
    probability: 100,
    expectedCloseDate: '2026-03-01'
  },
  {
    id: '6',
    company: 'Escola Aprender',
    contactName: 'Juliana Costa',
    email: 'diretoria@aprender.edu.br',
    phone: '(11) 95544-3322',
    value: 15000,
    status: LeadStatus.LOST,
    lastContact: '2026-02-20',
    source: 'Google Ads',
    probability: 0,
    expectedCloseDate: '2026-02-20'
  }
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SalesCRM: React.FC = () => {
  const { quotes, sales, isLoading } = useSales();
  const { productionOrders } = useProduction();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'analytics'>('kanban');

  const filteredLeads = leads.filter(lead => 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'Novo Lead';
      case LeadStatus.QUALIFICATION: return 'Qualificação';
      case LeadStatus.QUOTE: return 'Orçamentos';
      case LeadStatus.NEGOTIATION: return 'Negociação';
      case LeadStatus.ORDER_CONFIRMED: return 'Pedido Confirmado';
      case LeadStatus.PRODUCTION: return 'Produção';
      case LeadStatus.DELIVERY: return 'Entrega / Instalação';
      case LeadStatus.WON: return 'Venda Concluída';
      case LeadStatus.POST_SALE: return 'Pós - Venda';
      case LeadStatus.LOST: return 'Perdido';
      default: return status;
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LeadStatus.QUALIFICATION: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case LeadStatus.QUOTE: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LeadStatus.NEGOTIATION: return 'bg-purple-100 text-purple-700 border-purple-200';
      case LeadStatus.ORDER_CONFIRMED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LeadStatus.PRODUCTION: return 'bg-orange-100 text-orange-700 border-orange-200';
      case LeadStatus.DELIVERY: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case LeadStatus.WON: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LeadStatus.POST_SALE: return 'bg-pink-100 text-pink-700 border-pink-200';
      case LeadStatus.LOST: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const kanbanColumns = [
    { id: LeadStatus.NEW, label: 'Novos Leads', color: 'border-blue-500' },
    { id: LeadStatus.QUALIFICATION, label: 'Qualificação', color: 'border-indigo-500' },
    { id: LeadStatus.QUOTE, label: 'Orçamentos', color: 'border-amber-500' },
    { id: LeadStatus.NEGOTIATION, label: 'Negociação', color: 'border-purple-500' },
    { id: LeadStatus.ORDER_CONFIRMED, label: 'Pedido Confirmado', color: 'border-emerald-500' },
    { id: LeadStatus.PRODUCTION, label: 'Produção', color: 'border-orange-500' },
    { id: LeadStatus.DELIVERY, label: 'Entrega / Instalação', color: 'border-cyan-500' },
    { id: LeadStatus.WON, label: 'Venda Concluída', color: 'border-emerald-600' },
    { id: LeadStatus.POST_SALE, label: 'Pós - Venda', color: 'border-pink-500' }
  ];

  // Analytics Data
  const leadsByStatusData = kanbanColumns.map(col => ({
    name: col.label,
    count: leads.filter(l => l.status === col.id).length,
    value: leads.filter(l => l.status === col.id).reduce((acc, curr) => acc + curr.value, 0)
  }));

  const leadsBySourceData = Array.from(new Set(leads.map(l => l.source))).map(source => ({
    name: source,
    value: leads.filter(l => l.source === source).length
  }));

  const pipelineValue = leads
    .filter(l => l.status !== LeadStatus.WON && l.status !== LeadStatus.LOST)
    .reduce((acc, curr) => acc + curr.value, 0);

  const weightedPipelineValue = leads
    .filter(l => l.status !== LeadStatus.WON && l.status !== LeadStatus.LOST)
    .reduce((acc, curr) => acc + (curr.value * (curr.probability / 100)), 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-emerald-600" size={28} />
            CRM / Funil de Vendas
            {isLoading && <Clock className="animate-spin text-blue-500" size={20} />}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas oportunidades e acompanhe o desempenho comercial</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'kanban' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'analytics' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Análise
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={18} />
            Nova Oportunidade
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Pipeline Total</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pipelineValue)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Ponderado</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Valor Ponderado</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(weightedPipelineValue)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Ativos</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Oportunidades Ativas</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {leads.filter(l => l.status !== LeadStatus.WON && l.status !== LeadStatus.LOST).length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Taxa</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Taxa de Conversão</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">24.5%</h3>
        </div>
      </div>

      {/* Filters & Search */}
      {viewMode !== 'analytics' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por empresa ou contato..." 
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
              <option value="">Todos os Vendedores</option>
              <option value="1">João Silva</option>
              <option value="2">Maria Costa</option>
            </select>
          </div>
        </div>
      )}

      {/* Content Area */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px] kanban-scroll scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {kanbanColumns.map(column => {
            // Get items for this column based on the mapping
            let columnItems: any[] = [];
            
            if (column.id === LeadStatus.NEW) {
              columnItems = filteredLeads.filter(l => l.status === LeadStatus.NEW).map(l => ({
                id: l.id,
                title: l.company,
                subtitle: l.contactName,
                value: l.value,
                probability: l.probability,
                date: l.expectedCloseDate,
                lastContact: l.lastContact,
                type: 'lead'
              }));
            } else if (column.id === LeadStatus.QUALIFICATION) {
              columnItems = filteredLeads.filter(l => l.status === LeadStatus.QUALIFICATION).map(l => ({
                id: l.id,
                title: l.company,
                subtitle: l.contactName,
                value: l.value,
                probability: l.probability,
                date: l.expectedCloseDate,
                lastContact: l.lastContact,
                type: 'lead'
              }));
            } else if (column.id === LeadStatus.QUOTE) {
              columnItems = quotes.filter(q => q.status === 'draft' || q.status === 'waiting_approval').map(q => ({
                id: q.id,
                title: q.client,
                subtitle: q.items?.[0]?.name || 'Item de Orçamento',
                value: q.value,
                probability: 50,
                date: q.expiryDate,
                lastContact: q.date,
                type: 'quote'
              }));
            } else if (column.id === LeadStatus.NEGOTIATION) {
              columnItems = quotes.filter(q => q.status === 'sent').map(q => ({
                id: q.id,
                title: q.client,
                subtitle: q.items?.[0]?.name || 'Item de Orçamento',
                value: q.value,
                probability: 70,
                date: q.expiryDate,
                lastContact: q.date,
                type: 'quote'
              }));
            } else if (column.id === LeadStatus.ORDER_CONFIRMED) {
              columnItems = quotes.filter(q => q.status === 'approved').map(q => ({
                id: q.id,
                title: q.client,
                subtitle: q.items?.[0]?.name || 'Item de Orçamento',
                value: q.value,
                probability: 90,
                date: q.expiryDate,
                lastContact: q.date,
                type: 'quote'
              }));
            } else if (column.id === LeadStatus.PRODUCTION) {
              columnItems = productionOrders.filter(po => po.status === 'in_production').map(po => ({
                id: po.id,
                title: po.client,
                subtitle: po.productName,
                value: 0, // Production orders don't have value directly in the interface
                probability: po.progress,
                date: po.deadline,
                lastContact: po.deadline,
                type: 'production'
              }));
            } else if (column.id === LeadStatus.WON) {
              columnItems = sales.filter(s => s.status === 'completed').map(s => ({
                id: s.id,
                title: s.customer,
                subtitle: `Vendedor: ${s.salesperson}`,
                value: s.value,
                probability: 100,
                date: s.date,
                lastContact: s.date,
                type: 'sale'
              }));
            } else if (column.id === LeadStatus.POST_SALE) {
              columnItems = filteredLeads.filter(l => l.status === LeadStatus.POST_SALE).map(l => ({
                id: l.id,
                title: l.company,
                subtitle: l.contactName,
                value: l.value,
                probability: 100,
                date: l.expectedCloseDate,
                lastContact: l.lastContact,
                type: 'lead'
              }));
            }

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{column.label}</h3>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {columnItems.length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {columnItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate w-40">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-300 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <div className="mb-4">
                        <p className="text-lg font-bold text-gray-900">
                          {item.value > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value) : '---'}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${item.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">{item.probability}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                          <Calendar size={12} />
                          {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '---'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                          <Clock size={12} />
                          {item.lastContact ? new Date(item.lastContact).toLocaleDateString('pt-BR') : '---'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnItems.length === 0 && (
                    <div className="py-12 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                      <Target size={32} className="opacity-20 mb-2" />
                      <p className="text-xs">Sem oportunidades</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa / Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Probabilidade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Último Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Previsão</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        {lead.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{lead.company}</p>
                        <p className="text-xs text-gray-500">{lead.contactName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)}
                    </p>
                    <p className="text-[10px] text-gray-400">{lead.source}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${lead.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{lead.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{new Date(lead.lastContact).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{new Date(lead.expectedCloseDate || '').toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                        <Phone size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                        <Mail size={18} />
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pipeline Distribution */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Distribuição do Pipeline por Etapa</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStatusData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Valor Total']}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Origem das Oportunidades</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadsBySourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadsBySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Growth (Simulated) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Evolução do Pipeline (Últimos 6 meses)</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Out', value: 320000 },
                    { month: 'Nov', value: 380000 },
                    { month: 'Dez', value: 350000 },
                    { month: 'Jan', value: 420000 },
                    { month: 'Fev', value: 480000 },
                    { month: 'Mar', value: 510000 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `R$ ${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Valor']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCRM;
