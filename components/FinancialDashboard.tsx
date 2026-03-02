import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useTransactions } from '../src/context/TransactionContext';

export const FinancialDashboard: React.FC = () => {
  const { transactions } = useTransactions();

  // --- KPI Calculations ---

  // 1. Receita Total (Total Revenue) - Sum of all 'income' transactions
  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
  }, [transactions]);

  // 2. Despesas (Total Expenses) - Sum of all 'expense' transactions
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
  }, [transactions]);

  // 3. EBITDA (Simplified: Revenue - Expenses)
  const ebitda = totalRevenue - totalExpenses;
  const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  // 4. Contas a Pagar (Accounts Payable) - Pending expenses
  const accountsPayable = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions]);
  
  const pendingPayablesCount = useMemo(() => {
      return transactions
      .filter(t => t.type === 'expense')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending').length;
  }, [transactions]);

  // --- Chart Data Preparation ---

  // 1. Receitas vs Despesas (Monthly)
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; receita: number; despesa: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Unique key YYYY-M
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

      if (!data[monthKey]) {
        data[monthKey] = { name: monthName, receita: 0, despesa: 0 };
      }

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
  }, [transactions]);

  // 2. Fluxo de Caixa (Daily Balance for the last 7 days with activity)
  const cashFlowData = useMemo(() => {
    const dailyBalances: Record<string, number> = {};
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    sortedTransactions.forEach(t => {
        // Only count completed payments for cash flow
        const completedAmount = t.payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.value, 0);

        if (completedAmount > 0) {
             if (t.type === 'income') {
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

  }, [transactions]);

  // --- Recent Transactions ---
  const recentTransactions = useMemo(() => {
      return [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(t => ({
            desc: t.description,
            cat: t.category,
            date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            status: t.status === 'completed' ? (t.type === 'income' ? 'Recebido' : 'Pago') : (t.status === 'partial' ? 'Parcial' : 'Pendente'),
            val: `${t.type === 'income' ? '+' : '-'} R$ ${t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            type: t.type === 'income' ? 'in' : 'out'
        }));
  }, [transactions]);


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h1>
          <p className="text-gray-500">Visão geral da saúde financeira da empresa</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Este Mês</option>
            <option>Último Mês</option>
            <option>Este Ano</option>
          </select>
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
                      <td className={`px-6 py-4 text-right font-medium ${item.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
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
