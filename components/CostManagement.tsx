import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Briefcase,
  Plus,
  Trash2,
  X,
  Save,
  Download
} from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { useEmployees } from '../src/context/EmployeeContext';
import * as XLSX from 'xlsx';

interface FixedCost {
  id: string;
  name: string;
  category: string;
  value: number;
}

const COST_CATEGORIES = [
  'Ocupação',
  'Administrativo',
  'Operacional',
  'Pessoal',
  'Marketing',
  'Financeiro',
  'Outros'
];

export const CostManagement: React.FC = () => {
  const { transactions } = useTransactions();
  const { employees } = useEmployees();

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(() => {
    const saved = localStorage.getItem('vms_fixed_costs');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Aluguel Galpão', category: 'Ocupação', value: 5500 },
      { id: '2', name: 'Energia Elétrica', category: 'Operacional', value: 1200 },
      { id: '3', name: 'Internet & Softwares', category: 'Administrativo', value: 450 },
      { id: '4', name: 'Contabilidade', category: 'Administrativo', value: 850 },
      { id: '5', name: 'Seguros', category: 'Pessoal', value: 320 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vms_fixed_costs', JSON.stringify(fixedCosts));
  }, [fixedCosts]);

  const totalFixedCosts = useMemo(() => {
    return fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
  }, [fixedCosts]);

  // Mock data for worked hours (in a real app, this would come from TimeTracking/EmployeeContext)
  const workedHoursData = [
    { month: 'Jan', hours: 1240, revenue: 150000, variableCosts: 75000 },
    { month: 'Fev', hours: 1180, revenue: 142000, variableCosts: 72000 },
    { month: 'Mar', hours: 1320, revenue: 168000, variableCosts: 81000 },
    { month: 'Abr', hours: 1280, revenue: 155000, variableCosts: 78000 },
    { month: 'Mai', hours: 1350, revenue: 172000, variableCosts: 84000 },
    { month: 'Jun', hours: 1400, revenue: 185000, variableCosts: 88000 },
  ];

  const stats = useMemo(() => {
    const currentMonth = workedHoursData[workedHoursData.length - 1];
    const totalMonthlyCosts = currentMonth.variableCosts + totalFixedCosts;
    const revenuePerHour = currentMonth.revenue / currentMonth.hours;
    const costPerHour = totalMonthlyCosts / currentMonth.hours;
    const profitPerHour = revenuePerHour - costPerHour;
    
    // New indicators
    const numEmployees = employees.length || 1; // Avoid division by zero
    const hoursPerEmployee = currentMonth.hours / numEmployees;
    const directCostPerHour = currentMonth.variableCosts / currentMonth.hours;
    const indirectCostPerHour = totalFixedCosts / currentMonth.hours;
    const mcPerHour = (currentMonth.revenue - currentMonth.variableCosts) / currentMonth.hours;
    
    // Assume a target profit margin of 20% for "Faturamento Necessário" if not specified
    const targetMargin = 0.20;
    const requiredBillingPerHour = costPerHour / (1 - targetMargin);
    
    // Productive capacity: assume 176h per employee (22 days * 8h)
    const capacityPerHour = numEmployees * 176; 
    const efficiency = (currentMonth.hours / capacityPerHour) * 100;

    return {
      totalHours: currentMonth.hours,
      revenuePerHour,
      costPerHour,
      profitPerHour,
      margin: (profitPerHour / revenuePerHour) * 100,
      totalMonthlyCosts,
      numEmployees,
      hoursPerEmployee,
      directCostPerHour,
      indirectCostPerHour,
      mcPerHour,
      requiredBillingPerHour,
      capacityPerHour,
      efficiency
    };
  }, [workedHoursData, totalFixedCosts, employees]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const chartData = useMemo(() => {
    return workedHoursData.map(d => {
      const totalCosts = d.variableCosts + totalFixedCosts;
      return {
        ...d,
        totalCosts,
        revPerHour: d.revenue / d.hours,
        costPerHour: totalCosts / d.hours,
        profitPerHour: (d.revenue - totalCosts) / d.hours
      };
    });
  }, [workedHoursData, totalFixedCosts]);

  const handleAddFixedCost = () => {
    const newCost: FixedCost = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: 'Outros',
      value: 0
    };
    setFixedCosts([...fixedCosts, newCost]);
  };

  const handleUpdateFixedCost = (id: string, field: keyof FixedCost, value: string | number) => {
    setFixedCosts(fixedCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleRemoveFixedCost = (id: string) => {
    setFixedCosts(fixedCosts.filter(c => c.id !== id));
  };

  const generateReport = () => {
    const data = chartData.map(d => ({
      'Mês': d.month,
      'Horas Trabalhadas': d.hours,
      'Faturamento Total': d.revenue,
      'Custos Variáveis': d.variableCosts,
      'Custos Fixos': totalFixedCosts,
      'Custo Total': d.totalCosts,
      'Faturamento / Hora': d.revPerHour.toFixed(2),
      'Custo / Hora': d.costPerHour.toFixed(2),
      'Lucro / Hora': d.profitPerHour.toFixed(2),
      'Margem (%)': ((d.profitPerHour / d.revPerHour) * 100).toFixed(2)
    }));

    // Add fixed costs breakdown to the report
    const fixedCostsData = fixedCosts.map(c => ({
      'Nome do Custo': c.name,
      'Categoria': c.category,
      'Valor Mensal': c.value
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wsFixed = XLSX.utils.json_to_sheet(fixedCostsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gestão de Custos");
    XLSX.utils.book_append_sheet(wb, wsFixed, "Detalhamento Custos Fixos");
    XLSX.writeFile(wb, "Relatorio_Gestao_Custos.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={28} />
            Gestão de Custos & Eficiência
          </h1>
          <p className="text-gray-500">Análise de rentabilidade por hora e indicadores de custo operacional</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Briefcase size={18} />
            Configurar Custos Fixos
          </button>
          <button 
            onClick={generateReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Gerar Relatório Custos
          </button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Faturamento Necessário/H</p>
          <p className="text-xl font-bold text-indigo-600">{formatCurrency(stats.requiredBillingPerHour)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Para margem de 20%</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Custo Direto por Hora</p>
          <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.directCostPerHour)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Base: Custos Variáveis</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Custo Indireto por Hora</p>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(stats.indirectCostPerHour)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Base: Custos Fixos</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lucro por Hora</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats.profitPerHour)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Líquido operacional</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">MC por Hora</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.mcPerHour)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Margem de Contribuição</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacidade Produtiva/h</p>
          <p className="text-xl font-bold text-gray-900">{stats.capacityPerHour.toLocaleString()}h</p>
          <p className="text-[10px] text-gray-400 mt-1">Potencial mensal total</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Horas por Funcionário</p>
          <p className="text-xl font-bold text-gray-900">{stats.hoursPerEmployee.toFixed(1)}h</p>
          <p className="text-[10px] text-gray-400 mt-1">Média mensal</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Funcionários</p>
          <p className="text-xl font-bold text-gray-900">{stats.numEmployees}</p>
          <p className="text-[10px] text-gray-400 mt-1">Equipe ativa</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Eficiência (%)</p>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold text-indigo-600">{stats.efficiency.toFixed(1)}%</p>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${stats.efficiency > 80 ? 'bg-emerald-500' : stats.efficiency > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(stats.efficiency, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Horas Trabalhadas</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalHours}h</p>
          <p className="text-[10px] text-gray-400 mt-1">Total do período</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Evolução da Rentabilidade por Hora</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line type="monotone" dataKey="revPerHour" name="Fat. / Hora" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="costPerHour" name="Custo / Hora" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profitPerHour" name="Lucro / Hora" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hours vs Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Horas Trabalhadas vs Faturamento</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar yAxisId="left" dataKey="hours" name="Horas" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" name="Faturamento" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Detalhamento de Custos Operacionais</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Categoria de Custo</th>
                  <th className="px-6 py-3">Valor Mensal</th>
                  <th className="px-6 py-3">Custo / Hora</th>
                  <th className="px-6 py-3">% do Faturamento</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { category: 'Mão de Obra Direta', value: 45000, costPerHour: 33.33, perc: 26.1, status: 'normal' },
                  { category: 'Insumos & Matéria Prima', value: 28000, costPerHour: 20.74, perc: 16.3, status: 'high' },
                  { category: 'Energia & Utilidades', value: 4500, costPerHour: 3.33, perc: 2.6, status: 'low' },
                  { category: 'Manutenção de Máquinas', value: 6200, costPerHour: 4.59, perc: 3.6, status: 'normal' },
                  { category: 'Custos Fixos (Configurados)', value: totalFixedCosts, costPerHour: totalFixedCosts / stats.totalHours, perc: (totalFixedCosts / (stats.revenuePerHour * stats.totalHours)) * 100, status: 'normal' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 text-gray-600">{formatCurrency(item.value)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatCurrency(item.costPerHour)}</td>
                    <td className="px-6 py-4 text-gray-600">{item.perc.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'low' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status === 'low' ? 'Otimizado' : item.status === 'high' ? 'Alerta' : 'Estável'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Efficiency Indicators */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Eficiência Operacional</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Margem de Contribuição / Hora</span>
                <span className="text-sm font-bold text-indigo-600">{stats.margin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${stats.margin}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ocupação da Capacidade</span>
                <span className="text-sm font-bold text-emerald-600">88.5%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '88.5%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                <Activity className="text-indigo-600" size={24} />
                <div>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Ponto de Equilíbrio</p>
                  <p className="text-lg font-bold text-indigo-900">280 Horas / Mês</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target size={16} className="text-indigo-500" />
                <span>Meta de Lucro/Hora: <strong>R$ 65,00</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase size={16} className="text-indigo-500" />
                <span>Custo Médio Operacional: <strong>R$ 42,15</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase size={24} />
                  Configurar Custos Fixos Mensais
                </h2>
                <p className="text-indigo-100 text-sm">Estes valores são usados para calcular o custo por hora real.</p>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {fixedCosts.map((cost) => (
                  <div key={cost.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex-[2]">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Descrição</label>
                      <input 
                        type="text"
                        value={cost.name}
                        onChange={(e) => handleUpdateFixedCost(cost.id, 'name', e.target.value)}
                        placeholder="Ex: Aluguel, Energia..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categoria</label>
                      <select 
                        value={cost.category}
                        onChange={(e) => handleUpdateFixedCost(cost.id, 'category', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {COST_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valor (R$)</label>
                      <input 
                        type="number"
                        value={cost.value}
                        onChange={(e) => handleUpdateFixedCost(cost.id, 'value', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveFixedCost(cost.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddFixedCost}
                className="mt-6 w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={20} />
                Adicionar Novo Custo Fixo
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="text-gray-600">
                <span className="text-sm">Total de Custos Fixos:</span>
                <span className="ml-2 text-lg font-bold text-gray-900">{formatCurrency(totalFixedCosts)}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setIsConfigModalOpen(false)}
                  className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
