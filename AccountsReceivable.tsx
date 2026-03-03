import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';

export const Treasury: React.FC = () => {
  const { transactions } = useTransactions();

  // Filter for completed payments to show as recent movements
  const recentMovements = transactions
    .flatMap(t => t.payments.filter(p => p.status === 'completed').map(p => ({
      ...p,
      transactionType: t.type,
      description: t.description,
      date: t.date
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tesouraria</h1>
          <p className="text-gray-500">Gestão de caixa e conciliação bancária</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          Nova Transferência
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Banco do Brasil</p>
              <p className="text-lg font-bold text-gray-900">R$ 145.200,00</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Atualizado há 15 min</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Itaú Empresas</p>
              <p className="text-lg font-bold text-gray-900">R$ 89.450,00</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Atualizado há 2 min</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Caixa Pequeno</p>
              <p className="text-lg font-bold text-gray-900">R$ 2.300,00</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Conferido hoje</div>
        </div>
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
                  <div className={`p-2 rounded-full ${movement.transactionType === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {movement.transactionType === 'expense' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{movement.description}</p>
                    <p className="text-sm text-gray-500">{movement.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <div className={`font-bold ${movement.transactionType === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {movement.transactionType === 'expense' ? '-' : '+'} R$ {movement.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
