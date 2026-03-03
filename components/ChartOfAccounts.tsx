import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { AccountPlan } from '../services/financialData';
import { useTransactions } from '../src/context/TransactionContext';

export const ChartOfAccounts: React.FC = () => {
  const { accountPlans, addAccountPlan, deleteAccountPlan } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<AccountPlan>>({
    type: 'despesa',
    code: '',
    name: ''
  });

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.code && newAccount.type) {
      await addAccountPlan({
        name: newAccount.name,
        code: newAccount.code,
        type: newAccount.type as 'receita' | 'despesa'
      });
      setIsModalOpen(false);
      setNewAccount({ type: 'despesa', code: '', name: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta conta?')) {
      await deleteAccountPlan(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plano de Contas</h1>
          <p className="text-gray-500">Estruture as categorias financeiras da sua empresa</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Nova Conta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
            <ArrowUpCircle className="text-emerald-600" size={20} />
            <h3 className="font-bold text-emerald-800">Receitas</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {accountPlans.filter(a => a.type === 'receita').map(account => (
              <div key={account.id} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{account.code}</span>
                  <span className="font-medium text-gray-800">{account.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(account.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {accountPlans.filter(a => a.type === 'receita').length === 0 && (
              <div className="p-8 text-center text-gray-400">Nenhuma conta de receita cadastrada.</div>
            )}
          </div>
        </div>

        {/* Despesas Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <ArrowDownCircle className="text-red-600" size={20} />
            <h3 className="font-bold text-red-800">Despesas</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {accountPlans.filter(a => a.type === 'despesa').map(account => (
              <div key={account.id} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{account.code}</span>
                  <span className="font-medium text-gray-800">{account.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(account.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
             {accountPlans.filter(a => a.type === 'despesa').length === 0 && (
              <div className="p-8 text-center text-gray-400">Nenhuma conta de despesa cadastrada.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Nova Conta</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setNewAccount({...newAccount, type: 'receita'})}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                      newAccount.type === 'receita' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccount({...newAccount, type: 'despesa'})}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                      newAccount.type === 'despesa' 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código (Ex: 1.01)</label>
                <input 
                  type="text" 
                  required
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                <input 
                  type="text" 
                  required
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Ex: Vendas de Produtos"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
