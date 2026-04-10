import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Briefcase,
  GraduationCap,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  UserPlus,
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
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const RHDashboard: React.FC = () => {
  const stats = [
    { label: 'Total de Colaboradores', value: '156', change: '+4', trend: 'up', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Novas Contratações (Mês)', value: '12', change: '+2', trend: 'up', icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Taxa de Turnover', value: '2.4%', change: '-0.5%', trend: 'down', icon: UserMinus, color: 'bg-rose-50 text-rose-600' },
    { label: 'Treinamentos Ativos', value: '8', change: '0', trend: 'neutral', icon: GraduationCap, color: 'bg-amber-50 text-amber-600' },
  ];

  const turnoverData = [
    { month: 'Jan', rate: 2.1 },
    { month: 'Fev', rate: 2.5 },
    { month: 'Mar', rate: 2.4 },
    { month: 'Abr', rate: 2.8 },
    { month: 'Mai', rate: 2.2 },
    { month: 'Jun', rate: 2.4 },
  ];

  const departmentData = [
    { name: 'Produção', value: 85 },
    { name: 'Vendas', value: 25 },
    { name: 'TI', value: 15 },
    { name: 'Financeiro', value: 12 },
    { name: 'RH', value: 8 },
    { name: 'Outros', value: 11 },
  ];

  const COLORS = ['#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  const recentHires = [
    { id: '1', name: 'Ana Silva', role: 'Analista de RH', department: 'RH', date: '2026-03-15', avatar: 'AS' },
    { id: '2', name: 'Bruno Costa', role: 'Desenvolvedor Backend', department: 'TI', date: '2026-03-12', avatar: 'BC' },
    { id: '3', name: 'Carla Souza', role: 'Gerente Comercial', department: 'Vendas', date: '2026-03-10', avatar: 'CS' },
    { id: '4', name: 'Daniel Lima', role: 'Operador de Máquina', department: 'Produção', date: '2026-03-08', avatar: 'DL' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-pink-600" size={28} />
            Dashboard RH
          </h1>
          <p className="text-gray-500 text-sm mt-1">Indicadores e visão geral da gestão de pessoas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
            <Calendar size={16} />
            Março 2026
          </div>
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
        {/* Turnover Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-pink-600" size={20} />
              Evolução do Turnover (%)
            </h3>
            <select className="text-xs border-gray-200 rounded-lg focus:ring-pink-500/20">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnoverData}>
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
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#ec4899" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Briefcase className="text-pink-600" size={20} />
            Distribuição por Setor
          </h3>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            {departmentData.slice(0, 4).map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-gray-600">{dept.name}</span>
                </div>
                <span className="font-bold text-gray-900">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Hires */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserPlus className="text-pink-600" size={20} />
            Últimas Contratações
          </h3>
          
          <div className="space-y-6">
            {recentHires.map(hire => (
              <div key={hire.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                    {hire.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{hire.name}</p>
                    <p className="text-xs text-gray-500">{hire.role} • {hire.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Admitido em</p>
                  <p className="text-xs font-medium text-gray-700">{new Date(hire.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
            Ver Todos os Funcionários
          </button>
        </div>

        {/* Upcoming Events / Birthdays */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="text-rose-500" size={20} />
            Aniversariantes e Eventos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
              <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center text-rose-600 shadow-sm">
                <span className="text-[10px] font-bold uppercase">Mar</span>
                <span className="text-lg font-bold leading-none">20</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Aniversário: João Pereira</p>
                <p className="text-xs text-gray-500">Setor de Produção • 5 anos de casa</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center text-blue-600 shadow-sm">
                <span className="text-[10px] font-bold uppercase">Mar</span>
                <span className="text-lg font-bold leading-none">22</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Treinamento de Segurança</p>
                <p className="text-xs text-gray-500">Auditório Principal • 14:00</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center text-emerald-600 shadow-sm">
                <span className="text-[10px] font-bold uppercase">Mar</span>
                <span className="text-lg font-bold leading-none">25</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Integração de Novos Colaboradores</p>
                <p className="text-xs text-gray-500">Sala de Reuniões 02 • 09:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHDashboard;
