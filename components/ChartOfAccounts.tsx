import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, X, Landmark, ShieldCheck, BarChart3, Wallet } from 'lucide-react';
import { AccountPlan } from '../services/financialData';
import { useTransactions } from '@/src/context/TransactionContext';

export const ChartOfAccounts: React.FC = () => {
  const { accountPlans, addAccountPlan, deleteAccountPlan, updateAccountPlan, resetAccountPlans } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<AccountPlan & { level: 'grupo' | 'subgrupo' | 'sintetica' | 'analitica' }>>({
    type: 'ativo',
    code: '',
    name: '',
    level: 'analitica'
  });

  const generateNextCode = (type: 'ativo' | 'passivo' | 'receita' | 'despesa', level: string, parentCode?: string) => {
    const prefixMap = {
      ativo: '1',
      passivo: '2',
      receita: '4',
      despesa: '5'
    };
    const prefix = prefixMap[type];
    
    if (level === 'grupo') {
      const groups = accountPlans.filter(a => a.code.split('.').length === 1 && a.type === type);
      if (groups.length === 0) return prefix;
      const lastCode = Math.max(...groups.map(g => parseInt(g.code)));
      return (lastCode + 1).toString();
    }

    if (!parentCode) {
      // Find a default parent if none provided
      const possibleParents = accountPlans.filter(a => {
        const parts = a.code.split('.');
        if (level === 'subgrupo') return parts.length === 1 && a.type === type;
        if (level === 'sintetica') return parts.length === 2 && a.type === type;
        if (level === 'analitica') return parts.length === 3 && a.type === type;
        return false;
      });
      if (possibleParents.length > 0) {
        parentCode = possibleParents[0].code;
      } else {
        return '';
      }
    }

    const children = accountPlans.filter(a => {
      const parts = a.code.split('.');
      const parentParts = parentCode!.split('.');
      return a.code.startsWith(parentCode + '.') && parts.length === parentParts.length + 1;
    });

    if (children.length === 0) {
      return `${parentCode}.${level === 'subgrupo' ? '1' : '01'}`;
    }

    const lastPart = Math.max(...children.map(c => {
      const parts = c.code.split('.');
      return parseInt(parts[parts.length - 1]);
    }));

    const nextPart = (lastPart + 1).toString();
    return `${parentCode}.${level === 'subgrupo' ? nextPart : nextPart.padStart(2, '0')}`;
  };

  const handleTypeChange = (type: 'ativo' | 'passivo' | 'receita' | 'despesa') => {
    const nextCode = generateNextCode(type, newAccount.level || 'analitica');
    setNewAccount({ ...newAccount, type, code: nextCode });
  };

  const handleLevelChange = (level: 'grupo' | 'subgrupo' | 'sintetica' | 'analitica') => {
    const nextCode = generateNextCode(newAccount.type || 'ativo', level);
    setNewAccount({ ...newAccount, level, code: nextCode });
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.code && newAccount.type) {
      if (editingId) {
        await updateAccountPlan(editingId, {
            name: newAccount.name,
            code: newAccount.code,
            type: newAccount.type as any,
            level: newAccount.level as any
        });
      } else {
        await addAccountPlan({
            name: newAccount.name,
            code: newAccount.code,
            type: newAccount.type as any,
            level: newAccount.level as any
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setNewAccount({ type: 'ativo', code: '', name: '' });
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

  const renderAccountList = (prefix: string) => {
    const accounts = accountPlans
      .filter(a => a.code.startsWith(prefix))
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    
    return (
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {accounts.map(account => {
          const isHeader = account.code.split('.').length <= 2;
          return (
            <div key={account.id} className={`p-3 flex justify-between items-center hover:bg-gray-50 group ${isHeader ? 'bg-gray-50/50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isHeader ? 'bg-gray-200 text-gray-700 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                  {account.code}
                </span>
                <span className={`${isHeader ? 'font-bold text-gray-900' : 'text-gray-700 text-sm ml-2'}`}>
                  {account.name}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(account)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(account.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm italic">Nenhuma conta cadastrada.</div>
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
        <div className="flex gap-3">
          <button 
            onClick={resetAccountPlans}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Restaurar Padrão Profissional
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingId(null);
              const nextCode = generateNextCode('ativo', 'analitica');
              setNewAccount({ type: 'ativo', code: nextCode, name: '', level: 'analitica' });
            }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 1. ATIVO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Wallet className="text-blue-600" size={20} />
            <h3 className="font-bold text-blue-800">1. Ativo</h3>
          </div>
          {renderAccountList('1')}
        </div>

        {/* 2. PASSIVO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
            <ShieldCheck className="text-purple-600" size={20} />
            <h3 className="font-bold text-purple-800">2. Passivo</h3>
          </div>
          {renderAccountList('2')}
        </div>

        {/* 3. PATRIMÔNIO LÍQUIDO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
            <Landmark className="text-indigo-600" size={20} />
            <h3 className="font-bold text-indigo-800">3. Patrimônio Líquido</h3>
          </div>
          {renderAccountList('3')}
        </div>

        {/* 4. RECEITAS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
            <ArrowUpCircle className="text-emerald-600" size={20} />
            <h3 className="font-bold text-emerald-800">4. Receitas</h3>
          </div>
          {renderAccountList('4')}
        </div>

        {/* 5. CUSTOS DE PRODUÇÃO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
            <BarChart3 className="text-orange-600" size={20} />
            <h3 className="font-bold text-orange-800">5. Custos de Produção</h3>
          </div>
          {renderAccountList('5')}
        </div>

        {/* 6. DESPESAS OPERACIONAIS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <ArrowDownCircle className="text-red-600" size={20} />
            <h3 className="font-bold text-red-800">6. Despesas Operacionais</h3>
          </div>
          {renderAccountList('6')}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Natureza Contábil</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('ativo')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      newAccount.type === 'ativo' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    1. Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('passivo')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      newAccount.type === 'passivo' 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    2. Passivo/PL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('receita')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      newAccount.type === 'receita' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    4. Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('despesa')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      newAccount.type === 'despesa' 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    5/6. Custo/Despesa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível da Conta</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['grupo', 'subgrupo', 'sintetica', 'analitica'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelChange(lvl)}
                      className={`px-2 py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                        newAccount.level === lvl 
                          ? 'bg-gray-800 text-white border-gray-800 shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {newAccount.level !== 'grupo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conta Pai</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                    onChange={(e) => {
                      const parentCode = e.target.value;
                      const nextCode = generateNextCode(newAccount.type || 'ativo', newAccount.level || 'analitica', parentCode);
                      setNewAccount({ ...newAccount, code: nextCode });
                    }}
                    value={accountPlans.find(p => newAccount.code?.startsWith(p.code + '.'))?.code || ''}
                  >
                    <option value="">Selecione a conta pai...</option>
                    {accountPlans
                      .filter(p => {
                        const parts = p.code.split('.');
                        if (newAccount.level === 'subgrupo') return parts.length === 1 && p.type === newAccount.type;
                        if (newAccount.level === 'sintetica') return parts.length === 2 && p.type === newAccount.type;
                        if (newAccount.level === 'analitica') return parts.length === 3 && p.type === newAccount.type;
                        return false;
                      })
                      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
                      .map(p => (
                        <option key={p.id} value={p.code}>{p.code} - {p.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input 
                    type="text" 
                    required
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-mono"
                    placeholder="Ex: 1.1.01"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                  <input 
                    type="text" 
                    required
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    placeholder="Ex: Banco Conta Movimento"
                  />
                </div>
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
