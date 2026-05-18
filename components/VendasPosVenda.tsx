import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Download, 
  Filter, 
  Search, 
  ShieldCheck, 
  Award, 
  Gift, 
  RefreshCcw, 
  FileText, 
  Smile, 
  Frown, 
  Meh, 
  Calendar, 
  ChevronRight, 
  MoreVertical, 
  X,
  Share2,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

interface PosVenda {
  id: string;
  cliente: string;
  projeto: string;
  dataEntrega: string;
  nps: number;
  status: 'satisfeito' | 'neutro' | 'detrator';
  indicacoes: number;
  garantiaAte: string;
  recompra?: boolean;
  comentario: string;
}

export const VendasPosVenda: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeed, setSelectedFeed] = useState<PosVenda | null>(null);

  const feedbacks: PosVenda[] = [
    {
      id: 'POS-001',
      cliente: 'Mariana Souza',
      projeto: 'Cozinha Planejada - VMS',
      dataEntrega: '2026-04-15',
      nps: 10,
      status: 'satisfeito',
      indicacoes: 3,
      garantiaAte: '2028-04-15',
      recompra: false,
      comentario: 'Experiência incrível. O montador foi muito cuidadoso e o acabamento é de alto padrão.'
    },
    {
      id: 'POS-002',
      cliente: 'Ricardo Santos',
      projeto: 'Escritório Corporativo',
      dataEntrega: '2026-03-20',
      nps: 8,
      status: 'neutro',
      indicacoes: 0,
      garantiaAte: '2028-03-20',
      recompra: true,
      comentario: 'Gostei do resultado, mas o prazo de entrega atrasou 2 dias.'
    },
    {
      id: 'POS-003',
      cliente: 'Condomínio Solar',
      projeto: 'Área Gourmet',
      dataEntrega: '2026-05-02',
      nps: 9,
      status: 'satisfeito',
      indicacoes: 1,
      garantiaAte: '2028-05-02',
      recompra: false,
      comentario: 'Tudo perfeito. Já indiquei para o síndico do bloco B.'
    }
  ];

  const getStatusIcon = (status: PosVenda['status']) => {
    switch (status) {
      case 'satisfeito': return <Smile size={24} className="text-emerald-500" />;
      case 'neutro': return <Meh size={24} className="text-amber-500" />;
      case 'detrator': return <Frown size={24} className="text-rose-500" />;
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
            <span className="text-pink-600">Fidelização e Sucesso do Cliente</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Pós-Venda & NPS
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Monitoramento de satisfação, programa de indicações e garantias.</p>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm gap-6">
           <div className="flex items-center gap-3 px-4 border-r border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Award size={20} /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">NPS Geral</p>
                 <p className="text-xl font-black text-slate-800 leading-none">94.2</p>
              </div>
           </div>
           <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><RefreshCcw size={20} /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">LTV Recompra</p>
                 <p className="text-xl font-black text-slate-800 leading-none">R$ 12k</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Feedback Feed */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar feedback ou cliente..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all">
                  <Filter size={18} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbacks.map(feed => (
                <div 
                  key={feed.id}
                  onClick={() => setSelectedFeed(feed)}
                  className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all cursor-pointer group ${selectedFeed?.id === feed.id ? 'border-pink-500 shadow-xl shadow-pink-50' : 'border-transparent shadow-sm hover:border-slate-200'}`}
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-all">
                            <img src={`https://i.pravatar.cc/150?u=${feed.id}`} alt="" className="w-full h-full object-cover rounded-full" />
                         </div>
                         <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1 group-hover:text-pink-600 transition-colors">{feed.cliente}</h3>
                            <div className="flex gap-0.5">
                               {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={10} className={`${i < feed.nps / 2 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className={`p-2 rounded-xl bg-slate-50 border border-slate-100`}>
                         {getStatusIcon(feed.status)}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-xs text-slate-600 font-bold italic leading-relaxed line-clamp-3">"{feed.comentario}"</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NPS:</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${feed.nps >= 9 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{feed.nps} / 10</span>
                         </div>
                         <button className="flex items-center gap-1 text-[10px] font-black text-pink-600 uppercase">Detalhes <ChevronRight size={14} /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Customer Success Panel */}
        <div className="xl:col-span-4 space-y-6">
           {selectedFeed ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-8 animate-in slide-in-from-right duration-500 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none">Sucesso do Cliente</h4>
                      <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mt-2 bg-pink-50 p-1 px-2 rounded-md inline-block">{selectedFeed.id}</p>
                   </div>
                   <button onClick={() => setSelectedFeed(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-8">
                   {/* Warranty Card */}
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all">
                         <ShieldCheck size={64} />
                      </div>
                      <h5 className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-4">Certificado de Garantia</h5>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="p-3 bg-white/10 rounded-2xl">
                            <Calendar size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/50 uppercase leading-none">Válido até</p>
                            <p className="text-lg font-black">{new Date(selectedFeed.garantiaAte).toLocaleDateString('pt-BR')}</p>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-900/50 flex items-center justify-center gap-2">
                         <Download size={16} /> Baixar Certificado
                      </button>
                   </div>

                   {/* Referral & Rewards */}
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Programa de Indicações</h5>
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center space-y-4">
                         <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-pink-500">
                            <Gift size={32} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Indicações Realizadas</p>
                            <p className="text-2xl font-black text-slate-800">{selectedFeed.indicacoes}</p>
                         </div>
                         <button className="w-full py-3 bg-pink-50 text-pink-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Share2 size={16} /> Solicitar Indicação
                         </button>
                      </div>
                   </div>

                   {/* Repurchase / Next Step */}
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Próximas Vendas</h5>
                      <div className="grid grid-cols-1 gap-2">
                         <button className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-pink-500 transition-all group">
                            <div className="flex items-center gap-3">
                               <RefreshCcw size={18} className="text-indigo-500" />
                               <span className="text-xs font-black text-slate-800">Oferecer Up-sell / Recompra</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-pink-600 transition-all" />
                         </button>
                         <button className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500 transition-all group text-emerald-600">
                            <div className="flex items-center gap-3">
                               <ThumbsUp size={18} />
                               <span className="text-xs font-black">Coletar Depoimento Video</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 transition-all" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-pink-600 p-12 rounded-[4rem] text-white shadow-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-white/10 rounded-[3rem] flex items-center justify-center shadow-inner border border-white/20">
                   <Heart size={48} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight leading-tight uppercase tracking-tighter">Ouvir o Cliente</h3>
                   <p className="text-xs text-pink-100 italic mt-4 max-w-[200px] mx-auto leading-relaxed">Avalie o NPS, controle as garantias e transforme clientes satisfeitos em promotores da marca.</p>
                </div>
                <div className="grid grid-cols-1 w-full gap-3">
                   <div className="bg-white/10 p-5 rounded-[2rem] flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                         <Users size={20} className="text-pink-200" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-pink-200">Total Promotores</span>
                      </div>
                      <span className="text-xl font-black">1.2k</span>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasPosVenda;
