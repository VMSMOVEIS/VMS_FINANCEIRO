import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Maximize2, 
  Camera, 
  ClipboardCheck, 
  MessageSquare, 
  Navigation, 
  Phone,
  Ruler,
  Image as ImageIcon,
  ChevronRight,
  MoreVertical,
  X,
  Target
} from 'lucide-react';

interface VisitaTecnica {
  id: string;
  cliente: string;
  contato: string;
  telefone: string;
  endereco: string;
  data: string;
  horario: string;
  status: 'agendada' | 'realizada' | 'em_analise' | 'convertida';
  tecnico: string;
  prioridade: 'alta' | 'media' | 'baixa';
  observacoes?: string;
  checklist?: { item: string; concluido: boolean }[];
  fotos?: string[];
  medidas?: { ambiente: string; arquivo: string }[];
}

export const VendasVisitas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisita, setSelectedVisita] = useState<VisitaTecnica | null>(null);
  const [view, setView] = useState<'lista' | 'calendario'>('lista');

  const visitas: VisitaTecnica[] = [
    {
      id: 'VIS-2026-001',
      cliente: 'Condomínio Solar das Palmeiras',
      contato: 'Eng. Roberto Farias',
      telefone: '(19) 99824-3312',
      endereco: 'Av. das Palmeiras, 450 - Unidade 102, Campinas - SP',
      data: '2026-05-12',
      horario: '10:00',
      status: 'agendada',
      tecnico: 'Gabriel Oliveira',
      prioridade: 'alta',
      observacoes: 'Levar trena a laser e conferir espelhos das tomadas.',
      checklist: [
        { item: 'Conferir pontos de hidráulica', concluido: false },
        { item: 'Medir pé direito', concluido: false },
        { item: 'Verificar prumada das paredes', concluido: false }
      ]
    },
    {
      id: 'VIS-2026-002',
      cliente: 'Mariana Souza',
      contato: 'Mariana Souza',
      telefone: '(19) 98124-5567',
      endereco: 'Rua General Osório, 120, Campinas - SP',
      data: '2026-05-12',
      horario: '14:30',
      status: 'realizada',
      tecnico: 'Gabriel Oliveira',
      prioridade: 'media',
      fotos: ['img_01.jpg', 'img_02.jpg']
    },
    {
      id: 'VIS-2026-003',
      cliente: 'Escritório Advocacia Silva',
      contato: 'Dr. Marcos Silva',
      telefone: '(19) 3244-1100',
      endereco: 'Rua Major Solon, 678 - Sala 12, Campinas - SP',
      data: '2026-05-13',
      horario: '09:00',
      status: 'em_analise',
      tecnico: 'Felipe Santos',
      prioridade: 'baixa'
    }
  ];

  const getStatusStyle = (status: VisitaTecnica['status']) => {
    switch (status) {
      case 'agendada': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'realizada': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'em_analise': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'convertida': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const getStatusLabel = (status: VisitaTecnica['status']) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            <span>Comercial</span>
            <span className="text-gray-300">›</span>
            <span className="text-blue-600">Gestão de Visitas Técnicas</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Logística e Medição
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Agenda, checklist técnico, fotos e conversão de propostas.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('lista')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${view === 'lista' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Agenda
            </button>
            <button 
              onClick={() => setView('calendario')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${view === 'calendario' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Calendário
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all text-xs font-black shadow-lg shadow-slate-200">
            <Plus size={18} />
            Agendar Visita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Agenda/Visits List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar visita, cliente ou técnico..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:italic"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-5 py-3 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Filter size={16} /> Filtros
              </button>
            </div>
          </div>

          <div className="space-y-4">
             {visitas.map((visita) => (
               <div 
                 key={visita.id}
                 onClick={() => setSelectedVisita(visita)}
                 className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer group hover:shadow-xl hover:shadow-slate-200/50 ${selectedVisita?.id === visita.id ? 'border-blue-500 shadow-xl shadow-slate-200/50' : 'border-transparent shadow-sm hover:border-slate-200'}`}
               >
                 <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-[2rem] text-white min-w-[100px] shadow-lg shadow-slate-200 transition-transform group-hover:scale-105 duration-500">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{new Date(visita.data).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                       <span className="text-3xl font-black">{new Date(visita.data).getDate()}</span>
                       <span className="text-xs font-black mt-2 bg-white/20 px-2 py-0.5 rounded-full">{visita.horario}</span>
                    </div>

                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{visita.cliente}</h3>
                             <p className="text-xs font-bold text-slate-400 italic flex items-center gap-1">
                                <MapPin size={14} className="text-blue-500" /> {visita.endereco}
                             </p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(visita.status)} shadow-sm`}>
                             {getStatusLabel(visita.status)}
                          </span>
                       </div>

                       <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Clock size={14} /></div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Técnico Resp.</p>
                                <p className="text-xs font-black text-slate-800">{visita.tecnico}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Contato Fone</p>
                                <p className="text-xs font-black text-slate-800">{visita.telefone}</p>
                             </div>
                          </div>
                          <div className="flex-1" />
                          <div className="flex items-center gap-2">
                             {visita.fotos && visita.fotos.length > 0 && <ImageIcon size={18} className="text-emerald-500" />}
                             {visita.checklist && <ClipboardCheck size={18} className="text-blue-500" />}
                             <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Column: Mini Dashboard / Selected Visit Details */}
        <div className="xl:col-span-4 space-y-6">
          {selectedVisita ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-8 animate-in slide-in-from-right duration-500">
               <div className="flex justify-between items-start mb-8">
                  <div>
                     <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">Painel Técnico</h2>
                     <p className="text-xs text-slate-400 font-bold italic mt-1">{selectedVisita.id}</p>
                  </div>
                  <button onClick={() => setSelectedVisita(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
               </div>

               <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center justify-center gap-2 py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Navigation size={16} /> Rota GPS
                     </button>
                     <button className="flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                        <CheckCircle2 size={16} /> Confirmar
                     </button>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Checklist de Campo</h3>
                     <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3">
                        {selectedVisita.checklist ? selectedVisita.checklist.map((item, i) => (
                           <div key={i} className="flex items-center gap-3 group cursor-pointer">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.concluido ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200'}`}>
                                 {item.concluido && <CheckCircle2 size={14} />}
                              </div>
                              <span className={`text-xs font-bold ${item.concluido ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.item}</span>
                           </div>
                        )) : <p className="text-[10px] font-bold text-slate-400 italic text-center p-4">Nenhum checklist definido.</p>}
                        <button className="w-full mt-4 py-2 text-[9px] font-black text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all uppercase">Adicionar Item</button>
                     </div>
                  </div>

                  {/* Multimedia */}
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fotos & Medições</h3>
                     <div className="grid grid-cols-3 gap-3">
                        {[1, 2].map(i => (
                           <div key={i} className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300 relative group overflow-hidden cursor-pointer">
                              <ImageIcon size={24} className="group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Plus size={16} className="text-white" />
                              </div>
                           </div>
                        ))}
                        <button className="aspect-square bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                           <Camera size={20} />
                           <span className="text-[8px] font-black uppercase">Novo</span>
                        </button>
                     </div>
                  </div>

                  {/* Observations */}
                  <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare size={64} />
                     </div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">Observações Técnicas</h4>
                     <p className="relative text-xs text-slate-300 font-bold italic leading-relaxed opacity-90">
                        {selectedVisita.observacoes || 'Nenhuma observação técnica pendente para este atendimento.'}
                     </p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 text-center space-y-6 animate-in fade-in duration-700">
               <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-blue-100">
                  <Target size={40} className="animate-pulse" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Performance de Campo</h3>
                  <p className="text-xs text-slate-400 font-medium italic mt-2">Acompanhe a assertividade técnica.</p>
               </div>
               
               <div className="space-y-4 pt-6">
                  {[
                     { label: 'Hoje', val: '02', total: '05', color: 'text-blue-600', icon: CalendarIcon },
                     { label: 'Concluídas', val: '12', total: '20', color: 'text-emerald-600', icon: CheckCircle2 },
                     { label: 'Conversão', val: '65', total: '100', color: 'text-indigo-600', icon: TrendingUp }
                  ].map((stat, i) => (
                     <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-50 transition-all hover:bg-slate-50">
                        <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${stat.color}`}>
                           <stat.icon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                           <div className="flex items-end gap-1">
                              <span className="text-xl font-black text-slate-800 leading-none">{stat.val}</span>
                              {stat.label === 'Conversão' ? <span className="text-[10px] font-black text-slate-400 mb-0.5">%</span> : <span className="text-[10px] font-black text-slate-400 mb-0.5">/ {stat.total}</span>}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendasVisitas;

import { TrendingUp, Cake } from 'lucide-react';
