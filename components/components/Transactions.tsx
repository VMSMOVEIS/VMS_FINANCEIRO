import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { useTransactions } from '@/src/context/TransactionContext';

export const Transactions: React.FC = () => {
  const { transactions, openModal, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('this-month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter(t => {
      // 1. Search Filter
      const matchesSearch = 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.customerName && t.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.orderNumber && t.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Date Filter
      const [year, month, day] = t.date.split('-').map(Number);
      const tDate = new Date(year, month - 1, day);
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();

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
          return t.date >= customRange.start && t.date <= customRange.end;
        default:
          return true;
      }
    });
  }, [transactions, searchTerm, filterType, selectedMonth, customRange]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita e afetará a contabilidade.')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lançamentos Financeiros</h1>
          <p className="text-gray-500">Gestão completa de entradas e saídas</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por descrição, cliente, fornecedor ou pedido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="this-month">Este Mês</option>
            <option value="last-month">Último Mês</option>
            <option value="this-year">Este Ano</option>
            <option value="month">Mês Específico</option>
            <option value="custom">Personalizado</option>
          </select>

          {filterType === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          )}

          {filterType === 'custom' && (
            <div className="flex gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição / Categoria</th>
                <th className="px-6 py-4">Cliente/Fornecedor</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Nenhum lançamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{t.date.split('-').reverse().join('/')}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> {t.documentType} {t.orderNumber && `#${t.orderNumber}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{t.description}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Tag size={10} /> {t.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {t.customerName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        t.type === 'income' ? 'text-emerald-600' : 
                        t.transactionTypeId === 'transferencia' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : t.transactionTypeId === 'transferencia' ? '⇄' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.transactionTypeId?.includes('adiantamento') ? (
                         <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                           t.status === 'completed' 
                             ? 'bg-emerald-100 text-emerald-700' 
                             : 'bg-blue-100 text-blue-700'
                         }`}>
                           {t.status === 'completed' ? 'Realizado' : 'Aguardando compensação'}
                         </span>
                      ) : (
                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                         t.status === 'completed' 
                           ? 'bg-emerald-100 text-emerald-700' 
                           : t.status === 'partial'
                           ? 'bg-blue-100 text-blue-700'
                           : 'bg-yellow-100 text-yellow-700'
                       }`}>
                         {t.status === 'completed' ? 'Liquidado' : t.status === 'partial' ? 'Parcial' : 'Pendente'}
                       </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(t)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
