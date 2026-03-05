import React, { useMemo } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, Wallet, Building2 } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

export const Treasury: React.FC = () => {
  const { transactions, accounts } = useTransactions();

  const accountBalances = useMemo(() => {
    const balances: Record<string, number> = {};

    // Initialize with base balances
    accounts.forEach(acc => {
      balances[acc.name] = acc.balance || 0;
    });

    transactions.forEach(t => {
      t.payments.forEach(p => {
        if (p.status === 'completed') {
          if (t.type === 'transfer') {
            // For transfers, subtract from source and add to destination
            if (p.source && balances[p.source] !== undefined) {
              balances[p.source] -= p.value;
            }
            if (p.destination && balances[p.destination] !== undefined) {
              balances[p.destination] += p.value;
            }
          } else if (t.type === 'income') {
             // For income, add to destination
             if (p.destination && balances[p.destination] !== undefined) {
               balances[p.destination] += p.value;
             }
          } else if (t.type === 'expense') {
             // For expense, subtract from destination (which is the paying account)
             if (p.destination && balances[p.destination] !== undefined) {
               balances[p.destination] -= p.value;
             }
          }
        }
      });
    });

    return balances;
  }, [transactions, accounts]);

  // Filter for completed payments to show as recent movements
  const recentMovements = transactions
            .flatMap(t => t.payments.filter(p => p.status === 'completed').map(p => ({
              ...p,
              transactionType: t.type,
              description: t.description,
              date: t.date,
            })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return <Wallet size={24} />;
      case 'bank':
        return <Landmark size={24} />;
      default:
        return <Building2 size={24} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tesouraria</h1>
          <p className="text-sm text-gray-500">Gestão de caixa e conciliação bancária</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <ArrowUpRight size={16} />
          Nova Transferência
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const balance = accountBalances[account.name] || 0;
          const color = account.color || '#10B981'; // Default emerald if no color
          
          return (
            <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
              {/* Color accent background */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110" 
                style={{ backgroundColor: color }}
              ></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="p-3 rounded-xl bg-opacity-10"
                    style={{ backgroundColor: `${color}20`, color: color }}
                  >
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{account.name}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {account.bank ? `${account.bank}` : (account.type === 'cash' ? 'Caixa Físico' : 'Investimento')}
                  </span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Ativo</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Movimentações Recentes</h3>
        <div className="space-y-4">
          {recentMovements.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Nenhuma movimentação recente.</div>
          ) : (
            recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${movement.transactionType === 'transfer' ? 'bg-blue-100 text-blue-600' : (movement.transactionType === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')}`}>
                    {movement.transactionType === 'transfer' ? <ArrowUpRight size={20} className="rotate-45" /> : (movement.transactionType === 'expense' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{movement.description}</p>
                    <p className="text-sm text-gray-500">{movement.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <div className={`font-bold ${movement.transactionType === 'transfer' ? 'text-blue-600' : (movement.transactionType === 'expense' ? 'text-red-600' : 'text-green-600')}`}>
                  {movement.transactionType === 'transfer' ? '⇄' : (movement.transactionType === 'expense' ? '-' : '+')} R$ {movement.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
