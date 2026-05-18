import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

export const ProductionKPIs: React.FC = () => {
  const data = [
    { name: 'Seg', prod: 45, meta: 40 },
    { name: 'Ter', prod: 52, meta: 40 },
    { name: 'Qua', prod: 38, meta: 40 },
    { name: 'Qui', prod: 65, meta: 40 },
    { name: 'Sex', prod: 48, meta: 40 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-orange-600" size={28} />
            Métricas e Indicadores (KPIs)
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Data-Driven Production Intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIBox label="OEE Global" value="84.2%" trend="+2.4%" positive={true} />
        <KPIBox label="Produtividade" value="92.1%" trend="+1.1%" positive={true} />
        <KPIBox label="Lead Time Médio" value="12.4 d" trend="+0.5 d" positive={false} />
        <KPIBox label="Refugo / Perda" value="1.82%" trend="-0.4%" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Performance vs Meta (Diário)</h3>
            <ResponsiveContainer width="100%" height="85%">
               <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="prod" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                  <Area type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Eficiência por Célula</h3>
            <ResponsiveContainer width="100%" height="85%">
               <BarChart data={[
                 { name: 'Corte', efi: 94 },
                 { name: 'Usinagem', efi: 78 },
                 { name: 'Montagem', efi: 88 },
                 { name: 'Acabamento', efi: 91 },
               ]}>
                 <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                 <YAxis fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                 <Bar dataKey="efi" radius={[10, 10, 0, 0]}>
                    {[1, 2, 3, 4].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#ef4444' : '#0f172a'} />
                    ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

const KPIBox: React.FC<{ label: string; value: string; trend: string; positive: boolean }> = ({ label, value, trend, positive }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-end justify-between">
       <span className="text-3xl font-black text-gray-900">{value}</span>
       <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
         {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
         {trend}
       </div>
    </div>
  </div>
);

export const ProductionReports: React.FC = () => {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <PieChart className="text-orange-600" size={28} />
              Relatórios e BI de Fábrica
            </h1>
            <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Análise histórica e Exportação de PDF/Excel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Ocorrências por Período', type: 'PDF / Excel', color: 'bg-blue-600' },
             { title: 'Produtividade por Operador', type: 'Excel', color: 'bg-emerald-600' },
             { title: 'Consumo de Matéria Prima', type: 'PDF', color: 'bg-orange-600' },
             { title: 'Custo Real de Produção', type: 'PDF', color: 'bg-rose-600' },
             { title: 'Tempo Médio por Etapa', type: 'Excel', color: 'bg-indigo-600' },
             { title: 'Relatório Qualidade Geral', type: 'PDF', color: 'bg-slate-900' },
           ].map((rep, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between h-48 cursor-pointer">
                <div>
                   <h3 className="text-sm font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase leading-tight">{rep.title}</h3>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">{rep.type}</span>
                </div>
                <div className="flex justify-end">
                   <div className={`w-10 h-10 rounded-xl ${rep.color} flex items-center justify-center text-white shadow-lg`}>
                     <PieChart size={20} />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
};
