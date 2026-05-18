import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  ChevronRight,
  Timer,
  ClipboardCheck,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProduction } from '../src/context/ProductionContext';
import { ProductionOrder } from '../types';

interface ProductionSectorProps {
  name: string;
  moduleId: string;
  icon: any;
}

export const ProductionSector: React.FC<ProductionSectorProps> = ({ name, moduleId, icon: Icon }) => {
  const { productionOrders } = useProduction();
  const [activeTab, setActiveTab] = useState<'fila' | 'execucao' | 'qualidade'>('fila');

  // Mock data for the sector
  const displayOrders = productionOrders.length > 0 ? productionOrders : [
    { id: 'OP-2024-950', productName: `Serviço de ${name} - Lote 01`, client: 'Residencial Alphaville', deadline: '2024-06-20', status: moduleId, progress: 0 },
    { id: 'OP-2024-951', productName: `Serviço de ${name} - Lote 02`, client: 'Condomínio Morumbi', deadline: '2024-06-22', status: moduleId, progress: 0 },
    { id: 'OP-2024-952', productName: `Serviço de ${name} - Lote 03`, client: 'Edifício Central', deadline: '2024-06-25', status: moduleId, progress: 0 },
    { id: 'OP-2024-953', productName: `Serviço de ${name} - Lote 04`, client: 'Residencial Jardins', deadline: '2024-06-28', status: moduleId, progress: 0 },
    { id: 'OP-2024-954', productName: `Serviço de ${name} - Lote 05`, client: 'Village Park', deadline: '2024-06-30', status: moduleId, progress: 0 },
  ];

  const chartData = [
    { name: 'Seg', efi: 88 },
    { name: 'Ter', efi: 94 },
    { name: 'Qua', efi: 82 },
    { name: 'Qui', efi: 91 },
    { name: 'Sex', efi: 96 },
    { name: 'Sab', efi: 85 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Icon className="text-orange-600" size={24} />
            Setor de {name}
          </h1>
          <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest">Operação e Controle de Fluxo</p>
        </div>

        <div className="flex items-center">
           <div className="flex bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto no-scrollbar max-w-full">
              <button 
                onClick={() => setActiveTab('fila')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'fila' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Fila ({displayOrders.length})
              </button>
              <button 
                onClick={() => setActiveTab('execucao')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'execucao' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Execução (3)
              </button>
              <button 
                onClick={() => setActiveTab('qualidade')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'qualidade' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Qualidade
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'fila' && (
            <div className="grid grid-cols-1 gap-4">
              {displayOrders.length > 0 ? (
                displayOrders.slice(0, 6).map(order => (
                  <div key={order.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{order.id}</span>
                         <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Prioritário</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight line-clamp-1">{order.productName}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <Users size={12} className="text-gray-400" />
                          <span className="truncate max-w-[120px]">{order.client}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <Clock size={12} className="text-gray-400" />
                          Previsto: {new Date(order.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                      <div className="text-left md:block mr-2 sm:mr-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Carga</p>
                        <p className="text-xs sm:text-sm font-black text-gray-900">4h 30m</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all group-hover:shadow-lg group-hover:shadow-orange-200">
                        <Play size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />
                        Iniciar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={24} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase">Nenhuma OP na fila</h3>
                  <p className="text-xs text-gray-500 mt-1">Todas as ordens de produção deste setor foram processadas.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'execucao' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Timer size={120} />
                    </div>
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">OP-2024-00{i}</span>
                            <h3 className="text-lg font-black uppercase tracking-tight mt-1">Cozinha Planejada - Mod 0{i}</h3>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Em Processo</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4 my-6">
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tempo Corrido</p>
                            <p className="text-xl font-black font-mono">01:45:22</p>
                          </div>
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Operador</p>
                            <p className="text-sm font-black uppercase">Ricardo M.</p>
                          </div>
                       </div>

                       <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Interromper
                          </button>
                          <button className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-900/40">
                            Finalizar Etapa
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'qualidade' && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <ClipboardCheck size={32} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Checklist de Qualidade - {name}</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2 font-medium">Selecione uma OP em finalização para realizar a inspeção técnica.</p>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Eficiência do Setor</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEfi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="efi" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorEfi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Média Semanal</p>
                <p className="text-xl font-black text-gray-900">89.3%</p>
              </div>
              <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg flex items-center gap-1">
                <TrendingUp size={12} />
                +4.2%
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4">Avisos e Notas</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-[11px] font-bold text-gray-300">Manutenção preventiva marcada para Sábado às 14h.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-[11px] font-bold text-gray-300">Nova ferramenta de medição a laser disponível na bancada 02.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
