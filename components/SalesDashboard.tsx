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

const SALES_DATA = [
  { name: 'Jan', sales: 45000, target: 40000 },
  { name: 'Fev', sales: 52000, target: 45000 },
  { name: 'Mar', sales: 48000, target: 50000 },
  { name: 'Abr', sales: 61000, target: 55000 },
  { name: 'Mai', sales: 55000, target: 55000 },
  { name: 'Jun', sales: 67000, target: 60000 },
];

const SALESPERSON_DATA = [
  { name: 'João Silva', sales: 125000 },
  { name: 'Maria Costa', sales: 142000 },
  { name: 'Ricardo Oliveira', sales: 98000 },
  { name: 'Ana Souza', sales: 115000 },
];

const PRODUCT_DATA = [
  { name: 'Serviço A', value: 45 },
  { name: 'Serviço B', value: 30 },
  { name: 'Produto X', value: 15 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const SalesDashboard: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" size={28} />
            Dashboard de Vendas
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe o desempenho comercial em tempo real</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Março 2026</span>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2">
            <Zap size={18} />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              <span className="text-xs font-bold">15.4%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Vendas Totais (Mês)</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 148.500,00</h3>
          <p className="text-xs text-gray-400 mt-2">vs. R$ 128.600,00 no mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShoppingCart size={24} />
            </div>
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              <span className="text-xs font-bold">8.2%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Novos Pedidos</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">42</h3>
          <p className="text-xs text-gray-400 mt-2">Ticket Médio: R$ 3.535,71</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Target size={24} />
            </div>
            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <ArrowDownRight size={14} />
              <span className="text-xs font-bold">2.1%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Atingimento da Meta</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">92.8%</h3>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '92.8%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              <span className="text-xs font-bold">12.5%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Novos Clientes</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">18</h3>
          <p className="text-xs text-gray-400 mt-2">CAC Médio: R$ 450,00</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Evolução de Vendas vs. Meta</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-500 font-medium">Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-500 font-medium">Meta</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_DATA}>
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
                <Line type="monotone" dataKey="target" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Mix de Produtos/Serviços</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PRODUCT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PRODUCT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {PRODUCT_DATA.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Salespeople */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="text-amber-500" size={20} />
              Ranking de Vendedores
            </h3>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Ver todos</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALESPERSON_DATA} layout="vertical" margin={{ left: 40, right: 40 }}>
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Atividades Recentes</h3>
          <div className="space-y-6">
            {[
              { user: 'João Silva', action: 'fechou um novo contrato', target: 'Tech Solutions', time: 'Há 2 horas', value: 'R$ 45.000,00', type: 'won' },
              { user: 'Maria Costa', action: 'enviou uma proposta para', target: 'Indústria Silva', time: 'Há 4 horas', value: 'R$ 120.000,00', type: 'proposal' },
              { user: 'Ana Souza', action: 'agendou uma reunião com', target: 'Varejo Express', time: 'Há 5 horas', value: null, type: 'meeting' },
              { user: 'Ricardo Oliveira', action: 'perdeu a oportunidade', target: 'Escola Aprender', time: 'Há 1 dia', value: 'R$ 15.000,00', type: 'lost' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'won' ? 'bg-emerald-50 text-emerald-600' :
                  activity.type === 'proposal' ? 'bg-blue-50 text-blue-600' :
                  activity.type === 'meeting' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {activity.type === 'won' ? <TrendingUp size={20} /> :
                   activity.type === 'proposal' ? <DollarSign size={20} /> :
                   activity.type === 'meeting' ? <Calendar size={20} /> :
                   <TrendingDown size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{activity.user}</span> {activity.action} <span className="font-bold text-gray-900">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{activity.time}</span>
                    {activity.value && <span className="text-xs font-bold text-emerald-600">{activity.value}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
