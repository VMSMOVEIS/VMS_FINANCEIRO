import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

export const Transactions: React.FC = () => {
  const { transactions, openModal, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.customerName && t.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.orderNumber && t.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Receitas</p>
            <p className="text-xl font-bold text-gray-900">
              R$ {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Despesas</p>
            <p className="text-xl font-bold text-gray-900">
              R$ {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Saldo Período</p>
            <p className="text-xl font-bold text-gray-900">
              R$ {(
                transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0) -
                transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0)
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
            <Download size={18} />
            <span>Exportar</span>
          </button>
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
                      <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : t.status === 'partial'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.status === 'completed' ? 'Liquidado' : t.status === 'partial' ? 'Parcial' : 'Pendente'}
                      </span>
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
