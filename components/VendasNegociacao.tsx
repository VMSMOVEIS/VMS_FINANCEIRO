import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Search, 
  Filter, 
  History, 
  MessageSquare, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  User, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  DollarSign,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

interface Negociacao {
  id: string;
  cliente: string;
  valor: number;
  propostaOriginal: string;
  dataInicio: string;
  ultimoContato: string;
  proximoFollowUp: string;
  status: 'em_aberto' | 'ganho' | 'perdido' | 'pausado';
  motivoPerda?: string;
  probabilidade: number;
  vendedor: string;
  etapa: 'proposta' | 'negociacao' | 'contrato' | 'fechamento';
  historico: { data: string; evento: string; observacao: string }[];
}

export const VendasNegociacao: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNegociacao, setSelectedNegociacao] = useState<Negociacao | null>(null);

  const negociacoes: Negociacao[] = [
    {
      id: 'NEG-2026-089',
      cliente: 'Ricardo Santos - Projeto Comercial',
      valor: 125000.00,
      propostaOriginal: 'ORC-2026-456',
      dataInicio: '2026-05-01',
      ultimoContato: '2026-05-10',
      proximoFollowUp: '2026-05-13',
      status: 'em_aberto',
      probabilidade: 75,
      vendedor: 'Camila Lima',
      etapa: 'negociacao',
      historico: [
        { data: '2026-05-10', evento: 'Follow-up Realizado', observacao: 'Cliente solicitou parcelamento em 12x sem juros.' },
        { data: '2026-05-05', evento: 'Objeção de Preço', observacao: 'Comparando com concorrente premium.' }
      ]
    },
    {
      id: 'NEG-2026-077',
      cliente: 'Ana Paula Ferreira',
      valor: 45800.00,
      propostaOriginal: 'ORC-2026-422',
      dataInicio: '2026-04-25',
      ultimoContato: '2026-05-08',
      proximoFollowUp: '2026-05-12',
      status: 'ganho',
      probabilidade: 100,
      vendedor: 'Marcos Silva',
      etapa: 'fechamento',
      historico: [
        { data: '2026-05-08', evento: 'Aprovação Verbal', observacao: 'Contrato enviado no dia 09.' }
      ]
    },
    {
      id: 'NEG-2026-065',
      cliente: 'Restaurante Sabor & Arte',
      valor: 89000.00,
      propostaOriginal: 'ORC-2026-390',
      dataInicio: '2026-04-10',
      ultimoContato: '2026-05-01',
      proximoFollowUp: '',
      status: 'perdido',
      motivoPerda: 'Preço/Orçamento excede teto disponível',
      probabilidade: 0,
      vendedor: 'Camila Lima',
      etapa: 'fechamento',
      historico: [
        { data: '2026-05-01', evento: 'Projeto Cancelado', observacao: 'Cliente optou por reforma parcial apenas.' }
      ]
    }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            <span>Comercial</span>
            <span className="text-gray-300">›</span>
            <span className="text-indigo-600">Fechamentos e Follow-up</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Negociação & Fechamento
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Follow-up ativo, tratativa de objeções e motivos de perda.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 px-4 border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Perda / Mês</span>
              <span className="text-sm font-black text-rose-500">12%</span>
           </div>
           <div className="flex items-center gap-2 px-4 border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Tempo Médio</span>
              <span className="text-sm font-black text-slate-800">14 dias</span>
           </div>
           <div className="flex items-center gap-2 px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase">Pipeline</span>
              <span className="text-sm font-black text-indigo-600">R$ 1.2M</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Active Negotiations List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar negociação, motivo ou vendedor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Filter size={16} /> Status
            </button>
          </div>

          <div className="space-y-4">
             {negociacoes.map(neg => (
               <div 
                 key={neg.id}
                 onClick={() => setSelectedNegociacao(neg)}
                 className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer group ${selectedNegociacao?.id === neg.id ? 'border-indigo-500 shadow-xl shadow-indigo-50' : 'border-transparent shadow-sm hover:border-slate-200'}`}
               >
                 <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-[2rem] flex flex-col items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 duration-500 ${neg.status === 'ganho' ? 'bg-emerald-500' : neg.status === 'perdido' ? 'bg-rose-500' : 'bg-indigo-600'}`}>
                       <Target size={24} />
                       <span className="text-[9px] font-black mt-1">{neg.probabilidade}%</span>
                    </div>

                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">{neg.cliente}</h3>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Vendedor: {neg.vendedor}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">R$ {neg.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                             <span className="text-[9px] font-black p-1 bg-slate-50 text-slate-400 rounded-lg uppercase border border-slate-100 tracking-tighter">Proposta: {neg.propostaOriginal}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Clock size={14} /></div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Próx. Follow-up</p>
                                <p className="text-xs font-black text-slate-800">{neg.proximoFollowUp || '-'}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><History size={14} /></div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Status Atual</p>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{neg.status.replace('_', ' ')}</p>
                             </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                             {neg.status === 'ganho' ? <CheckCircle2 className="text-emerald-500" size={20} /> : neg.status === 'perdido' ? <XCircle className="text-rose-500" size={20} /> : <AlertCircle className="text-amber-500 animate-pulse" size={20} />}
                             <ChevronRight size={18} className="text-slate-200" />
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right: Negotiation Board */}
        <div className="xl:col-span-4 space-y-6">
           {selectedNegociacao ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-8 animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black text-slate-800 tracking-tight">Tratativa de Negócio</h2>
                   <button onClick={() => setSelectedNegociacao(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-8">
                   {/* Negotiation Control */}
                   {selectedNegociacao.status === 'em_aberto' ? (
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registrar Fechamento</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button className="flex flex-col items-center justify-center gap-3 p-6 bg-emerald-50 text-emerald-600 rounded-[2.5rem] hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 group">
                              <CheckCircle2 size={32} className="group-hover:scale-110 transition-all" />
                              <span className="text-[10px] font-black uppercase tracking-widest tracking-tighter">Negócio Ganho</span>
                           </button>
                           <button className="flex flex-col items-center justify-center gap-3 p-6 bg-rose-50 text-rose-600 rounded-[2.5rem] hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 group">
                              <XCircle size={32} className="group-hover:scale-110 transition-all" />
                              <span className="text-[10px] font-black uppercase tracking-widest tracking-tighter">Negócio Perdido</span>
                           </button>
                        </div>
                     </div>
                   ) : (
                     <div className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 ${selectedNegociacao.status === 'ganho' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedNegociacao.status === 'ganho' ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                           {selectedNegociacao.status === 'ganho' ? <DollarSign size={24} /> : <TrendingDown size={24} />}
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase opacity-60">Status Final</p>
                           <p className="text-lg font-black leading-none">{selectedNegociacao.status === 'ganho' ? 'NEGÓCIO FECHADO' : 'VENDA PERDIDA'}</p>
                           {selectedNegociacao.motivoPerda && <p className="text-[10px] font-bold mt-2 italic">Motivo: {selectedNegociacao.motivoPerda}</p>}
                        </div>
                     </div>
                   )}

                   {/* Timeline / Follow-up */}
                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Histórico de Contatos</h4>
                         <button className="text-[9px] font-black text-indigo-600 uppercase border-b-2 border-indigo-100">+ Novo Follow-up</button>
                      </div>
                      <div className="space-y-4">
                         {selectedNegociacao.historico.map((h, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className="flex flex-col items-center">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm">{new Date(h.data).getDate()}</div>
                                 <div className="flex-1 w-0.5 bg-slate-100 my-1" />
                              </div>
                              <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{h.evento}</span>
                                    <span className="text-[10px] font-bold text-slate-400 italic">{h.data}</span>
                                 </div>
                                 <p className="text-xs text-slate-600 font-bold leading-relaxed">{h.observacao}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Key Information */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Documentação</h4>
                      <div className="grid grid-cols-1 gap-2">
                         <button className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white group hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-3">
                               <FileText size={18} className="text-indigo-400" />
                               <span className="text-xs font-black">Visualizar Proposta</span>
                            </div>
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-indigo-100">
                   <Target size={40} className="animate-spin-slow" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight">Funil Comercial Ativo</h3>
                   <p className="text-xs text-slate-400 font-medium italic mt-2">Clique em um negócio para ver objeções, follow-ups e gerenciar o fechamento.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conversão</p>
                      <p className="text-lg font-black text-emerald-600">68%</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ticket Médio</p>
                      <p className="text-lg font-black text-indigo-600">R$ 82k</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasNegociacao;
