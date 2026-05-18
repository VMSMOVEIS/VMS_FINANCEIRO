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
  Zap,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Filter,
  Clock,
  Package,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  Factory
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
  Legend,
  ComposedChart,
  Area
} from 'recharts';

import { useSales } from '../src/context/SalesContext';
import { LeadStatus } from '../types';

const COLORS_PRODUCTION = ['#3b82f6', '#78350f', '#84cc16', '#a16207', '#4b5563'];
const COLORS_COSTS = ['#57534e', '#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4'];

const FunnelChart = ({ leads }: { leads: any[] }) => {
  const getCount = (status: LeadStatus) => leads.filter(l => l.status === status).length;
  
  const stages = [
    { label: 'Leads', value: leads.length, color: '#334155', width: '100%' },
    { label: 'Visitas Agendadas', value: getCount(LeadStatus.MEETING), color: '#92400e', width: '85%' },
    { label: 'Orçamentos', value: getCount(LeadStatus.PROPOSAL), color: '#b45309', width: '70%' },
    { label: 'Negociação', value: getCount(LeadStatus.NEGOTIATION), color: '#d97706', width: '55%' },
    { label: 'Fechados', value: getCount(LeadStatus.WON), color: '#f59e0b', width: '40%' },
  ];

  return (
    <div className="flex flex-col gap-1 items-center w-full max-w-[300px] mx-auto">
      {stages.map((stage, i) => (
        <div 
          key={i} 
          className="relative flex items-center justify-center text-white text-[10px] font-bold h-10 transition-all hover:brightness-110 cursor-default"
          style={{ 
            backgroundColor: stage.color, 
            width: stage.width,
            clipPath: `polygon(${i === 0 ? '0 0, 100% 0,' : '10% 0, 90% 0,'} 100% 100%, 0 100%)`
          }}
        >
          <div className="flex flex-col items-center">
            <span>{stage.label}</span>
            <span className="text-sm">{stage.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const SalesDashboard: React.FC = () => {
  const { sales, quotes, leads, isLoading } = useSales();

  const getCount = (status: LeadStatus) => leads.filter(l => l.status === status).length;

  const currentMonthRevenue = sales.reduce((sum, s) => {
    const saleDate = new Date(s.date);
    const now = new Date();
    if (saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()) {
      return sum + s.value;
    }
    return sum;
  }, 0);

  const kpis = [
    { label: 'LEADS EM ANDAMENTO', value: leads.filter(l => ![LeadStatus.WON, LeadStatus.LOST].includes(l.status)).length.toString(), trend: '12%', up: true, icon: Users, color: 'slate' },
    { label: 'ORÇAMENTOS ABERTOS', value: quotes.filter(q => q.status === 'draft' || q.status === 'sent').length.toString(), trend: '8%', up: true, icon: ShoppingCart, color: 'amber' },
    { label: 'PEDIDOS CONFIRMADOS', value: sales.length.toString(), trend: '15%', up: true, icon: FileText, color: 'slate' },
    { label: 'PRODUÇÃO EM ANDAMENTO', value: sales.filter(s => s.status === 'processing' || s.status === 'waiting_production').length.toString(), trend: null, up: null, icon: Factory, color: 'amber' },
    { label: 'FATURAMENTO DO MÊS', value: currentMonthRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: '18%', up: true, icon: DollarSign, color: 'slate' },
  ];

  const productionStatusData = [
    { name: 'Em planejamento', value: 5, color: '#3b82f6', percentage: '19%' },
    { name: 'Em produção', value: 9, color: '#451a03', percentage: '35%' },
    { name: 'Montagem', value: 6, color: '#a16207', percentage: '23%' },
    { name: 'Acabamento', value: 3, color: '#92400e', percentage: '12%' },
    { name: 'Pronto para entrega', value: 3, color: '#4b5563', percentage: '11%' },
  ];

  const revenueData = [
    { name: '01', value: 18000 },
    { name: '03', value: 25000 },
    { name: '05', value: 45000 },
    { name: '08', value: 55000 },
    { name: '10', value: 55000 },
    { name: '12', value: 60000 },
    { name: '15', value: 65000 },
    { name: '18', value: 50000 },
    { name: '20', value: 50000 },
    { name: '23', value: 60000 },
    { name: '25', value: 60000 },
    { name: '28', value: 72000 },
    { name: '30', value: 72000 },
  ];

  const deliveries = [
    { date: '08/05/2025', client: 'Carlos Silva', project: 'Cozinha Planejada', status: 'Agendado', statusColor: 'bg-orange-100 text-orange-700' },
    { date: '09/05/2025', client: 'Mariana Souza', project: 'Closet Casal', status: 'Em produção', statusColor: 'bg-amber-100 text-amber-700' },
    { date: '10/05/2025', client: 'Fernanda Lima', project: 'Sala de TV', status: 'Em montagem', statusColor: 'bg-emerald-100 text-emerald-700' },
    { date: '12/05/2025', client: 'João Oliveira', project: 'Escritório', status: 'Pronto p/ entrega', statusColor: 'bg-emerald-100 text-emerald-700' },
    { date: '13/05/2025', client: 'Aline Costa', project: 'Quarto Solteiro', status: 'Agendado', statusColor: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-12">
      {/* Wood Header Banner */}
      <div 
        className="h-28 relative overflow-hidden flex flex-col items-center justify-center text-white shadow-lg"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-[0.2em] drop-shadow-lg">VMS MÓVEIS</h1>
          <p className="text-[10px] tracking-[0.4em] font-medium opacity-90 mt-1 uppercase">Planejados sob medida</p>
        </div>
      </div>

      <div className="px-6 lg:px-8 max-w-[1600px] mx-auto -mt-6">
        {/* Breadcrumb & Filter bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pt-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500 text-xs mt-0.5 font-medium">Visão geral da sua operação</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700">07/05/2025</span>
              <Calendar size={14} className="text-gray-400" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Filter size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-700">Filtros</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${kpi.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  <kpi.icon size={20} />
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>
                    {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {kpi.trend} <span className="text-gray-400 font-normal ml-1">vs mês anterior</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{kpi.label}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</h3>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-[9px] font-bold text-gray-400 group-hover:text-amber-600 transition-colors">Ver mais</button>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Funil de Vendas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Funil de Vendas</h3>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex flex-1 items-center">
                <div className="w-1/2">
                   <FunnelChart leads={leads} />
                </div>
                <div className="w-1/2 pl-6 flex-1 space-y-3">
                  <div className="grid grid-cols-3 text-[9px] uppercase font-bold text-gray-400 mb-2 border-b border-gray-50 pb-2">
                    <span>Etapa</span>
                    <span className="text-center">Qtde</span>
                    <span className="text-right">Conversão</span>
                  </div>
                  {[
                    { label: 'Leads', val: leads.length, conv: '-' },
                    { label: 'Visitas Agendadas', val: getCount(LeadStatus.MEETING), conv: leads.length > 0 ? `${Math.round((getCount(LeadStatus.MEETING) / leads.length) * 100)}%` : '0%' },
                    { label: 'Orçamentos', val: getCount(LeadStatus.PROPOSAL), conv: getCount(LeadStatus.MEETING) > 0 ? `${Math.round((getCount(LeadStatus.PROPOSAL) / getCount(LeadStatus.MEETING)) * 100)}%` : '0%' },
                    { label: 'Negociação', val: getCount(LeadStatus.NEGOTIATION), conv: getCount(LeadStatus.PROPOSAL) > 0 ? `${Math.round((getCount(LeadStatus.NEGOTIATION) / getCount(LeadStatus.PROPOSAL)) * 100)}%` : '0%' },
                    { label: 'Fechados', val: getCount(LeadStatus.WON), conv: getCount(LeadStatus.NEGOTIATION) > 0 ? `${Math.round((getCount(LeadStatus.WON) / getCount(LeadStatus.NEGOTIATION)) * 100)}%` : '0%' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 text-[10px] font-medium text-slate-600 py-1 border-b border-gray-50 last:border-0 items-center">
                      <span className="truncate pr-1">{row.label}</span>
                      <span className="text-center font-bold text-slate-800">{row.val}</span>
                      <span className="text-right text-gray-400 font-bold">{row.conv}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 bg-amber-50 p-2.5 rounded-lg flex justify-between items-center border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Taxa de conversão geral:</span>
                <span className="text-xs font-black text-amber-900 bg-white px-2 py-0.5 rounded shadow-sm border border-amber-100">17,86%</span>
              </div>
            </div>
          </div>

          {/* Pedidos por Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
              Pedidos por Status (Produção)
            </div>
            <div className="p-6 flex items-center justify-between flex-1">
              <div className="w-1/2 h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {productionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Wood center effect */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="w-16 h-16 rounded-full border-2 border-slate-200 bg-[#fdfaf3] flex flex-col items-center justify-center overflow-hidden shadow-inner relative">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>
                      <span className="text-[9px] font-bold text-gray-400 leading-none">Total</span>
                      <span className="text-xl font-black text-slate-800 leading-tight">26</span>
                   </div>
                </div>
              </div>
              <div className="w-1/2 space-y-3 pl-4">
                {productionStatusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                       <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 truncate transition-colors">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-800">{item.value}</span>
                       <span className="text-[9px] font-black text-gray-400 w-8 text-right">{item.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Faturamento (Mês) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Faturamento (Mês)</h3>
              <span className="text-xs font-black text-slate-800 tracking-tight">R$ 87.450,00</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Meta: R$ 120.000,00</span>
                  <div className="bg-amber-800 text-white px-3 py-1 rounded-lg text-[9px] font-black">72,88% da meta</div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                   <div className="h-full bg-amber-600 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000" style={{ width: '72.88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas Entregas */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
               <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Próximas Entregas / Instalações</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase">Data</th>
                    <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase">Cliente</th>
                    <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase">Projeto</th>
                    <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {deliveries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-all font-medium text-[11px] text-slate-600">
                      <td className="px-5 py-3 whitespace-nowrap">{item.date}</td>
                      <td className="px-5 py-3 font-bold text-slate-800">{item.client}</td>
                      <td className="px-5 py-3 truncate max-w-[120px]">{item.project}</td>
                      <td className="px-5 py-3">
                         <span className={`px-2 py-1 rounded-md text-[9px] font-black whitespace-nowrap ${item.statusColor} border border-black/5`}>
                           {item.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
               <button className="text-[10px] font-extrabold text-amber-900 border-b border-amber-900/30 hover:border-amber-900 transition-all uppercase tracking-widest">Ver todas entregas</button>
            </div>
          </div>

          {/* Custos de Produção */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
              Custos de Produção (Mês)
            </div>
            <div className="p-6 flex items-center justify-between flex-1">
              <div className="w-[150px] h-[150px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Matéria-prima', value: 21580, color: '#57534e' },
                        { name: 'Mão de obra', value: 8450, color: '#78716c' },
                        { name: 'Ferragens', value: 4820, color: '#a8a29e' },
                        { name: 'Terceiros', value: 2150, color: '#d6d3d1' },
                        { name: 'Outros', value: 1620, color: '#e7e5e4' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={58}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { color: '#57534e' }, { color: '#78716c' }, { color: '#a8a29e' }, { color: '#d6d3d1' }, { color: '#e7e5e4' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[7px] font-bold text-gray-400 uppercase">Total</span>
                   <span className="text-[11px] font-black text-slate-800">R$ 38.620</span>
                </div>
              </div>
              <div className="flex-1 ml-6 space-y-3">
                {[
                  { name: 'Matéria-prima', val: 'R$ 21.580', p: '55,9%' },
                  { name: 'Mão de obra', val: 'R$ 8.450', p: '21,9%' },
                  { name: 'Ferragens', val: 'R$ 4.820', p: '12,5%' },
                  { name: 'Terceiros', val: 'R$ 2.150', p: '5,6%' },
                  { name: 'Outros', val: 'R$ 1.620', p: '4,1%' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-200" style={{ backgroundColor: COLORS_COSTS[i] }}></div>
                       <span className="truncate max-w-[80px]">{item.name}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                       <span className="font-black text-slate-800 tracking-tight whitespace-nowrap">{item.val}</span>
                       <span className="text-gray-400 font-black w-8 text-right">{item.p}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
               <button className="text-[10px] font-bold text-slate-500 border-b border-gray-300 hover:border-slate-500 transition-all uppercase tracking-widest italic">Ver relatório completo</button>
            </div>
          </div>

          {/* Alertas Importantes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
              Alertas Importantes
            </div>
            <div className="p-4 flex-1 space-y-2">
              {[
                { icon: Clock, title: '3 pedidos com atraso no prazo de produção', color: 'bg-orange-100 text-orange-600' },
                { icon: Package, title: 'Estoque baixo: MDF Carvalho Hanover', color: 'bg-orange-50 text-orange-500' },
                { icon: DollarSign, title: '5 orçamentos vencem nos próximos 3 dias', color: 'bg-slate-100 text-slate-600' },
                { icon: Wrench, title: '2 manutenções de máquinas pendentes', color: 'bg-amber-100 text-amber-700' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group cursor-pointer">
                  <div className={`p-2 rounded-lg flex-shrink-0 flex items-center justify-center w-10 h-10 ${alert.color} shadow-sm`}>
                     <alert.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-800 leading-snug">{alert.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1 font-medium">Clique para verificar</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
               <button className="text-[10px] font-black text-amber-900 border-b border-amber-900/30 hover:border-amber-900 transition-all uppercase tracking-widest">Ver todos alertas</button>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Footer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0f172a] text-white h-10 flex items-center px-6 z-40 text-[10px] font-bold shadow-2xl">
         <div className="flex items-center gap-6 border-r border-white/10 pr-6 h-full">
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
               <History size={14} className="text-amber-400" />
               <span>Usuário: Administrador</span>
            </div>
         </div>
         <div className="flex-1 flex justify-center items-center gap-10">
            <div className="flex items-center gap-2 opacity-70">
                <span className="text-gray-400">Empresa:</span>
                <span className="uppercase text-amber-400 tracking-widest">VMS MÓVEIS LTDA</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-gray-400">Ambiente:</span>
                    <span className="uppercase text-white">Produção</span>
                </div>
            </div>
         </div>
         <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-full">
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
               <AlertTriangle size={14} className="text-amber-400" />
               <span>Ajuda</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default SalesDashboard;
