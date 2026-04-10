import React from 'react';
import { 
  Factory, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Calendar,
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
  AreaChart, 
  Area,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const ProductionDashboard: React.FC = () => {
  const stats = [
    { label: 'Eficiência Geral (OEE)', value: '84.2%', change: '+2.1%', trend: 'up', icon: Zap, color: 'bg-amber-50 text-amber-600' },
    { label: 'Produção Total (Mês)', value: '12.450', change: '+15%', trend: 'up', icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Taxa de Refugo', value: '1.8%', change: '-0.4%', trend: 'down', icon: AlertTriangle, color: 'bg-rose-50 text-rose-600' },
    { label: 'Ordens em Aberto', value: '42', change: '+5', trend: 'up', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const productionData = [
    { day: 'Seg', target: 450, actual: 420 },
    { day: 'Ter', target: 450, actual: 460 },
    { day: 'Qua', target: 450, actual: 440 },
    { day: 'Qui', target: 450, actual: 480 },
    { day: 'Sex', target: 450, actual: 430 },
    { day: 'Sáb', target: 200, actual: 210 },
  ];

  const machineStatusData = [
    { name: 'Operando', value: 12, color: '#10b981' },
    { name: 'Manutenção', value: 2, color: '#f59e0b' },
    { name: 'Parada', value: 1, color: '#ef4444' },
    { name: 'Ociosa', value: 3, color: '#94a3b8' },
  ];

  const recentOrders = [
    { id: 'OP-2026-001', product: 'Eixo de Transmissão X1', quantity: 500, progress: 85, status: 'in-progress', deadline: '2026-03-20' },
    { id: 'OP-2026-002', product: 'Engrenagem Cônica Z2', quantity: 1200, progress: 40, status: 'in-progress', deadline: '2026-03-25' },
    { id: 'OP-2026-003', product: 'Suporte Metálico S3', quantity: 3000, progress: 100, status: 'completed', deadline: '2026-03-15' },
    { id: 'OP-2026-004', product: 'Pino de Fixação P4', quantity: 5000, progress: 10, status: 'pending', deadline: '2026-04-05' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-orange-600" size={28} />
            Dashboard Produção
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitoramento em tempo real da linha de produção</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
            <Calendar size={16} />
            18 de Março, 2026
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm">
            Nova Ordem de Produção
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon && <stat.icon size={24} />}
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
        {/* Production Volume Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-orange-600" size={20} />
              Volume de Produção Diário
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                Meta
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                Realizado
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
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
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="target" fill="#fed7aa" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="actual" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Factory className="text-orange-600" size={20} />
            Status do Maquinário
          </h3>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={machineStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {machineStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {machineStatusData.map((status, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                <span className="text-gray-600 truncate">{status.name}</span>
                <span className="font-bold text-gray-900 ml-auto">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-orange-600" size={20} />
            Ordens de Produção Ativas
          </h3>
          <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">Ver Todas</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 py-4">ID Ordem</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Progresso</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{order.quantity.toLocaleString('pt-BR')} un</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'}`}
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status === 'completed' ? 'Finalizado' : 
                       order.status === 'in-progress' ? 'Em Produção' : 
                       'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.deadline).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;

import { ClipboardList } from 'lucide-react';
