import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

import { useSales } from '../src/context/SalesContext';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const SalesDashboard: React.FC = () => {
  const { sales, quotes, isLoading } = useSales();

  // Calculate KPIs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlySales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  const totalMonthlySalesValue = monthlySales.reduce((acc, curr) => acc + curr.value, 0);
  const totalOrders = monthlySales.length;
  const ticketMedio = totalOrders > 0 ? totalMonthlySalesValue / totalOrders : 0;

  // Mock target for now or calculate if available
  const monthlyTarget = 150000;
  const targetAchievement = (totalMonthlySalesValue / monthlyTarget) * 100;

  // Sales trend data (last 6 months)
  const salesTrendData = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(currentMonth - (5 - i));
    const monthName = date.toLocaleString('pt-BR', { month: 'short' });
    const monthSales = sales.filter(s => {
      const sDate = new Date(s.date);
      return sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
    }).reduce((acc, curr) => acc + curr.value, 0);

    return {
      name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      sales: monthSales,
      target: monthlyTarget / 1.2 // Simplified target
    };
  });

  // Salesperson data
  const salespersonMap = new Map<string, number>();
  sales.forEach(s => {
    const current = salespersonMap.get(s.salesperson) || 0;
    salespersonMap.set(s.salesperson, current + s.value);
  });

  const salespersonData = Array.from(salespersonMap.entries())
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" size={28} />
            Dashboard de Vendas
            {isLoading && <span className="text-xs font-normal text-gray-400 animate-pulse ml-2">Carregando...</span>}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe o desempenho comercial em tempo real</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Vendas Totais (Mês)</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthlySalesValue)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShoppingCart size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Novos Pedidos</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
          <p className="text-xs text-gray-400 mt-2">
            Ticket Médio: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Target size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Atingimento da Meta</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{targetAchievement.toFixed(1)}%</h3>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(targetAchievement, 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Orçamentos Ativos</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {quotes.filter(q => q.status === 'sent' || q.status === 'waiting_approval').length}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Evolução de Vendas</h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `R$ ${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Valor']}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Salespeople */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="text-amber-500" size={20} />
              Ranking de Vendedores
            </h3>
          </div>
          <div className="h-[300px]">
            {salespersonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salespersonData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Vendas']}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Users size={48} className="opacity-20 mb-2" />
                <p>Nenhuma venda registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
