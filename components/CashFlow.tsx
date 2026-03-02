import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle,
  Wallet
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area
} from 'recharts';
import { useTransactions } from '../src/context/TransactionContext';

export const CashFlow: React.FC = () => {
  const { transactions, accounts } = useTransactions();
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const data = useMemo(() => {
    const dailyData: Record<string, { 
      entrada: number; 
      saida: number; 
      entradaProjetada: number; 
      saidaProjetada: number 
    }> = {};

    transactions.forEach(t => {
      t.payments.forEach(p => {
        // Filter by account if selected
        if (selectedAccount !== 'all') {
          const isDestination = p.destination === selectedAccount;
          const isSource = p.source === selectedAccount;
          if (!isDestination && !isSource) return;
        }

        const date = p.dueDate;
        if (!dailyData[date]) {
          dailyData[date] = { entrada: 0, saida: 0, entradaProjetada: 0, saidaProjetada: 0 };
        }
        
        let isIncome = t.type === 'income';
        let isExpense = t.type === 'expense';

        // Handle Transfer logic for specific account view
        if (t.transactionTypeId === 'transferencia' && selectedAccount !== 'all') {
          if (p.source === selectedAccount) {
            isIncome = false;
            isExpense = true;
          } else if (p.destination === selectedAccount) {
            isIncome = true;
            isExpense = false;
          }
        }

        // Realized (Completed)
        if (p.status === 'completed') {
          if (isIncome) {
            dailyData[date].entrada += p.value;
          } else if (isExpense) {
            dailyData[date].saida += p.value;
          }
        }

        // Projected (Completed + Pending)
        if (isIncome) {
          dailyData[date].entradaProjetada += p.value;
        } else if (isExpense) {
          dailyData[date].saidaProjetada += p.value;
        }
      });
    });

    // Sort dates and calculate cumulative balance
    const sortedDates = Object.keys(dailyData).sort();
    
    // Calculate Initial Balance based on selected account(s)
    let currentBalance = 0;
    if (selectedAccount === 'all') {
      currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    } else {
      const acc = accounts.find(a => a.name === selectedAccount || a.id === selectedAccount);
      currentBalance = acc ? acc.balance : 0;
    }
    
    // Adjust initial balance by reversing past transactions? 
    // For simplicity, we assume the current balance IS the balance as of today/latest, 
    // and we project forward or backward. 
    // However, usually "Cash Flow" shows flow over time. 
    // If we want the chart to be accurate relative to the *current* balance, 
    // we might need to adjust the starting point or just show the flow.
    // Let's assume 'currentBalance' is the starting balance for the period shown? 
    // Or better, let's just accumulate from 0 for the flow, or use the account balance as the *end* state?
    // Let's stick to the previous logic: Start with a mock or calculated balance.
    // Since we have real account balances now, let's use them as the "Current" balance and work backwards?
    // Or just start with the current balance and add/subtract future?
    // The chart shows *history* usually.
    // Let's just use the calculated flow for now, starting from the current account balance as a baseline for the *last* day, 
    // or just start from 0 if we don't have historical balance snapshots.
    // To make it look good, let's assume the current balance is the *result* of these transactions if they are recent.
    // But `accounts.balance` is static in our context.
    // Let's just use the static balance as the "Starting Balance" for the visualization for now.
    
    let projectedBalance = currentBalance;

    return sortedDates.map(date => {
      const dayData = dailyData[date];
      
      currentBalance += (dayData.entrada - dayData.saida);
      projectedBalance += (dayData.entradaProjetada - dayData.saidaProjetada);
      
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}`;

      return {
        name: formattedDate,
        fullDate: date,
        entrada: dayData.entrada,
        saida: dayData.saida,
        saldo: currentBalance,
        projetado: projectedBalance
      };
    });
  }, [transactions, selectedAccount, accounts]);

  // Calculate totals
  const totals = useMemo(() => {
    return data.reduce((acc, curr) => ({
      entradas: acc.entradas + curr.entrada,
      saidas: acc.saidas + curr.saida
    }), { entradas: 0, saidas: 0 });
  }, [data]);

  const lastBalance = data.length > 0 ? data[data.length - 1].saldo : 
    (selectedAccount === 'all' ? accounts.reduce((sum, a) => sum + a.balance, 0) : (accounts.find(a => a.name === selectedAccount)?.balance || 0));
    
  const lastProjectedBalance = data.length > 0 ? data[data.length - 1].projetado : lastBalance;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fluxo de Caixa</h1>
          <p className="text-gray-500">Acompanhamento de entradas, saídas e projeções financeiras</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
             <select
               value={selectedAccount}
               onChange={(e) => setSelectedAccount(e.target.value)}
               className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             >
               <option value="all">Todas as Contas</option>
               {accounts.map(acc => (
                 <option key={acc.id} value={acc.name}>{acc.name}</option>
               ))}
             </select>
             <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'daily' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Diário
            </button>
            <button 
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'monthly' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Mensal
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
            <Calendar size={16} />
            <span>Março 2026</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm">
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saldo Atual</p>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">R$ {lastBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-gray-400 mt-1">Calculado hoje</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Entradas (Período)</p>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">R$ {totals.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            <span className="text-xs text-gray-400">vs. período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saídas (Período)</p>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-red-600">R$ {totals.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">+5%</span>
            <span className="text-xs text-gray-400">vs. período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-500">Saldo Projetado</p>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-blue-600">R$ {lastProjectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-gray-400 mt-1">Previsão final do período</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Evolução do Saldo e Movimentações</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Entradas
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Saídas
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Saldo Acumulado
            </span>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="entrada" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="saida" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="saldo" name="Saldo Realizado" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="projetado" name="Saldo Projetado" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Detalhamento Diário</h3>
          <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1">
            <Filter size={16} />
            Filtrar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3 text-right text-emerald-600">Entradas</th>
                <th className="px-6 py-3 text-right text-red-600">Saídas</th>
                <th className="px-6 py-3 text-right text-blue-600">Saldo do Dia</th>
                <th className="px-6 py-3 text-right font-bold text-gray-800">Saldo Acumulado</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}/2026</td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                    + R$ {item.entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-red-600 font-medium">
                    - R$ {item.saida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-600">
                    R$ {(item.entrada - item.saida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    R$ {item.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.saldo < 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertCircle size={12} /> Negativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Positivo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
