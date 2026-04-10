import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle, ShoppingBag, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useTransactions } from '@/src/context/TransactionContext';
import { useSales } from '@/src/context/SalesContext';
import { usePurchasing } from '@/src/context/PurchasingContext';

export const FinancialDashboard: React.FC = () => {
  const { transactions, accounts } = useTransactions();
  const { sales } = useSales();
  const { purchases } = usePurchasing();
  const [filterType, setFilterType] = useState('this-month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const isDateInSelectedRange = (dateStr: string) => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    const tDate = new Date(year, month - 1, day || 1);
    const tYear = tDate.getFullYear();
    const tMonth = tDate.getMonth();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

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
        return dateStr >= customRange.start && dateStr <= customRange.end;
      default:
        return true;
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => isDateInSelectedRange(t.date));
  }, [transactions, filterType, selectedMonth, customRange]);

  // --- KPI Calculations ---

  // 1. Entrada de Caixa (Cash Inflow) - Only completed income payments in the period
  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'completed' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);

  // 2. Saída de Caixa (Cash Outflow) - Only completed expense payments in the period
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'completed' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);

  // 3. Total de Vendas (Total Sales) - Based on Sales History
  const totalSales = useMemo(() => {
    return sales
      .filter(s => s.status !== 'cancelled' && isDateInSelectedRange(s.date))
      .reduce((sum, s) => sum + s.value, 0);
  }, [sales, filterType, selectedMonth, customRange]);

  // 4. Total de Compras (Total Purchases) - Based on Purchase History
  const totalPurchases = useMemo(() => {
    return purchases
      .filter(p => p.status !== 'cancelled' && isDateInSelectedRange(p.date))
      .reduce((sum, p) => sum + p.value, 0);
  }, [purchases, filterType, selectedMonth, customRange]);

  // 5. EBITDA (Simplified: Revenue - Expenses)
  const ebitda = totalRevenue - totalExpenses;
  const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  // 6. Contas a Receber (Accounts Receivable) - Pending income in the period
  const accountsReceivable = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);
  
  const pendingReceivablesCount = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending' && isDateInSelectedRange(p.dueDate)).length;
  }, [transactions, filterType, selectedMonth, customRange]);

  // 7. Contas a Pagar (Accounts Payable) - Pending expenses in the period
  const accountsPayable = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);
  
  const pendingPayablesCount = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'pending' && isDateInSelectedRange(p.dueDate)).length;
  }, [transactions, filterType, selectedMonth, customRange]);

  // --- Chart Data Preparation ---

  // 1. Entradas vs Saídas (Monthly)
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; receita: number; despesa: number; vendas: number; compras: number }> = {};
    
    // Process transactions
    transactions.forEach(t => {
      if (t.type === 'transfer' || t.transactionTypeId === 'transferencia') return;

      t.payments.forEach(p => {
        if (p.status !== 'completed' || !isDateInSelectedRange(p.dueDate)) return;

        const [year, month, day] = p.dueDate.split('-').map(Number);
        const pDate = new Date(year, month - 1, day || 1);
        const monthKey = `${pDate.getFullYear()}-${pDate.getMonth()}`;
        const monthName = pDate.toLocaleDateString('pt-BR', { month: 'short' });

        if (!data[monthKey]) {
          data[monthKey] = { name: monthName, receita: 0, despesa: 0, vendas: 0, compras: 0 };
        }

        if (t.type === 'income') {
          data[monthKey].receita += p.value;
        } else if (t.type === 'expense') {
          data[monthKey].despesa += p.value;
        }
      });
    });

    // Process sales
    sales.forEach(s => {
      if (!s.date || s.status === 'cancelled' || !isDateInSelectedRange(s.date)) return;
      
      const [year, month, day] = s.date.split('-').map(Number);
      const sDate = new Date(year, month - 1, day || 1);
      const monthKey = `${sDate.getFullYear()}-${sDate.getMonth()}`;
      const monthName = sDate.toLocaleDateString('pt-BR', { month: 'short' });

      if (!data[monthKey]) {
        data[monthKey] = { name: monthName, receita: 0, despesa: 0, vendas: 0, compras: 0 };
      }
      data[monthKey].vendas += s.value;
    });

    // Process purchases
    purchases.forEach(p => {
      if (!p.date || p.status === 'cancelled' || !isDateInSelectedRange(p.date)) return;

      const [year, month, day] = p.date.split('-').map(Number);
      const pDate = new Date(year, month - 1, day || 1);
      const monthKey = `${pDate.getFullYear()}-${pDate.getMonth()}`;
      const monthName = pDate.toLocaleDateString('pt-BR', { month: 'short' });

      if (!data[monthKey]) {
        data[monthKey] = { name: monthName, receita: 0, despesa: 0, vendas: 0, compras: 0 };
      }
      data[monthKey].compras += p.value;
    });

    // Sort by date
    return Object.entries(data)
        .sort(([keyA], [keyB]) => {
            const [yearA, monthA] = keyA.split('-').map(Number);
            const [yearB, monthB] = keyB.split('-').map(Number);
            return yearA - yearB || monthA - monthB;
        })
        .map(([, value]) => value);
  }, [filteredTransactions, sales, purchases, filterType, selectedMonth, customRange]);

  // 2. Fluxo de Caixa (Daily Balance for the last 7 days with activity)
  const cashFlowData = useMemo(() => {
    const dailyBalances: Record<string, number> = {};
    
    // Calculate total initial balance from all accounts
    const totalInitialBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Sort ALL transactions by date to calculate running balance correctly from the beginning
    const allSortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = totalInitialBalance;
    const balanceHistory: Record<string, number> = {};

    allSortedTransactions.forEach(t => {
        // Only count completed payments for cash flow
        const completedAmount = t.payments
            .filter(p => {
                if (p.status !== 'completed' || p.method === 'Adiantamento') return false;
                // If this payment was settled by another independent transaction, skip it here
                // to avoid double counting the cash movement
                const isSettledByOther = transactions.some(other => 
                    other.linkedTransactionId === t.id && other.linkedPaymentId === p.id
                );
                return !isSettledByOther;
            })
            .reduce((sum, p) => sum + p.value, 0);

        if (completedAmount > 0) {
             if (t.type === 'transfer') {
                 // Transfers are neutral for consolidated balance
             } else if (t.type === 'income') {
                runningBalance += completedAmount;
            } else {
                runningBalance -= completedAmount;
            }
            balanceHistory[t.date] = runningBalance;
        }
    });

    // Now filter for the last 7 days with activity from the filteredTransactions
    const activeDates = [...new Set(filteredTransactions.map(t => t.date))].sort();
    const last7Dates = activeDates.slice(-7);

    return last7Dates.map(date => ({
        name: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        fullDate: date,
        valor: balanceHistory[date] || runningBalance // Fallback to last known balance
    }));

  }, [transactions, filteredTransactions, accounts]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Vendas</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingCart className="text-emerald-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Volume total de pedidos</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Compras</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">R$ {totalPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBag className="text-orange-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Volume total de aquisições</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Entrada de Caixa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Dinheiro que entrou no caixa</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Saída de Caixa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Dinheiro que saiu do caixa</span>
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
              <p className="text-sm font-medium text-gray-500">Contas a Receber</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ {accountsReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <AlertCircle className="text-indigo-600" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{pendingReceivablesCount} títulos pendentes</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Contas a Pagar</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Entradas vs Saídas (Realizado)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                <Legend />
                <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} name="Entrada" />
                <Bar dataKey="despesa" fill="#ef4444" radius={[4, 4, 0, 0]} name="Saída" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas vs Compras (Pedidos)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                <Legend />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Vendas" />
                <Bar dataKey="compras" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Compras" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa (Saldo Acumulado)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
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
