import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle, ShoppingBag, ShoppingCart, 
  ArrowUpRight, ArrowDownRight, Scale, Building2, Clock, Wallet, FileText, 
  BarChart2, PieChart as PieChartIcon, ArrowRight, Download, MoreHorizontal,
  ChevronDown, Search, Bell, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useTransactions } from '@/src/context/TransactionContext';
import { useSales } from '@/src/context/SalesContext';
import { usePurchasing } from '@/src/context/PurchasingContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const FinancialDashboard: React.FC = () => {
  const { transactions, accounts } = useTransactions();
  const { sales } = useSales();
  const { purchases } = usePurchasing();
  const [filterType, setFilterType] = useState('this-month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const isDateInSelectedRange = (dateStr: string) => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    const tDate = new Date(year, month - 1, day || 1);
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (filterType) {
      case 'this-month':
        return year === currentYear && (month - 1) === currentMonth;
      case 'last-month':
        const lmDate = new Date(currentYear, currentMonth - 1, 1);
        return year === lmDate.getFullYear() && (month - 1) === lmDate.getMonth();
      case 'month':
        return year === selectedYear && (month - 1) === selectedMonth;
      case 'this-week':
        const weekRef = new Date();
        const first = weekRef.getDate() - weekRef.getDay() + (weekRef.getDay() === 0 ? -6 : 1);
        const monday = new Date(new Date(weekRef).setDate(first));
        monday.setHours(0,0,0,0);
        const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
        sunday.setHours(23,59,59,999);
        return tDate >= monday && tDate <= sunday;
      case 'this-year':
        return year === currentYear;
      case 'last-year':
        return year === currentYear - 1;
      case 'quarterly':
        const currentQuarter = Math.floor(currentMonth / 3);
        const tQuarter = Math.floor((month - 1) / 3);
        return year === currentYear && tQuarter === currentQuarter;
      case 'semiannually':
        const currentSemester = Math.floor(currentMonth / 6);
        const tSemester = Math.floor((month - 1) / 6);
        return year === currentYear && tSemester === currentSemester;
      case 'custom':
        if (!customRange.start || !customRange.end) return true;
        return dateStr >= customRange.start && dateStr <= customRange.end;
      case 'all':
        return true;
      default:
        return true;
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => isDateInSelectedRange(t.date));
  }, [transactions, filterType, selectedMonth, customRange]);

  // --- KPI Calculations ---

  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'completed' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.transactionTypeId !== 'transferencia')
      .flatMap(t => t.payments)
      .filter(p => p.status === 'completed' && isDateInSelectedRange(p.dueDate))
      .reduce((sum, p) => sum + p.value, 0);
  }, [transactions, filterType, selectedMonth, customRange]);

  const liquidResult = totalRevenue - totalExpenses;
  const saldoCaixa = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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

  const monthlyBarData = useMemo(() => {
    // Determine granularity based on filter
    const data: Record<string, { name: string, entradas: number, saidas: number }> = {};
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      let label = '';
      
      if (filterType.includes('year') || filterType === 'all' || filterType === 'semiannually') {
        label = date.toLocaleDateString('pt-BR', { month: 'short' });
      } else if (filterType.includes('month') || filterType === 'quarterly' || filterType === 'custom') {
        // Group by day for more detailed month view
        label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      } else {
        label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      }

      if (!data[label]) {
        data[label] = { name: label, entradas: 0, saidas: 0 };
      }

      if (t.type === 'income') data[label].entradas += t.value;
      if (t.type === 'expense') data[label].saidas += t.value;
    });

    const result = Object.values(data);
    
    if (result.length === 0) {
      return [
        { name: 'Sem dados', entradas: 0, saidas: 0 }
      ];
    }

    return result.sort((a, b) => {
        // Basic sort if labels are short months or dates
        return 0; // Keeping original order of insertion/discovery for now
    });
  }, [filteredTransactions, filterType]);

  const accumulatedCashFlow = useMemo(() => {
    const data: { name: string, valor: number }[] = [];
    let currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Sort transactions to calculate flow correctly
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = currentBalance - filteredTransactions.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.value : -t.value);
    }, 0);

    sorted.forEach(t => {
      runningBalance += (t.type === 'income' ? t.value : -t.value);
      data.push({
        name: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        valor: runningBalance
      });
    });

    if (data.length === 0) {
        return [{ name: 'Sem dados', valor: currentBalance }];
    }

    // Limit points for chart readability
    if (data.length > 20) {
        const step = Math.ceil(data.length / 15);
        return data.filter((_, i) => i % step === 0);
    }

    return data;
  }, [filteredTransactions, accounts]);

  const categoryRevenue = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'income' && isDateInSelectedRange(t.date))
      .forEach(t => {
        const cat = t.category || 'Outros';
        categories[cat] = (categories[cat] || 0) + t.value;
      });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [transactions, filterType]);

  const categoryExpenses = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && isDateInSelectedRange(t.date))
      .forEach(t => {
        const cat = t.category || 'Outros';
        categories[cat] = (categories[cat] || 0) + t.value;
      });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [transactions, filterType]);

  const recentTransactions = useMemo(() => {
      return [...filteredTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(t => ({
            id: t.id,
            desc: t.description,
            cat: t.type === 'income' ? 'Receitas' : 'Despesas',
            date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            status: t.status === 'completed' ? 'Recebido' : 'Pendente',
            statusColor: t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700',
            val: t.value,
            type: t.type
        }));
  }, [filteredTransactions]);

  const dateRangeLabel = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    switch (filterType) {
      case 'this-month': {
        const start = new Date(currentYear, currentMonth, 1);
        const end = new Date(currentYear, currentMonth + 1, 0);
        return `${formatDate(start)} - ${formatDate(end)}/${currentYear}`;
      }
      case 'last-month': {
        const start = new Date(currentYear, currentMonth - 1, 1);
        const end = new Date(currentYear, currentMonth, 0);
        return `${formatDate(start)} - ${formatDate(end)}/${start.getFullYear()}`;
      }
      case 'month': {
        const start = new Date(selectedYear, selectedMonth, 1);
        const end = new Date(selectedYear, selectedMonth + 1, 0);
        return `${formatDate(start)} - ${formatDate(end)}/${selectedYear}`;
      }
      case 'this-week': {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
        const monday = new Date(new Date(curr).setDate(first));
        const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
        return `${formatDate(monday)} - ${formatDate(sunday)}`;
      }
      case 'this-year':
        return `01/01 - 31/12/${currentYear}`;
      case 'last-year':
        return `01/01 - 31/12/${currentYear - 1}`;
      case 'quarterly': {
        const q = Math.floor(currentMonth / 3);
        const start = new Date(currentYear, q * 3, 1);
        const end = new Date(currentYear, (q + 1) * 3, 0);
        return `${formatDate(start)} - ${formatDate(end)}`;
      }
      case 'semiannually': {
        const s = Math.floor(currentMonth / 6);
        const start = new Date(currentYear, s * 6, 1);
        const end = new Date(currentYear, (s + 1) * 6, 0);
        return `${formatDate(start)} - ${formatDate(end)}`;
      }
      case 'custom':
        if (customRange.start && customRange.end) {
          return `${customRange.start.split('-').reverse().slice(0, 2).join('/')} - ${customRange.end.split('-').reverse().slice(0, 2).join('/')}`;
        }
        return 'Período personalizado';
      case 'all':
        return 'Todo o histórico';
      default:
        return '';
    }
  }, [filterType, customRange]);

  const indicators = [
    { name: 'Margem de Contribuição', value: '32,4%', trend: '+ 2,1 p.p. vs mês anterior', trendUp: true, color: '#10b981' },
    { name: 'Índice de Liquidez Corrente', value: '1,85', trend: '- 0,15 vs mês anterior', trendUp: false, color: '#ef4444' },
    { name: 'Giro de Contas a Receber', value: '18 dias', trend: '- 2 dias vs mês anterior', trendUp: true, color: '#3b82f6' },
    { name: 'Giro de Contas a Pagar', value: '26 dias', trend: '+ 3 dias vs mês anterior', trendUp: false, color: '#10b981' },
    { name: 'Ponto de Equilíbrio', value: 'R$ 22.450,00', trend: '- 4,2% vs mês anterior', trendUp: true, color: '#8b5cf6' },
    { name: 'Necessidade de Caixa', value: 'R$ 0,00', trend: 'Estável vs mês anterior', trendUp: true, color: '#f59e0b' },
  ];

  return (
    <div className="bg-[#f8fafd] min-h-screen p-4 lg:p-8 space-y-8 font-sans">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1e293b]">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Visão geral da saúde financeira da empresa</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {filterType === 'month' && (
            <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="text-xs border-none focus:ring-0 cursor-pointer bg-transparent py-2 px-1"
              >
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="text-xs border-none focus:ring-0 cursor-pointer bg-transparent py-2 px-1"
              >
                {[2023, 2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
          {filterType === 'custom' && (
            <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm overflow-x-auto whitespace-nowrap">
              <input 
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-xs border-none focus:ring-0 cursor-pointer"
              />
              <span className="text-gray-300 text-xs">até</span>
              <input 
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-xs border-none focus:ring-0 cursor-pointer"
              />
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm min-w-0 sm:min-w-[240px]">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-500 font-medium focus:outline-none cursor-pointer flex-1 appearance-none pr-6"
              style={{ backgroundImage: 'none' }}
            >
              <option value="this-month">Este Mês</option>
              <option value="last-month">Último Mês</option>
              <option value="month">Mês Específico</option>
              <option value="this-week">Esta Semana</option>
              <option value="this-year">Este Ano</option>
              <option value="last-year">Ano Anterior</option>
              <option value="quarterly">Trimestral</option>
              <option value="semiannually">Semestral</option>
              <option value="all">Tudo</option>
              <option value="custom">Personalizado</option>
            </select>
            <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap hidden sm:inline">{dateRangeLabel}</span>
            <ChevronDown size={16} className="text-gray-400 pointer-events-none -ml-6" />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 sm:flex-none bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
              Exportar
            </button>
            <button className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors shadow-sm">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {[
          { label: 'RECEITA (ENTRADAS)', value: totalRevenue, change: '+ 12,5%', trendUp: true, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
          { label: 'DESPESAS (SAÍDAS)', value: totalExpenses, change: '+ 8,2%', trendUp: false, icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-50' },
          { label: 'RESULTADO (LÍQUIDO)', value: liquidResult, change: '- 3,3%', trendUp: false, icon: Scale, color: 'text-purple-500', bgColor: 'bg-purple-50' },
          { label: 'SALDO EM CAIXA', value: saldoCaixa, subtitle: 'Disponível em contas', icon: Wallet, color: 'text-blue-500', bgColor: 'bg-blue-50' },
          { label: 'CONTAS A RECEBER', value: accountsReceivable, subtitle: `${pendingReceivablesCount} títulos pendentes`, icon: Clock, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
          { label: 'CONTAS A PAGAR', value: accountsPayable, subtitle: `${pendingPayablesCount} títulos pendentes`, icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{kpi.label}</span>
              <div className={`p-1.5 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={kpi.color} size={18} />
              </div>
            </div>
            <h3 className={`text-xl font-extrabold ${kpi.value < 0 && idx === 2 ? 'text-red-500' : 'text-slate-800'}`}>
                {kpi.value < 0 ? '-' : ''} R$ {Math.abs(kpi.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            {kpi.change ? (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold">
                    <span className={kpi.trendUp ? 'text-emerald-500' : 'text-red-500'}>{kpi.change}</span>
                    <span className="text-gray-400 font-normal italic">vs mês anterior</span>
                </div>
            ) : (
                <p className="text-xs text-gray-400 mt-2 font-medium">{kpi.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Entradas x Saídas</h3>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
               Dinâmico
            </div>
          </div>
          <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={monthlyBarData} barGap={12}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${val/1000}k`} />
                 <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Entradas" />
                 <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} name="Saídas" />
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-6 justify-start px-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-500 tracking-tight">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs font-semibold text-slate-500 tracking-tight">Saídas</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Fluxo de Caixa (Acumulado)</h3>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
               Consolidado
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accumulatedCashFlow}>
                <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Receitas por Categoria</h3>
            <ChevronDown size={18} className="text-slate-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
             <div className="h-[240px] w-full sm:w-1/2 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                           data={categoryRevenue.length > 0 ? categoryRevenue : [{ name: 'Sem dados', value: 1 }]}
                           cx="50%"
                           cy="50%"
                           innerRadius={65}
                           outerRadius={85}
                           paddingAngle={4}
                           dataKey="value"
                        >
                           {categoryRevenue.map((_, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                           {categoryRevenue.length === 0 && <Cell fill="#f1f5f9" />}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                    <span className="text-sm font-bold text-slate-800">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
                </div>
             </div>
             <div className="w-full sm:w-1/2 space-y-4">
                {categoryRevenue.map((c, i) => {
                    const percentage = (c.value / (totalRevenue || 1)) * 100;
                    return (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span className="text-xs font-bold text-slate-600 truncate max-w-[80px]">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400">{percentage.toFixed(0)}%</span>
                                <span className="text-xs font-bold text-slate-700 min-w-[70px] text-right">R$ {c.value.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Despesas por Categoria</h3>
            <ChevronDown size={18} className="text-slate-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
             <div className="h-[240px] w-full sm:w-1/2 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                           data={categoryExpenses.length > 0 ? categoryExpenses : [{ name: 'Sem dados', value: 1 }]}
                           cx="50%"
                           cy="50%"
                           innerRadius={65}
                           outerRadius={85}
                           paddingAngle={4}
                           dataKey="value"
                        >
                           {categoryExpenses.map((_, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                           {categoryExpenses.length === 0 && <Cell fill="#f1f5f9" />}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                    <span className="text-sm font-bold text-slate-800">R$ {totalExpenses.toLocaleString('pt-BR')}</span>
                </div>
             </div>
             <div className="w-full sm:w-1/2 space-y-4">
                {categoryExpenses.map((c, i) => {
                    const percentage = (c.value / (totalExpenses || 1)) * 100;
                    return (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span className="text-xs font-bold text-slate-600 truncate max-w-[80px]">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400">{percentage.toFixed(0)}%</span>
                                <span className="text-xs font-bold text-slate-700 min-w-[70px] text-right">R$ {c.value.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Lançamentos Recentes</h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-12 px-2 py-2 text-[10px] font-extrabold text-slate-300 uppercase tracking-widest border-b border-slate-50">
                  <span className="col-span-5">Descrição</span>
                  <span className="col-span-3">Categoria</span>
                  <span className="col-span-2">Data</span>
                  <span className="col-span-2 text-right">Valor</span>
              </div>
              <div className="divide-y divide-slate-50">
                  {recentTransactions.map((t, i) => (
                      <div key={i} className="grid grid-cols-12 px-2 py-4 items-center group cursor-pointer hover:bg-slate-50/50 rounded-xl transition-colors">
                          <div className="col-span-5 flex flex-col gap-0.5">
                              <span className="text-[12px] font-bold text-slate-700 truncate">{t.desc}</span>
                          </div>
                          <span className="col-span-3 text-[11px] font-semibold text-slate-400">{t.cat}</span>
                          <span className="col-span-2 text-[11px] font-bold text-slate-400">{t.date.split('/2024')[0]}</span>
                          <div className="col-span-2 text-right flex flex-col items-end">
                              <span className={`text-[12px] font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {t.type === 'income' ? '+' : '-'} R$ {t.val.toLocaleString('pt-BR')}
                              </span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black ${t.statusColor}`}>{t.status}</span>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Indicators Row */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-8">
            <h3 className="text-lg font-bold text-slate-800">Indicadores Financeiros</h3>
            <HelpCircle size={14} className="text-slate-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {indicators.map((ind, idx) => (
                <div key={idx} className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{ind.name}</p>
                        <h4 className="text-xl font-black text-slate-800">{ind.value}</h4>
                        <p className={`text-[10px] font-bold mt-1 ${ind.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                            {ind.trendUp ? '▲' : '▼'} {ind.trend}
                        </p>
                    </div>
                    <div className="h-[40px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={Array.from({ length: 8 }, (_, i) => ({ val: Math.random() * 100 }))}>
                                <Area type="monotone" dataKey="val" stroke={ind.color} fill={ind.color} fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Última atualização: 29/04/2024 10:30</span>
                <Activity size={12} className="animate-pulse" />
            </div>
        </div>
      </div>
    </div>
  );
};
