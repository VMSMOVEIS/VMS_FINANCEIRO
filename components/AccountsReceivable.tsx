import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, FileText } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

interface AccountsReceivableProps {
  initialTab?: 'geral' | 'adiantamentos';
}

export const AccountsReceivable: React.FC<AccountsReceivableProps> = ({ initialTab = 'geral' }) => {
  const { transactions, deleteTransaction, openModal } = useTransactions();
  const [activeTab, setActiveTab] = useState<'geral' | 'adiantamentos'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const receivables = transactions.flatMap(t => 
    t.payments
      .filter(p => {
        if (activeTab === 'adiantamentos') {
           return t.transactionTypeId === 'adiantamento_cliente';
        }
        // General: Income payments that are specifically marked for Accounts Receivable
        // OR transactions explicitly typed as 'duplicata_receber' (to keep them visible after payment)
        return t.type === 'income' && t.transactionTypeId !== 'transferencia' && (p.destination === 'Contas a Receber' || t.transactionTypeId === 'duplicata_receber');
      })
      .map(p => ({
        ...p,
        transactionDescription: t.description,
        transactionDate: t.date,
        transactionId: t.id,
        category: t.category,
        customer: t.customerName || 'Cliente',
        orderNumber: t.orderNumber || t.documentType
      }))
  );

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contas a Receber</h1>
          <p className="text-gray-500">Acompanhe suas receitas e faturamentos</p>
        </div>
        <button 
          onClick={() => openModal({
            type: 'income',
            transactionTypeId: 'duplicata_receber',
            date: new Date().toISOString().split('T')[0],
            value: 0,
            description: '',
            payments: [],
            category: '',
            documentType: 'NF',
            status: 'pending'
          } as any)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Adicionar Conta</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('geral')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'geral'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('adiantamentos')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'adiantamentos'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Adiantamentos
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, nota fiscal ou valor..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <th className="px-6 py-3 w-10">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              </th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Nº Doc/Pedido</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Vencimento</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receivables.length === 0 ? (
               <tr>
                 <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                   Nenhum registro encontrado.
                 </td>
               </tr>
            ) : (
              receivables.map((item) => (
                <tr key={`${item.transactionId}-${item.id}`} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.customer}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      {item.orderNumber || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div>{item.transactionDescription}</div>
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.dueDate.split('-').reverse().join('/')}</td>
                  <td className="px-6 py-4 font-medium text-emerald-600">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'completed' ? 'Recebido' : 'A Receber'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item.transactionId)}
                        className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.transactionId)}
                        className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        title="Excluir"
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
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Mostrando {receivables.length} registro(s)</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Anterior</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};
