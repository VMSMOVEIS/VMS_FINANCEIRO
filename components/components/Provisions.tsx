import React, { useState, useMemo } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  X,
  Save,
  ChevronRight,
  Receipt,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface Provision {
  id: string;
  description: string;
  category: string;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'late';
  notes?: string;
}

const CATEGORIES = [
  'Impostos',
  'Folha de Pagamento',
  'Fornecedores',
  'Manutenção',
  'Marketing',
  'Aluguel & Utilidades',
  'Outros'
];

export const Provisions: React.FC = () => {
  const [provisions, setProvisions] = useState<Provision[]>([
    { id: '1', description: 'FGTS Mensal', category: 'Folha de Pagamento', value: 4500, dueDate: '2026-04-07', status: 'pending' },
    { id: '2', description: 'Simples Nacional', category: 'Impostos', value: 12800, dueDate: '2026-04-20', status: 'pending' },
    { id: '3', description: 'Aluguel Galpão', category: 'Aluguel & Utilidades', value: 5500, dueDate: '2026-04-05', status: 'pending' },
    { id: '4', description: 'Manutenção Preventiva', category: 'Manutenção', value: 1200, dueDate: '2026-03-20', status: 'late' },
    { id: '5', description: 'Fornecedor MDF', category: 'Fornecedores', value: 25000, dueDate: '2026-04-15', status: 'pending' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  const [newProvision, setNewProvision] = useState<Omit<Provision, 'id'>>({
    description: '',
    category: CATEGORIES[0],
    value: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  });

  const filteredProvisions = useMemo(() => {
    return provisions.filter(p => {
      const matchesSearch = p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [provisions, searchTerm, filterCategory]);

  const stats = useMemo(() => {
    const total = provisions.reduce((sum, p) => sum + p.value, 0);
    const pending = provisions.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.value, 0);
    const late = provisions.filter(p => p.status === 'late').reduce((sum, p) => sum + p.value, 0);
    const paid = provisions.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.value, 0);

    return { total, pending, late, paid };
  }, [provisions]);

  const chartData = useMemo(() => {
    const data = CATEGORIES.map(cat => ({
      name: cat,
      value: provisions.filter(p => p.category === cat).reduce((sum, p) => sum + p.value, 0)
    })).filter(d => d.value > 0);
    return data;
  }, [provisions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleAddProvision = (e: React.FormEvent) => {
    e.preventDefault();
    const provision: Provision = {
      ...newProvision,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProvisions([...provisions, provision]);
    setIsModalOpen(false);
    setNewProvision({
      description: '',
      category: CATEGORIES[0],
      value: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta provisão?')) {
      setProvisions(provisions.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setProvisions(provisions.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'paid' ? 'pending' : 'paid';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarClock className="text-indigo-600" size={28} />
            Provisões Financeiras
          </h1>
          <p className="text-gray-500">Planejamento e controle de compromissos futuros</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setViewMode('chart')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'chart' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Gráficos
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            Nova Provisão
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Receipt size={24} />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Provisionado</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.total)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pendente</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Aguardando Pagamento</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.pending)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Atrasado</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Vencidos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.late)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Pago</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Liquidados</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.paid)}</p>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar provisão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">Todas Categorias</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Vencimento</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {filteredProvisions.map((item) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.id} 
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.description}</div>
                        {item.notes && <div className="text-xs text-gray-400 mt-0.5">{item.notes}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(item.value)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            item.status === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                            item.status === 'late' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                            'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {item.status === 'paid' ? 'Liquidado' : item.status === 'late' ? 'Atrasado' : 'Pendente'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProvisions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma provisão encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PieChartIcon className="text-indigo-600" size={20} />
              Distribuição por Categoria
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={20} />
              Valores Provisionados
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* New Provision Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Plus size={24} />
                    Nova Provisão
                  </h2>
                  <p className="text-indigo-100 text-sm">Cadastre um novo compromisso financeiro futuro.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProvision} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
                    <input 
                      required
                      type="text"
                      value={newProvision.description}
                      onChange={(e) => setNewProvision({...newProvision, description: e.target.value})}
                      placeholder="Ex: Pagamento de Impostos, Fornecedor..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
                    <select 
                      value={newProvision.category}
                      onChange={(e) => setNewProvision({...newProvision, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor (R$)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={newProvision.value || ''}
                      onChange={(e) => setNewProvision({...newProvision, value: parseFloat(e.target.value) || 0})}
                      placeholder="0,00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vencimento</label>
                    <input 
                      required
                      type="date"
                      value={newProvision.dueDate}
                      onChange={(e) => setNewProvision({...newProvision, dueDate: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status Inicial</label>
                    <select 
                      value={newProvision.status}
                      onChange={(e) => setNewProvision({...newProvision, status: e.target.value as any})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="late">Atrasado</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações (Opcional)</label>
                    <textarea 
                      rows={3}
                      value={newProvision.notes}
                      onChange={(e) => setNewProvision({...newProvision, notes: e.target.value})}
                      placeholder="Detalhes adicionais sobre a provisão..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Salvar Provisão
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
