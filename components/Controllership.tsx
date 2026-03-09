import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, DollarSign, PieChart as PieChartIcon, Activity } from 'lucide-react';

const budgetData = [
  { name: 'Marketing', orcado: 60000, realizado: 45000 },
  { name: 'Vendas', orcado: 55000, realizado: 52000 },
  { name: 'TI', orcado: 40000, realizado: 42000 },
  { name: 'RH', orcado: 30000, realizado: 28000 },
  { name: 'Operacional', orcado: 120000, realizado: 115000 },
];

const costCenterData = [
  { name: 'Produção', value: 450000 },
  { name: 'Administrativo', value: 120000 },
  { name: 'Logística', value: 85000 },
  { name: 'Comercial', value: 95000 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Controllership: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controladoria</h1>
          <p className="text-gray-500">Gestão orçamentária, KPIs estratégicos e centros de custo</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Exportar Relatório
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'EBITDA', value: 'R$ 125.400', change: '+12%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Margem Líquida', value: '18.5%', change: '+2.4%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ponto de Equilíbrio', value: 'R$ 380.000', change: '-5%', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'ROI Médio', value: '24.2%', change: '+1.8%', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${kpi.bg} ${kpi.color} rounded-lg`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Orçado vs Realizado por Departamento</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="orcado" name="Orçado" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realizado" name="Realizado" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Centers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Distribuição por Centro de Custo</h3>
            <PieChartIcon className="text-gray-400" size={20} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costCenterData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {costCenterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {costCenterData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Análise Detalhada de Desvios</h3>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Competência: Março/2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Departamento</th>
                <th className="px-6 py-3">Orçado</th>
                <th className="px-6 py-3">Realizado</th>
                <th className="px-6 py-3">Desvio (R$)</th>
                <th className="px-6 py-3">Desvio (%)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgetData.map((item, i) => {
                const desvio = item.orcado - item.realizado;
                const desvioPerc = (desvio / item.orcado) * 100;
                const isOver = desvio < 0;
                
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{formatCurrency(item.orcado)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatCurrency(item.realizado)}</td>
                    <td className={`px-6 py-4 font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatCurrency(Math.abs(desvio))}
                    </td>
                    <td className={`px-6 py-4 font-medium ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                      {desvioPerc.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isOver ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isOver ? 'Acima do Orçado' : 'Dentro do Limite'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
