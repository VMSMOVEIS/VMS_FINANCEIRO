import React, { useState } from 'react';
import { 
  Clock, 
  MessageSquare, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  Calendar, 
  ChevronRight, 
  History, 
  CheckCircle2, 
  Bell, 
  X, 
  Filter, 
  User, 
  MoreVertical, 
  Send,
  Smartphone,
  Facebook,
  Instagram,
  Target
} from 'lucide-react';

interface FollowUp {
  id: string;
  cliente: string;
  assunto: string;
  dataAgendada: string;
  horario: string;
  canal: 'whatsapp' | 'telefone' | 'email' | 'reuniao';
  status: 'pendente' | 'concluido' | 'atrasado';
  prioridade: 'alta' | 'media' | 'baixa';
  vendedor: string;
  historico: { data: string; acao: string; resultado: string }[];
}

export const VendasFollowUp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);

  const followUps: FollowUp[] = [
    {
      id: 'FLU-001',
      cliente: 'Ana Clara Oliveira',
      assunto: 'Retornar sobre o orçamento #2026-45',
      dataAgendada: '2026-05-12',
      horario: '14:30',
      canal: 'whatsapp',
      status: 'pendente',
      prioridade: 'alta',
      vendedor: 'Gabriel Ferreira',
      historico: [
        { data: '10/05/2026', acao: 'Envio de Proposta', resultado: 'Visualizada, cliente pediu para pensar.' }
      ]
    },
    {
      id: 'FLU-002',
      cliente: 'Roberto Mendonça',
      assunto: 'Agendar visita showroom',
      dataAgendada: '2026-05-12',
      horario: '10:00',
      canal: 'telefone',
      status: 'atrasado',
      prioridade: 'media',
      vendedor: 'Camila Lima',
      historico: [
        { data: '05/05/2026', acao: 'Primeiro Contato', resultado: 'Interesse em projeto corporativo.' }
      ]
    },
    {
      id: 'FLU-003',
      cliente: 'Condomínio Solar',
      assunto: 'Fechamento de Contrato',
      dataAgendada: '2026-05-13',
      horario: '16:00',
      canal: 'reuniao',
      status: 'pendente',
      prioridade: 'alta',
      vendedor: 'Marcos Silva',
      historico: []
    }
  ];

  const getCanalIcon = (canal: FollowUp['canal']) => {
    switch (canal) {
      case 'whatsapp': return <Smartphone size={16} className="text-emerald-500" />;
      case 'telefone': return <Phone size={16} className="text-blue-500" />;
      case 'email': return <Mail size={16} className="text-amber-500" />;
      case 'reuniao': return <User size={16} className="text-indigo-500" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            <span>Comercial</span>
            <span className="text-gray-300">›</span>
            <span className="text-indigo-600">Gestão de Retornos</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Follow-up & Lembretes
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Controle de engajamento do lead e agendamento de retorno multicanal.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all text-xs font-black shadow-lg shadow-slate-200">
            <Plus size={18} />
            Novo Lembrete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Agenda Grid */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar contato ou assunto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div className="flex items-center gap-1">
                 {['Hoje', 'Atrasados', 'Pendente', 'Concluído'].map(filter => (
                   <button key={filter} className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${filter === 'Hoje' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                     {filter}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followUps.map(fu => (
                <div 
                  key={fu.id}
                  onClick={() => setSelectedFollowUp(fu)}
                  className={`bg-white rounded-[2.5rem] p-6 border-2 transition-all cursor-pointer group ${selectedFollowUp?.id === fu.id ? 'border-indigo-500 shadow-xl shadow-indigo-50' : 'border-transparent shadow-sm hover:border-slate-200'}`}
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl border ${fu.status === 'atrasado' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                         {getCanalIcon(fu.canal)}
                      </div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border shadow-sm ${fu.prioridade === 'alta' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                         {fu.prioridade}
                      </span>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-none mb-1">{fu.cliente}</h3>
                         <p className="text-[10px] font-bold text-slate-400 italic truncate">{fu.assunto}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <Clock size={12} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-700">{fu.dataAgendada === '2026-05-12' ? 'HOJE' : fu.dataAgendada} às {fu.horario}</span>
                         </div>
                         <button className="p-2 text-slate-200 hover:text-indigo-600 transition-all"><ChevronRight size={18} /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Management Station */}
        <div className="xl:col-span-4 space-y-6 sticky top-8">
           {selectedFollowUp ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 animate-in slide-in-from-right duration-500 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">{selectedFollowUp.cliente}</h2>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">{selectedFollowUp.vendedor}</p>
                   </div>
                   <button onClick={() => setSelectedFollowUp(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                   {/* Actions */}
                   <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-slate-800 transition-all group">
                         <CheckCircle2 size={24} className="mb-2 text-emerald-400 group-hover:scale-110" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Resolver</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800 rounded-[2rem] border-2 border-transparent hover:border-indigo-500 transition-all group">
                         <Bell size={24} className="mb-2 text-indigo-600 group-hover:scale-110" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Adiar 24h</span>
                      </button>
                   </div>

                   {/* Comm Channels */}
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Canais de Ação</h4>
                      <div className="flex gap-2">
                         <button className="flex-1 p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Smartphone size={18} /> <span className="text-[10px] font-black uppercase">WhatsApp</span>
                         </button>
                         <button className="flex-1 p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Mail size={18} /> <span className="text-[10px] font-black uppercase">E-mail</span>
                         </button>
                      </div>
                   </div>

                   {/* Quick History Overlay */}
                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Histórico do Engajamento</h4>
                         <History size={14} className="text-slate-300" />
                      </div>
                      <div className="space-y-3">
                         {selectedFollowUp.historico.length > 0 ? selectedFollowUp.historico.map((h, i) => (
                           <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{h.acao}</span>
                                 <span className="text-[10px] font-bold text-slate-400 italic">{h.data}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-700 italic leading-snug">{h.resultado}</p>
                           </div>
                         )) : <p className="text-[10px] font-bold text-slate-400 italic p-4 bg-slate-50 rounded-2xl text-center">Nenhum evento registrado.</p>}
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-white/10 rounded-[3rem] flex items-center justify-center shadow-inner border border-white/20">
                   <Target size={48} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">Motor de Engajamento</h3>
                   <p className="text-xs text-indigo-200 italic mt-4 max-w-[200px] mx-auto leading-relaxed">Não perca o 'timing' da venda. O follow-up regular aumenta a conversão em até 40%.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-[9px] font-black text-indigo-200 uppercase mb-1">Realizados/Mês</p>
                      <p className="text-xl font-black">284</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-[9px] font-black text-indigo-200 uppercase mb-1">Tickets Aberto</p>
                      <p className="text-xl font-black">42</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasFollowUp;
