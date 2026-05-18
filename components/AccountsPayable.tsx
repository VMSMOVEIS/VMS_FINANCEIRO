import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, FileText, Check } from 'lucide-react';
import { useTransactions } from '@/src/context/TransactionContext';

export const AccountsPayable: React.FC = () => {
  const { transactions, deleteTransaction, openModal } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');

  const payables = transactions.flatMap(t => 
    t.payments
      .filter(p => {
        // General: Expense payments that are specifically marked for Accounts Payable
        // OR transactions explicitly typed as 'duplicata_pagar' (to keep them visible after payment)
        // Exclude advances (adiantamento_fornecedor)
        return t.type === 'expense' && 
               t.transactionTypeId !== 'transferencia' && 
               t.transactionTypeId !== 'adiantamento_fornecedor' &&
               (p.destination === 'Contas a Pagar' || t.transactionTypeId === 'duplicata_pagar');
      })
      .map(p => ({
        ...p,
        transactionDescription: t.description,
        transactionDate: t.date,
        transactionId: t.id,
        category: t.category,
        supplier: t.customerName || 'Fornecedor',
        orderNumber: t.orderNumber || t.documentType,
        transactionStatus: t.status
      }))
  ).filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.supplier.toLowerCase().includes(search) ||
      item.transactionDescription.toLowerCase().includes(search) ||
      (item.orderNumber && item.orderNumber.toLowerCase().includes(search)) ||
      item.value.toString().includes(search)
    );
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      await deleteTransaction(id);
    }
  };

  const handleEdit = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) openModal(transaction);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Contas a Pagar</h1>
          <p className="text-gray-500 text-sm">Gerencie seus compromissos financeiros</p>
        </div>
        <button 
          onClick={() => openModal({
            type: 'expense',
            transactionTypeId: 'duplicata_pagar',
            date: new Date().toISOString().split('T')[0],
            value: 0,
            description: '',
            payments: [],
            category: '',
            documentType: 'NF',
            status: 'pending'
          } as any)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-bold text-sm"
        >
          <Plus size={18} />
          <span>Adicionar Conta</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Table container with horizontal scroll */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 text-xs">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </th>
                <th className="px-4 py-3">Fornecedor</th>
                <th className="px-4 py-3">Nº Doc/Pedido</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 italic">
              {payables.length === 0 ? (
                 <tr>
                   <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                     Nenhum registro encontrado.
                   </td>
                 </tr>
              ) : (
                payables.map((item) => (
                  <tr key={`${item.transactionId}-${item.id}`} className="hover:bg-gray-50 group not-italic">
                    <td className="px-4 py-4 uppercase">
                      <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900 line-clamp-1">{item.supplier}</td>
                    <td className="px-4 py-4 text-gray-500">
                      <div className="flex items-center gap-1 font-mono text-xs">
                        {item.orderNumber || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      <div className="font-medium">{item.transactionDescription}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">{item.category}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-medium">{item.dueDate.split('-').reverse().join('/')}</td>
                    <td className="px-4 py-4 font-black text-gray-900">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4 uppercase">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        item.transactionStatus === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : item.transactionStatus === 'a_compensar'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {item.transactionStatus === 'completed' ? 'PAGO' : 'ABERTO'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(item.transactionId)}
                          className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.transactionId)}
                          className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
          <span>{payables.length} registro(s)</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Anterior</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};
