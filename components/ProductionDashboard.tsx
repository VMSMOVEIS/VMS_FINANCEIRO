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
  Zap,
  Goal,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Truck,
  History as LucideHistory
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
  const mainStats = [
    { label: 'Produção hoje', value: 'R$ 2.850', color: 'text-emerald-600', subValue: '+12% vs ontem', icon: Zap },
    { label: 'Meta diária', value: 'R$ 1.820', color: 'text-blue-600', subValue: 'Base: R$ 1.500', icon: Goal },
    { label: 'Eficiência', value: '92%', color: 'text-orange-600', subValue: 'Meta: 85%', icon: Activity },
    { label: 'Retrabalho', value: '3%', color: 'text-rose-600', subValue: 'Limite: 5%', icon: LucideHistory },
    { label: 'OPs andamento', value: '14', color: 'text-purple-600', subValue: ' Capacidade: 20', icon: Package },
  ];

  const dailyKpis = [
    { label: 'produção dia', value: 'R$ 2.850', trend: 'up' },
    { label: 'produção mês', value: 'R$ 58.420', trend: 'up' },
    { label: 'meta diária', value: 'R$ 1.820', trend: 'neutral' },
    { label: 'meta mensal', value: 'R$ 45.000', trend: 'up' },
    { label: 'eficiência', value: '92%', trend: 'up' },
    { label: 'atrasos', value: '2', trend: 'down' },
    { label: 'retrabalho', value: '3%', trend: 'up' },
    { label: 'instalações agendadas', value: '6', trend: 'neutral' },
    { label: 'projetos andamento', value: '21', trend: 'up' },
  ];

  const dailyVolumeLine = [
    { day: 'Seg', value: 1200 },
    { day: 'Ter', value: 1800 },
    { day: 'Qua', value: 1400 },
    { day: 'Qui', value: 2100 },
    { day: 'Sex', value: 1900 },
    { day: 'Sab', value: 2400 },
    { day: 'Dom', value: 2850 },
  ];

  const monthlyVolumeBar = [
    { month: 'Jan', value: 42000 },
    { month: 'Fev', value: 38500 },
    { month: 'Mar', value: 45000 },
    { month: 'Abr', value: 52000 },
    { month: 'Mai', value: 58420 },
    { month: 'Jun', value: 65200 },
  ];

  const opStatusPie = [
    { name: 'Corte', value: 4, color: '#f97316' },
    { name: 'Usinagem', value: 3, color: '#0ea5e9' },
    { name: 'Montagem', value: 5, color: '#8b5cf6' },
    { name: 'Acabamento', value: 2, color: '#10b981' },
    { name: 'Bordeamento', value: 2, color: '#6366f1' },
  ];

  const bottlenecks = [
    { area: 'Corte', hours: 45 },
    { area: 'Bordeamento', hours: 32 },
    { area: 'Usinagem', hours: 12 },
    { area: 'Montagem', hours: 28 },
    { area: 'Acabamento', hours: 8 },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-orange-600" size={28} />
            DASHBOARD PRODUÇÃO
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">A tela mais importante da fábrica • Visão 360º</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 flex items-center gap-2 shadow-sm uppercase tracking-widest">
            <Calendar size={16} />
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center gap-2 uppercase tracking-widest">
            <Zap size={16} /> Atualizar Real-time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lado Esquerdo: KPIs e Termômetro */}
        <div className="lg:col-span-1 space-y-6">
           {/* Section 1: KPIs Principais */}
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h3 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest flex items-center justify-between">
               KPIs Principais
               <TrendingUp size={14} className="text-emerald-500" />
             </h3>
             <div className="space-y-4">
               {dailyKpis.map((kpi, i) => (
                 <div key={i} className="flex justify-between items-center group">
                   <div className="flex items-center gap-2">
                     <div className={`w-1 h-4 rounded-full ${kpi.trend === 'up' ? 'bg-emerald-500' : kpi.trend === 'down' ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
                     <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-gray-900 transition-colors">✅ {kpi.label}</span>
                   </div>
                   <span className="text-sm font-black text-gray-900 tracking-tight">{kpi.value}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Section 2: Termômetro Meta */}
           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 opacity-10">
               <Goal size={180} />
             </div>
             <h3 className="text-xs font-black text-orange-400 uppercase mb-6 tracking-widest relative z-10">TERMÔMETRO META</h3>
             <div className="relative z-10">
                <div className="flex justify-between items-end mb-3">
                   <span className="text-4xl font-black">78%</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase">R$ 35k / R$ 45k</span>
                </div>
                {/* Visual Bar Requested */}
                <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="bg-orange-500 h-full rounded-full flex items-center justify-end px-1" style={{ width: '78%' }}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-4 leading-relaxed uppercase tracking-widest">▓▓▓▓▓▓▓▓▓▓░░░░░</p>
             </div>
           </div>
        </div>

        {/* Lado Direito: Cards Principais e Gráficos */}
        <div className="lg:col-span-3 space-y-8">
          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mainStats.map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:border-orange-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                   <stat.icon size={14} className="text-gray-200 group-hover:text-orange-600 transition-colors" />
                </div>
                <p className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{stat.subValue}</p>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produção Diária (Linha) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-72">
              <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Produção Diária (R$)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={dailyVolumeLine}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={4} dot={{ r: 4, fill: '#ea580c' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Produção Mensal (Barras) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-72">
              <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Produção Mensal (R$)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={monthlyVolumeBar}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="value" fill="#0f172a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status OPs (Pizza) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-auto sm:h-72">
              <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Status OPs</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-48 w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={opStatusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                        {opStatusPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:min-w-32 space-y-2">
                   {opStatusPie.map(e => (
                     <div key={e.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }}></div>
                        <span className="text-[10px] font-black text-gray-900 uppercase">{e.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 ml-auto">{e.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Gargalos Produção (Colunas) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-72">
              <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Gargalos Produção (Horas)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={bottlenecks}>
                  <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <Bar dataKey="hours" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Extra: Instalações e Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Instalações */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Instalações Agendadas</h3>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Próximas 24h</span>
             </div>
             <div className="space-y-4">
                {[
                  { id: '1', client: 'Eduardo G. - Loft Pinheiros', time: '14:30', status: 'confirmado' },
                  { id: '2', client: 'Marina L. - Res. Ipanema', time: '09:00', status: 'em deslocamento' },
                  { id: '3', client: 'Escritório Hub Tech', time: '11:15', status: 'confirmado' },
                  { id: '4', client: 'Casa de Campo Atibaia', time: '08:00', status: 'agendado' },
                  { id: '5', client: 'Studio 45 - Brooklin', time: '16:45', status: 'confirmado' },
                ].map(inst => (
                  <div key={inst.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase">{inst.client}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{inst.time}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${inst.status === 'confirmado' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {inst.status}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* Projetos em Andamento */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Projetos em Andamento</h3>
            <div className="space-y-6">
                {[
                  { name: 'Cozinha Gourmet Luxo', progress: 85, color: '#f97316' },
                  { name: 'Suíte Master Ripado', progress: 42, color: '#0ea5e9' },
                  { name: 'Living Integrado', progress: 12, color: '#8b5cf6' },
                  { name: 'Adega Climatizada', progress: 68, color: '#10b981' },
                  { name: 'Closet Walk-in', progress: 25, color: '#f43f5e' },
                ].map((p, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight group-hover:text-orange-600 transition-colors">{p.name}</span>
                       <span className="text-[10px] font-black text-gray-400">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.progress}%`, backgroundColor: p.color }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;
