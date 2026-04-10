import React, { useState } from 'react';
import { Plus, Search, Filter, Landmark, CheckCircle2, AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTransactions } from '@/src/context/TransactionContext';

interface FinancialAdvancesProps {
  initialFilter?: 'all' | 'customer' | 'supplier';
}

export const FinancialAdvances: React.FC<FinancialAdvancesProps> = ({ initialFilter = 'all' }) => {
  const { transactions, updateTransaction, openModal } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>(initialFilter);

  // Sync filterType if initialFilter changes
  React.useEffect(() => {
    if (initialFilter) {
      setFilterType(initialFilter);
    }
  }, [initialFilter]);

  const advances = transactions.filter(t => {
    const isAdvance = t.transactionTypeId?.includes('adiantamento');
    if (!isAdvance) return false;

    if (filterType === 'customer') return t.type === 'income';
    if (filterType === 'supplier') return t.type === 'expense';
    return true;
  }).filter(t => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      t.description.toLowerCase().includes(search) ||
      (t.customerName && t.customerName.toLowerCase().includes(search)) ||
      t.value.toString().includes(search)
    );
  });

  const handleComplete = async (id: number) => {
    if (window.confirm('Deseja marcar este adiantamento como realizado/compensado?')) {
      await updateTransaction(id, { status: 'completed' });
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="text-blue-600" size={28} />
            Gestão de Adiantamentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe adiantamentos de clientes e a fornecedores</p>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
              onClick={() => openModal()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
            >
              <Plus size={18} />
              <span>Adicionar Conta</span>
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por descrição, cliente ou valor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
          />
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('customer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'customer' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Clientes
          </button>
          <button
            onClick={() => setFilterType('supplier')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'supplier' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Fornecedores
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição / Entidade</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {advances.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={40} className="text-gray-200" />
                    <p>Nenhum adiantamento encontrado.</p>
                  </div>
                </td>
              </tr>
            ) : (
              advances.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {t.type === 'income' ? (
                        <ArrowUpCircle size={16} className="text-emerald-500" />
                      ) : (
                        <ArrowDownCircle size={16} className="text-blue-500" />
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {t.type === 'income' ? 'Cliente' : 'Fornecedor'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.customerName || '---'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.value)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      t.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {t.status === 'completed' ? 'COMPENSADO' : 'A COMPENSAR'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {t.status !== 'completed' && (
                        <button 
                          onClick={() => handleComplete(t.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Marcar como Compensado"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => openModal(t)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Search size={18} />
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
  );
};
