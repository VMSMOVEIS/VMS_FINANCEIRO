import React from 'react';
import { 
  Timer, 
  User, 
  Play, 
  Pause, 
  History, 
  Clock, 
  BarChart, 
  StopCircle,
  Hash,
  AlertCircle,
  CheckCircle2,
  Wrench
} from 'lucide-react';

export const ProductionTimeTracking: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Timer className="text-orange-600" size={28} />
            Apontamentos de Produção
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Registro de Tempo e Produtividade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active Timers */}
        <div className="md:col-span-2 space-y-6">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Cronômetros Ativos</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: '101', op: 'OP-2024-101', name: 'Corte de MDF Noce Oro', user: 'Carlos Eduardo', time: '02:24:11', mesa: '01' },
                { id: '102', op: 'OP-2024-102', name: 'Bordeamento de Painéis', user: 'Ricardo Mendes', time: '01:45:02', mesa: '03' },
                { id: '103', op: 'OP-2024-105', name: 'Montagem de Gabinetes', user: 'Felipe Santos', time: '00:52:18', mesa: '05' },
                { id: '104', op: 'OP-2024-108', name: 'Usinagem de Puxadores', user: 'Ana Paula', time: '03:10:45', mesa: '02' },
                { id: '105', op: 'OP-2024-110', name: 'Lixamento Fino de Portas', user: 'Marcos Vinícius', time: '00:15:33', mesa: '04' },
              ].map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white">
                      <span className="text-[10px] font-black opacity-50 uppercase leading-none mb-1">Mesa</span>
                      <span className="text-xl font-black">{item.mesa}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.op}</span>
                      <h4 className="text-base font-black text-gray-900 uppercase">{item.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <User size={10} /> Operador: {item.user}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo Atual</p>
                       <p className="text-2xl font-black text-slate-800 font-mono">{item.time}</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-orange-600 transition-all"><Pause size={20} fill="currentColor" /></button>
                       <button className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all"><StopCircle size={20} fill="currentColor" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Quick Log */}
        <div className="space-y-6">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Apontamento Manual</h3>
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Selecione a OP</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="text" placeholder="Código da OP..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Qtd Refugo</label>
                    <input type="number" placeholder="0" className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pausa (min)</label>
                    <input type="number" placeholder="0" className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none" />
                 </div>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Salvar Apontamento
              </button>
           </div>
           
           <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
              <div className="flex items-center gap-3 text-orange-600 mb-3">
                <AlertCircle size={20} />
                <h4 className="text-xs font-black uppercase tracking-widest">Aviso de Operação</h4>
              </div>
              <p className="text-[11px] text-orange-800 font-bold leading-relaxed">Não esqueça de realizar o apontamento das perdas de material para o controle de estoque preciso.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export const ProductionRework: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <AlertCircle className="text-rose-600" size={28} />
            Gestão de Retrabalho (Non-Conformity)
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Controle de Falhas e Custos de Re-execução</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'OPs em Retrabalho', value: '4', color: 'text-rose-600' },
           { label: 'Custo Refugo Mês', value: 'R$ 2.450', color: 'text-rose-600' },
           { label: 'Principal Motivo', value: 'Erro Medida', color: 'text-slate-800' },
           { label: 'Taxa Crítica', value: '2.8%', color: 'text-amber-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</span>
             <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ocorrências Ativas</h3>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">Reportar Erro</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
               <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">OP Original</th>
                  <th className="px-6 py-4">Motivo</th>
                  <th className="px-6 py-4">Setor Origem</th>
                  <th className="px-6 py-4">Custo Est.</th>
                  <th className="px-6 py-4">Ação</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {[
                  { status: 'Análise', op: 'OP-2024-918', motive: 'Furação invertida', sector: 'Usinagem', cost: 'R$ 450,00' },
                  { status: 'Novo Corte', op: 'OP-2024-902', motive: 'Chapa arranhada', sector: 'Corte', cost: 'R$ 1.200,00' },
                  { status: 'Pendente', op: 'OP-2024-895', motive: 'Fita de borda soltando', sector: 'Bordeamento', cost: 'R$ 180,00' },
                  { status: 'Execução', op: 'OP-2024-888', motive: 'Medida fora do padrão', sector: 'Montagem', cost: 'R$ 890,00' },
                  { status: 'Análise', op: 'OP-2024-877', motive: 'Cor errada do material', sector: 'Planejamento', cost: 'R$ 3.500,00' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">{row.status}</span></td>
                    <td className="px-6 py-4 font-bold text-gray-800 text-sm">{row.op}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">{row.motive}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-xs uppercase">{row.sector}</td>
                    <td className="px-6 py-4 font-bold text-rose-600 text-sm">{row.cost}</td>
                    <td className="px-6 py-4"><button className="text-blue-600 text-[10px] font-black underline uppercase tracking-widest">Ver Laudo</button></td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ProductionQuality: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={28} />
            Controle de Qualidade
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Inspeção e Conformidade Técnica</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4">OP</th>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Checklist</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { op: 'OP-2024-850', product: 'Closet Master', status: 'Aprovado', checks: '15/15' },
              { op: 'OP-2024-852', product: 'Mesa de Jantar', status: 'Reprovado', checks: '12/15' },
              { op: 'OP-2024-855', product: 'Cozinha Gourmet', status: 'Pendente', checks: '0/20' },
              { op: 'OP-2024-858', product: 'Home Office', status: 'Aprovado', checks: '10/10' },
              { op: 'OP-2024-860', product: 'Banheiro Suíte', status: 'Aprovado', checks: '8/8' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-black text-orange-600 text-xs">{row.op}</td>
                <td className="px-6 py-4 font-bold text-gray-900 text-xs uppercase">{row.product}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                    row.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600' : 
                    row.status === 'Reprovado' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-500">{row.checks} itens</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-orange-600 text-[10px] font-black uppercase tracking-widest underline">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ProductionMaintenance: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Wrench size={28} className="text-blue-600" />
            Manutenção de Ativos
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Gestão de Máquinas e Ferramentas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Próximas Manutenções</h3>
            <div className="space-y-4">
               {[
                 { machine: 'Esquadrejadeira SCM', type: 'Preventiva', date: '21/06/2024', status: 'Agendado' },
                 { machine: 'Coladeira de Borda', type: 'Troca de Faca', date: '18/06/2024', status: 'Urgente' },
                 { machine: 'CNC Nesting', type: 'Lubrificação', date: '25/06/2024', status: 'Agendado' },
                 { machine: 'Compressor Central', type: 'Filtro', date: '30/06/2024', status: 'Agendado' },
                 { machine: 'Furadeira Múltipla', type: 'Ajuste Eixo', date: '15/06/2024', status: 'Atrasado' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase">{item.machine}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.type} • {item.date}</p>
                     </div>
                     <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                       item.status === 'Urgente' ? 'bg-rose-50 text-rose-600' :
                       item.status === 'Atrasado' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                     }`}>
                       {item.status}
                     </span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
             <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-6">Indisponibilidade (Down Time)</h3>
             <div className="h-48 flex items-end gap-4">
                {[40, 70, 30, 90, 50, 20].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-t-xl relative group">
                     <div className="absolute bottom-0 left-0 right-0 bg-orange-600 rounded-t-xl transition-all duration-500" style={{ height: `${h}%` }}></div>
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}% Ocup.</div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
             </div>
          </div>
       </div>
     </div>
   );
 };
