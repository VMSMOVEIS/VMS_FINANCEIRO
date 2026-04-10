import React, { useState } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Search, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

interface OperationalHistoryProps {
  type: 'sales' | 'purchases';
}

export const OperationalHistory: React.FC<OperationalHistoryProps> = ({ type }) => {
  const { transactions, openModal, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const isSales = type === 'sales';
  
  const handleEdit = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) openModal(transaction);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Deseja realmente excluir este registro?')) {
      await deleteTransaction(id);
    }
  };
  
  const filteredData = transactions
    .filter(t => isSales ? t.transactionTypeId === 'venda' : t.transactionTypeId === 'compra')
    .map(t => ({
      id: t.id,
      date: t.date,
      orderNumber: t.orderNumber || '-',
      description: t.description,
      clientOrSupplier: isSales ? (t.customerName || 'Cliente não informado') : (t.customerName || 'Fornecedor não informado'),
      value: t.value,
      type: isSales ? 'sale' : 'purchase',
      status: t.status
    }))
    .filter(item => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item.clientOrSupplier.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.orderNumber.toLowerCase().includes(search) ||
        item.value.toString().includes(search)
      );
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isSales ? 'Histórico de Vendas' : 'Histórico de Compras'}
          </h1>
          <p className="text-gray-500">
            {isSales ? 'Acompanhe todas as vendas realizadas' : 'Acompanhe todas as compras realizadas'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Buscar por ${isSales ? 'cliente' : 'fornecedor'}, pedido ou valor...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Nº Pedido</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">{isSales ? 'Cliente' : 'Fornecedor'}</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                <td className="px-6 py-4 text-gray-500">{item.date.split('-').reverse().join('/')}</td>
                <td className="px-6 py-4 font-mono text-xs bg-gray-50 px-2 py-1 rounded w-fit">{item.orderNumber}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{item.description}</td>
                <td className="px-6 py-4 text-gray-500">{item.clientOrSupplier}</td>
                <td className={`px-6 py-4 font-bold ${isSales ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isSales ? '+' : '-'} R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : item.status === 'partial'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'completed' ? 'Concluído' : item.status === 'partial' ? 'Parcial' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(item.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
