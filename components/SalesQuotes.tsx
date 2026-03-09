import React, { useState } from 'react';
import { Search, Plus, Filter, Download, FileText, CheckCircle2, Clock, XCircle, MoreVertical, TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, User, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Quote {
  id: string;
  client: string;
  date: string;
  expiryDate: string;
  value: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  items: number;
}

const MOCK_QUOTES: Quote[] = [
  { id: 'ORC-2026-001', client: 'Empresa Alpha Ltda', date: '2026-03-01', expiryDate: '2026-03-15', value: 12500.00, status: 'approved', items: 5 },
  { id: 'ORC-2026-002', client: 'João Silva ME', date: '2026-03-03', expiryDate: '2026-03-17', value: 4890.50, status: 'sent', items: 3 },
  { id: 'ORC-2026-003', client: 'Condomínio Solar', date: '2026-03-05', expiryDate: '2026-03-19', value: 2100.00, status: 'draft', items: 2 },
  { id: 'ORC-2026-004', client: 'Indústria Metalúrgica', date: '2026-03-07', expiryDate: '2026-03-21', value: 45000.00, status: 'sent', items: 12 },
  { id: 'ORC-2026-005', client: 'Supermercado Central', date: '2026-03-08', expiryDate: '2026-03-22', value: 8750.00, status: 'rejected', items: 8 },
  { id: 'ORC-2026-006', client: 'Tech Solutions SA', date: '2026-02-25', expiryDate: '2026-03-11', value: 15600.00, status: 'approved', items: 6 },
];

const PERFORMANCE_DATA = [
  { month: 'Jan', approved: 45000, sent: 60000 },
  { month: 'Feb', approved: 52000, sent: 75000 },
  { month: 'Mar', approved: 38000, sent: 90000 },
];

const STATUS_DATA = [
  { name: 'Aprovados', value: 45, color: '#10b981' },
  { name: 'Enviados', value: 30, color: '#3b82f6' },
  { name: 'Em Aberto', value: 15, color: '#f59e0b' },
  { name: 'Rejeitados', value: 10, color: '#ef4444' },
];

export const SalesQuotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Aprovado</span>;
      case 'sent': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><TrendingUp size={12} /> Enviado</span>;
      case 'draft': return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Rascunho</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12} /> Rejeitado</span>;
      case 'expired': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Calendar size={12} /> Expirado</span>;
    }
  };

  const filteredQuotes = MOCK_QUOTES.filter(q => 
    (statusFilter === 'all' || q.status === statusFilter) &&
    (q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orçamentos</h1>
          <p className="text-gray-500 text-sm">Gestão de propostas e performance de conversão</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
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
          { label: 'Total Orçado (Mês)', value: 'R$ 128.450', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Taxa de Conversão', value: '42.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ticket Médio', value: 'R$ 8.560', icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Tempo Médio Fech.', value: '4.2 dias', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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
                <th className="px-6 py-4">Data Emissão</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Itens</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-800">{quote.id}</p>
                      <p className="text-xs text-gray-500">{quote.client}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.expiryDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{quote.items} itens</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.value)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
