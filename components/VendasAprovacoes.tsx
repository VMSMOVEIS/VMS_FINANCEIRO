import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  UserCheck, 
  FileCheck, 
  ClipboardCheck, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  User, 
  AlertCircle, 
  ChevronRight, 
  XCircle,
  FileText,
  ThumbsUp,
  CreditCard,
  Settings,
  MoreVertical,
  X,
  Download
} from 'lucide-react';

interface Aprovacao {
  id: string;
  cliente: string;
  projeto: string;
  vendedor: string;
  dataSolicitacao: string;
  prioridade: 'normal' | 'urgente';
  etapaAtual: 'financeira' | 'tecnica' | 'comercial' | 'checkout';
  aprovacoes: {
    financeira: boolean;
    tecnica: boolean;
    comercial: boolean;
    checkout: boolean;
  };
  valor: number;
}

export const VendasAprovacoes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAprovacao, setSelectedAprovacao] = useState<Aprovacao | null>(null);

  const aprovacoes: Aprovacao[] = [
    {
      id: 'APR-2026-001',
      cliente: 'Mariana Souza',
      projeto: 'Cozinha Planejada - Apto 102',
      vendedor: 'Camila Lima',
      dataSolicitacao: '2026-05-10',
      prioridade: 'urgente',
      etapaAtual: 'financeira',
      aprovacoes: {
        financeira: false,
        tecnica: true,
        comercial: true,
        checkout: false
      },
      valor: 45000.00
    },
    {
      id: 'APR-2026-002',
      cliente: 'Condomínio Solar das Palmeiras',
      projeto: 'Projeto Áreas Comuns',
      vendedor: 'Marcos Silva',
      dataSolicitacao: '2026-05-11',
      prioridade: 'normal',
      etapaAtual: 'checkout',
      aprovacoes: {
        financeira: true,
        tecnica: true,
        comercial: true,
        checkout: false
      },
      valor: 125000.00
    }
  ];

  const getEtapaColor = (aprovada: boolean) => aprovada ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400';
  const getEtapaBorder = (aprovada: boolean) => aprovada ? 'border-emerald-500' : 'border-slate-200';

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            <span>Comercial</span>
            <span className="text-gray-300">›</span>
            <span className="text-emerald-600">Fluxo de Aprovações Multifuncionais</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Aprovações & Check-out
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Controle Crítico: Financeiro, Técnico, Comercial e Entrega ao Cliente.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 px-4 border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pendentes</span>
              <span className="text-sm font-black text-amber-500">12</span>
           </div>
           <div className="flex items-center gap-2 px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Hold Técnico</span>
              <span className="text-sm font-black text-rose-500">04</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Global Approval Table */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar cliente, projeto ou ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div className="flex items-center gap-1">
                 {['Todas', 'Financeira', 'Técnica', 'Comercial'].map(tag => (
                   <button key={tag} className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all">
                     {tag}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Projeto / Cliente</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progresso de Aprovação</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {aprovacoes.map(apr => (
                      <tr 
                        key={apr.id} 
                        onClick={() => setSelectedAprovacao(apr)}
                        className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedAprovacao?.id === apr.id ? 'bg-emerald-50/30' : ''}`}
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500 ${apr.prioridade === 'urgente' ? 'bg-rose-500' : 'bg-emerald-600'}`}>
                                  <FileCheck size={20} />
                               </div>
                               <div>
                                  <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{apr.projeto}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{apr.cliente}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-3">
                               {[
                                 { key: 'financeira', icon: CreditCard, label: 'FIN' },
                                 { key: 'tecnica', icon: Settings, label: 'TEC' },
                                 { key: 'comercial', icon: ThumbsUp, label: 'COM' },
                                 { key: 'checkout', icon: UserCheck, label: 'OUT' }
                               ].map((step) => {
                                 const isDone = (apr.aprovacoes as any)[step.key];
                                 return (
                                   <div key={step.key} className="flex flex-col items-center gap-1">
                                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${getEtapaColor(isDone)} ${getEtapaBorder(isDone)} shadow-sm`}>
                                         <step.icon size={16} />
                                      </div>
                                      <span className="text-[8px] font-black text-slate-400">{step.label}</span>
                                   </div>
                                 );
                               })}
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <button className="p-2 bg-white text-slate-400 hover:text-emerald-500 rounded-xl border border-slate-100 shadow-sm"><CheckCircle2 size={16} /></button>
                               <button className="p-2 bg-white text-slate-400 hover:text-rose-500 rounded-xl border border-slate-100 shadow-sm"><XCircle size={16} /></button>
                               <ChevronRight size={18} className="text-slate-300" />
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Right: Detailed Step Controller */}
        <div className="xl:col-span-4 h-fit sticky top-8">
           {selectedAprovacao ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-tighter">Fluxo: {selectedAprovacao.id}</span>
                         {selectedAprovacao.prioridade === 'urgente' && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight">Auditoria de Etapas</h3>
                   </div>
                   <button onClick={() => setSelectedAprovacao(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                   {/* Targeted Approval Step */}
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all">
                         <ShieldCheck size={64} />
                      </div>
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">Pendente: Aprovação {selectedAprovacao.etapaAtual.toUpperCase()}</h4>
                      <div className="space-y-3 mb-6">
                         <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                               <DollarSign size={20} className="text-emerald-500" />
                               <div>
                                  <p className="text-[10px] font-black text-white/50 uppercase leading-none">Valor Total</p>
                                  <p className="text-lg font-black tracking-tight">R$ {selectedAprovacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} /> Aprovar
                         </button>
                         <button className="py-4 bg-white/10 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <XCircle size={16} /> Rejeitar
                         </button>
                      </div>
                   </div>

                   {/* Verification items */}
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Checklist Mandatório</h5>
                      <div className="space-y-3 bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                         {[
                           { task: 'Verificar disponibilidade de estoque', checked: true },
                           { task: 'Confirmar data de entrega no cronograma', checked: false },
                           { task: 'Validar comprovante de pagamento', checked: false }
                         ].map((t, i) => (
                           <div key={i} className="flex items-center gap-3 group cursor-pointer">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${t.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 group-hover:border-emerald-500'}`}>
                                 {t.checked && <CheckCircle2 size={14} />}
                              </div>
                              <span className={`text-xs font-bold ${t.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.task}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Documents */}
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dossiê da Venda</h5>
                      <div className="grid grid-cols-1 gap-2">
                         <button className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500 transition-all group">
                            <div className="flex items-center gap-3">
                               <FileText size={18} className="text-blue-500" />
                               <span className="text-xs font-black text-slate-700">Contrato Social/Assinado</span>
                            </div>
                            <Download size={14} className="text-slate-300 group-hover:text-emerald-500" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-white p-12 rounded-[4rem] text-center space-y-8 animate-in fade-in duration-700 border border-slate-100">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                   <ClipboardCheck size={48} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Fila de Aprovação</h3>
                   <p className="text-xs text-slate-400 font-medium italic mt-4 max-w-[200px] mx-auto leading-relaxed">Selecione uma solicitação para auditar as etapas financeira, técnica e comercial.</p>
                </div>

                <div className="pt-8 grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Escopo Técnico</p>
                      <p className="text-2xl font-black text-indigo-600">82%</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase italic tracking-tighter">Aprovações</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Check-out</p>
                      <p className="text-2xl font-black text-emerald-600">95%</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase italic tracking-tighter">Confirmados</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasAprovacoes;
