import React from 'react';
import { 
  ShoppingCart, 
  TrendingDown, 
  Users, 
  FileSpreadsheet, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Calendar,
  DollarSign,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';

const PurchasingDashboard: React.FC = () => {
  const stats = [
    { label: 'Total de Compras (Mês)', value: 'R$ 452.800', change: '+12.5%', trend: 'up', icon: ShoppingCart, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Economia Gerada (Savings)', value: 'R$ 38.450', change: '+5.2%', trend: 'up', icon: TrendingDown, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pedidos Pendentes', value: '18', change: '-2', trend: 'down', icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Fornecedores Ativos', value: '124', change: '+3', trend: 'up', icon: Users, color: 'bg-blue-50 text-blue-600' },
  ];

  const spendingData = [
    { month: 'Jan', value: 380000 },
    { month: 'Fev', value: 420000 },
    { month: 'Mar', value: 452800 },
    { month: 'Abr', value: 410000 },
    { month: 'Mai', value: 435000 },
    { month: 'Jun', value: 460000 },
  ];

  const categoryData = [
    { name: 'Matéria-Prima', value: 65, color: '#4f46e5' },
    { name: 'Serviços', value: 15, color: '#6366f1' },
    { name: 'MRO', value: 12, color: '#818cf8' },
    { name: 'Outros', value: 8, color: '#a5b4fc' },
  ];

  const recentOrders = [
    { id: 'PC-2026-045', supplier: 'Metalúrgica Central', value: 'R$ 15.400,00', status: 'delivered', date: '2026-03-15' },
    { id: 'PC-2026-046', supplier: 'Plásticos Industriais S.A.', value: 'R$ 8.900,00', status: 'pending', date: '2026-03-16' },
    { id: 'PC-2026-047', supplier: 'Logística Express', value: 'R$ 2.500,00', status: 'shipped', date: '2026-03-17' },
    { id: 'PC-2026-048', supplier: 'Suprimentos Office', value: 'R$ 1.200,00', status: 'approved', date: '2026-03-18' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" size={28} />
            Dashboard Compras
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão estratégica de suprimentos e fornecedores</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
            <Calendar size={16} />
            Março 2026
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Nova Requisição
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-gray-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : stat.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Evolution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="text-indigo-600" size={20} />
              Evolução de Gastos
            </h3>
            <select className="text-xs border-gray-200 rounded-lg focus:ring-indigo-500/20">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dx={-10}
                  tickFormatter={(value) => `R$ ${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSpending)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
            <PieChart className="text-indigo-600" size={20} />
            Gastos por Categoria
          </h3>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" size={20} />
            Pedidos de Compra Recentes
          </h3>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Ver Todos</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{order.supplier}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{order.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {order.status === 'delivered' ? 'Entregue' : 
                       order.status === 'pending' ? 'Pendente' : 
                       order.status === 'shipped' ? 'Em Trânsito' : 
                       'Aprovado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasingDashboard;
