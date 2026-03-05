import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { AccountPlan } from '../services/financialData';
import { useTransactions } from '../src/context/TransactionContext';

export const ChartOfAccounts: React.FC = () => {
  const { accountPlans, addAccountPlan, deleteAccountPlan, updateAccountPlan } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<AccountPlan>>({
    type: 'despesa',
    code: '',
    name: ''
  });

  const generateNextCode = (type: 'receita' | 'despesa') => {
    const prefix = type === 'receita' ? '1' : '2';
    const accounts = accountPlans.filter(a => a.type === type);
    
    if (accounts.length === 0) return `${prefix}.01`;
    
    const codes = accounts.map(a => {
      const parts = a.code.split('.');
      return parseInt(parts[1] || '0');
    });
    const maxCode = Math.max(...codes);
    return `${prefix}.${String(maxCode + 1).padStart(2, '0')}`;
  };

  const handleTypeChange = (type: 'receita' | 'despesa') => {
    if (editingId) {
        // If editing, we generally don't want to change the type/code logic automatically 
        // unless we want to allow moving accounts between types, which implies code change.
        // For simplicity, let's allow it but regenerate code.
        const nextCode = generateNextCode(type);
        setNewAccount({ ...newAccount, type, code: nextCode });
    } else {
        const nextCode = generateNextCode(type);
        setNewAccount({ ...newAccount, type, code: nextCode });
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.code && newAccount.type) {
      if (editingId) {
        await updateAccountPlan(editingId, {
            name: newAccount.name,
            code: newAccount.code,
            type: newAccount.type as 'receita' | 'despesa'
        });
      } else {
        await addAccountPlan({
            name: newAccount.name,
            code: newAccount.code,
            type: newAccount.type as 'receita' | 'despesa'
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setNewAccount({ type: 'despesa', code: '', name: '' });
    }
  };

  const handleEdit = (account: AccountPlan) => {
      setEditingId(account.id);
      setNewAccount({
          type: account.type,
          code: account.code,
          name: account.name
      });
      setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta conta?')) {
      await deleteAccountPlan(id);
    }
  };

  const renderAccountList = (type: 'receita' | 'despesa') => {
    const accounts = accountPlans.filter(a => a.type === type);
    
    return (
      <div className="divide-y divide-gray-100">
        {accounts.map(account => (
          <div key={account.id} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{account.code}</span>
              <span className="font-bold text-gray-800">{account.name}</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(account)}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
              >
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
        {accounts.length === 0 && (
          <div className="p-8 text-center text-gray-400">Nenhuma conta de {type} cadastrada.</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plano de Contas</h1>
          <p className="text-gray-500">Estruture as categorias financeiras da sua empresa</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            const nextCode = generateNextCode('despesa');
            setNewAccount({ type: 'despesa', code: nextCode, name: '' });
          }}
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
          {renderAccountList('receita')}
        </div>

        {/* Despesas Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <ArrowDownCircle className="text-red-600" size={20} />
            <h3 className="font-bold text-red-800">Despesas</h3>
          </div>
          {renderAccountList('despesa')}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Conta' : 'Nova Conta'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Natureza</label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('receita')}
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
                    onClick={() => handleTypeChange('despesa')}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input 
                  type="text" 
                  required
                  readOnly
                  value={newAccount.code}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta / Categoria</label>
                <input 
                  type="text" 
                  required
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Ex: Receita de Vendas"
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
                  {editingId ? 'Atualizar Conta' : 'Salvar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
