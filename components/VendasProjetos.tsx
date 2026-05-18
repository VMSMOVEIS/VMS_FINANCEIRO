import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Paperclip, 
  History, 
  User, 
  FileText,
  ChevronRight,
  MoreVertical,
  X,
  Eye,
  Download,
  Share2
} from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  arquiteto: string;
  status: 'modelagem' | 'render' | 'revisao' | 'aprovado';
  versao: string;
  ultimaAlteracao: string;
  anexos: number;
  comentarios: number;
  thumb?: string;
  progresso: number;
}

export const VendasProjetos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);

  const projetos: Projeto[] = [
    {
      id: 'PRJ-2026-045',
      nome: 'Cozinha Planejada - Apto 102',
      cliente: 'Mariana Souza',
      arquiteto: 'Gabriel (Interno)',
      status: 'render',
      versao: 'V2.4',
      ultimaAlteracao: '10/05/2026',
      anexos: 8,
      comentarios: 12,
      progresso: 75
    },
    {
      id: 'PRJ-2026-042',
      nome: 'Quarto Casal - Suite Master',
      cliente: 'Condomínio Solar',
      arquiteto: 'Ana Clara (Externa)',
      status: 'aprovado',
      versao: 'V3.1 (Final)',
      ultimaAlteracao: '05/05/2026',
      anexos: 15,
      comentarios: 4,
      progresso: 100
    },
    {
      id: 'PRJ-2026-048',
      nome: 'Home Office - Conceito Aberto',
      cliente: 'João Pedro',
      arquiteto: 'Gabriel (Interno)',
      status: 'modelagem',
      versao: 'V1.0',
      ultimaAlteracao: '12/05/2026',
      anexos: 3,
      comentarios: 0,
      progresso: 20
    }
  ];

  const getStatusStyle = (status: Projeto['status']) => {
    switch (status) {
      case 'modelagem': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'render': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'revisao': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'aprovado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
            <span className="text-indigo-600">Modelagem e Renderização</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Projetos e Modelagem 3D
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Controle de versões, renderizações e aprovações técnicas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all text-xs font-black shadow-lg shadow-slate-200">
            <Plus size={18} />
            Novo Projeto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Project Library */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar projeto, etapa ou cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
            </div>
            <div className="flex items-center gap-1">
              {['Modelagem', 'Render', 'Revisão', 'Aprovado'].map(cat => (
                <button key={cat} className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {projetos.map(projeto => (
               <div 
                 key={projeto.id}
                 onClick={() => setSelectedProjeto(projeto)}
                 className="bg-white rounded-[2.5rem] p-6 border-2 border-transparent hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all cursor-pointer group flex flex-col"
               >
                 <div className="aspect-[16/9] bg-slate-100 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center border border-slate-50">
                    <ImageIcon size={48} className="text-slate-200" />
                    <div className="absolute top-4 right-4">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(projeto.status)} shadow-lg`}>
                          {projeto.status}
                       </span>
                    </div>
                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/30 rounded-full overflow-hidden blur-[0.5px]">
                       <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: `${projeto.progresso}%` }} />
                    </div>
                 </div>

                 <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{projeto.nome}</h3>
                          <p className="text-xs font-bold text-slate-400 italic mt-1">{projeto.cliente}</p>
                       </div>
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Share2 size={16} /></button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[9px]">
                             {projeto.arquiteto.substring(0, 1)}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 tracking-tight">{projeto.arquiteto}</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-400">
                          <div className="flex items-center gap-1"><Paperclip size={12} /><span className="text-[10px] font-black">{projeto.anexos}</span></div>
                          <div className="flex items-center gap-1"><MessageSquare size={12} /><span className="text-[10px] font-black">{projeto.comentarios}</span></div>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right: Project Work Station */}
        <div className="xl:col-span-4 h-fit sticky top-8">
           {selectedProjeto ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                         <Box size={24} />
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none">{selectedProjeto.versao}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: {selectedProjeto.status}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedProjeto(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                      <span>Progresso do Arquivo</span>
                      <span className="text-indigo-600">{selectedProjeto.progresso}%</span>
                   </div>
                   <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-50">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full shadow-lg shadow-indigo-100 animate-pulse" style={{ width: `${selectedProjeto.progresso}%` }} />
                   </div>
                </div>

                {/* Sub-modules for Projects */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Painel de Revisões</h5>
                   <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-500 transition-all group">
                         <Eye size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                         <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">Abrir Render</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-emerald-500 transition-all group">
                         <Download size={24} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                         <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">Baixar OBJ</span>
                      </button>
                   </div>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Histórico de Alterações</h5>
                   <div className="space-y-6 pl-4 border-l-2 border-slate-100">
                      {[
                        { time: 'Today', event: 'Alteração de textura do MDF', user: 'Gabriel' },
                        { time: 'Yesterday', event: 'Versão V2.3 Exportada', user: 'Gabriel' },
                        { time: '08/05', event: 'Solicitação de Revisão', user: 'Mariana (Cliente)' }
                      ].map((log, i) => (
                        <div key={i} className="relative">
                           <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-[0_0_0_4px_white]" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{log.time}</span>
                              <p className="text-xs font-black text-slate-800 italic leading-snug">{log.event}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><User size={10} /> Por: {log.user}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Ver Histórico Completo</button>
                </div>

                {/* Final Submission Card */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                      <CheckCircle2 size={64} />
                   </div>
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Aprovação Formal</h4>
                   <p className="text-xs text-slate-300 font-bold mb-6 italic leading-relaxed opacity-90">Este projeto está pronto para envio final de aprovação?</p>
                   <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-3">
                      Solicitar Aprovação <ChevronRight size={16} />
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-white/20">
                   <Layers size={48} className="animate-bounce" />
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tight leading-none">Estação de Trabalho</h3>
                   <p className="text-xs text-indigo-200 italic mt-3 font-medium">Selecione um projeto para gerenciar o andamento técnico, versões e renders.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <div className="bg-white/10 p-5 rounded-3xl text-center border border-white/10">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Peças OBJ</p>
                      <p className="text-xl font-black">128</p>
                   </div>
                   <div className="bg-white/10 p-5 rounded-3xl text-center border border-white/10">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Renders/H</p>
                      <p className="text-xl font-black">4.2</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasProjetos;
