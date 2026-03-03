import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useTransactions } from '../src/context/TransactionContext';

export const FinancialDashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const [filterType, setFilterType] = useState('this-month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter(t => {
      // Fix timezone issue by treating the date string as local time or appending time
      // Assuming t.date is YYYY-MM-DD
      const [year, month, day] = t.date.split('-').map(Number);
      const tDate = new Date(year, month - 1, day);
      
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();

      switch (filterType) {
        case 'this-month':
          return tYear === currentYear && tMonth === currentMonth;
        case 'last-month':
           const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
           return tYear === lastMonthDate.getFullYear() && tMonth === lastMonthDate.getMonth();
        case 'this-year':
          return tYear === currentYear;
        case 'month':
          return tYear === currentYear && tMonth === parseInt(selectedMonth);
        case 'custom':
          if (!customRange.start || !customRange.end) return true;
          return t.date >= customRange.start && t.date <= customRange.end;
        default:
          return true;
      }
    });
  }, [transactions, filterType, selectedMonth, customRange]);

  // --- KPI Calculations ---

  // 1. Receita Total (Total Revenue) - Sum of all 'income' transactions
  const totalRevenue = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income' && t.transactionTypeId !== 'transferencia')
      .reduce((sum, t) => sum + t.value, 0);
  }, [filteredTransactions]);

  // 2. Despesas (Total Expenses) - Sum of all 'expense' transactions
  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense' && t.transactionTypeId !== 'transferencia')
      .reduce((sum, t) => sum + t.value, 0);
  }, [filteredTransactions]);

  // 3. EBITDA (Simplified: Revenue - Expenses)
  const ebitda = totalRevenue - totalExpenses;
  const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  // 4. Contas a Pagar (Accounts Payable) - Pending expenses destined for Accounts Payable
  const accountsPayable = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .flatMap(t => t.payments)
      .filter(p => p.destination === 'Contas a Pagar')
      .reduce((sum, p) => sum + p.value, 0);
  }, [filteredTransactions]);
  
  const pendingPayablesCount = useMemo(() => {
      return filteredTransactions
      .filter(t => t.type === 'expense')
      .flatMap(t => t.payments)
      .filter(p => p.destination === 'Contas a Pagar').length;
  }, [filteredTransactions]);

  // --- Chart Data Preparation ---

  // 1. Receitas vs Despesas (Monthly)
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; receita: number; despesa: number }> = {};
    
    filteredTransactions.forEach(t => {
      const [year, month, day] = t.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Unique key YYYY-M
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

      if (!data[monthKey]) {
        data[monthKey] = { name: monthName, receita: 0, despesa: 0 };
      }

      if (t.transactionTypeId === 'transferencia') return;

      if (t.type === 'income') {
        data[monthKey].receita += t.value;
      } else {
        data[monthKey].despesa += t.value;
      }
    });

    // Sort by date and take last 6 months (or all if less)
    return Object.entries(data)
        .sort(([keyA], [keyB]) => {
            const [yearA, monthA] = keyA.split('-').map(Number);
            const [yearB, monthB] = keyB.split('-').map(Number);
            return yearA - yearB || monthA - monthB;
        })
        .map(([, value]) => value);
  }, [filteredTransactions]);

  // 2. Fluxo de Caixa (Daily Balance for the last 7 days with activity)
  const cashFlowData = useMemo(() => {
    const dailyBalances: Record<string, number> = {};
    
    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    sortedTransactions.forEach(t => {
        // Only count completed payments for cash flow
        const completedAmount = t.payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.value, 0);

        if (completedAmount > 0) {
             if (t.transactionTypeId === 'transferencia') {
                 // Transfers are neutral for consolidated balance
             } else if (t.type === 'income') {
                runningBalance += completedAmount;
            } else {
                runningBalance -= completedAmount;
            }
            // Update the balance for this day (overwriting previous updates for the same day to get end-of-day balance)
            // Note: This logic simplifies "running balance" to be per transaction date. 
            // Ideally, we'd iterate through all days in a range.
            dailyBalances[t.date] = runningBalance;
        }
    });

    // Convert to array and take last 7 entries
    return Object.entries(dailyBalances)
        .map(([date, valor]) => ({
            name: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
            fullDate: date,
            valor
        }))
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
        .slice(-7);

  }, [filteredTransactions]);

  // --- Recent Transactions ---
  const recentTransactions = useMemo(() => {
      return [...filteredTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(t => ({
            desc: t.description,
            cat: t.category,
            date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            status: t.status === 'completed' ? (t.transactionTypeId === 'transferencia' ? 'Transferido' : (t.type === 'income' ? 'Recebido' : 'Pago')) : (t.status === 'partial' ? 'Parcial' : 'Pendente'),
            val: `${t.transactionTypeId === 'transferencia' ? '⇄' : (t.type === 'income' ? '+' : '-')} R$ ${t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            type: t.transactionTypeId === 'transferencia' ? 'transfer' : (t.type === 'income' ? 'in' : 'out')
        }));
  }, [filteredTransactions]);


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h1>
          <p className="text-gray-500">Visão geral da saúde financeira da empresa</p>
        </div>
        <div className="flex gap-2 items-center">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="this-month">Este Mês</option>
            <option value="last-month">Último Mês</option>
            <option value="this-year">Este Ano</option>
            <option value="month">Mês Específico</option>
            <option value="custom">Personalizado</option>
          </select>

          {filterType === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          )}

          {filterType === 'custom' && (
            <div className="flex gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium flex items-center">
              +12.5%
            </span>
            <span className="text-gray-500 ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Despesas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium flex items-center">
              +4.2%
            </span>
            <span className="text-gray-500 ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">EBITDA</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`${ebitda >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium flex items-center`}>
              {ebitdaMargin.toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-2">Margem</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Contas a Pagar (Pendente)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {accountsPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{pendingPayablesCount} títulos pendentes</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Receitas vs Despesas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="despesa" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa (Saldo Acumulado)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Saldo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Transações Recentes</h3>
          <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhuma transação registrada.</td>
                  </tr>
              ) : (
                  recentTransactions.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.desc}</td>
                      <td className="px-6 py-4 text-gray-500">{item.cat}</td>
                      <td className="px-6 py-4 text-gray-500">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Pago' || item.status === 'Recebido' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : item.status === 'Parcial'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${item.type === 'in' ? 'text-emerald-600' : (item.type === 'transfer' ? 'text-blue-600' : 'text-red-600')}`}>
                        {item.val}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
