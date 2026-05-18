import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Download, 
  FileSignature, 
  Archive, 
  Layers, 
  MoreVertical, 
  CheckCircle2, 
  X, 
  Eye, 
  Copy,
  PenTool,
  Lock,
  History,
  Info
} from 'lucide-react';

interface Contrato {
  id: string;
  cliente: string;
  tipo: 'venda' | 'servico' | 'locacao';
  valor: number;
  dataEmissao: string;
  dataAssinatura?: string;
  status: 'rascunho' | 'aguardando_assinatura' | 'assinado' | 'arquivo_morto';
  clausulas: number;
  versao: string;
}

export const VendasContratos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);

  const contratos: Contrato[] = [
    {
      id: 'CTR-2026-001',
      cliente: 'Mariana Souza',
      tipo: 'venda',
      valor: 45000.00,
      dataEmissao: '2026-05-10',
      dataAssinatura: '2026-05-12',
      status: 'assinado',
      clausulas: 12,
      versao: 'V1.2'
    },
    {
      id: 'CTR-2026-002',
      cliente: 'Condomínio Solar das Palmeiras',
      tipo: 'servico',
      valor: 125000.00,
      dataEmissao: '2026-05-11',
      status: 'aguardando_assinatura',
      clausulas: 18,
      versao: 'V2.0'
    },
    {
      id: 'CTR-2026-005',
      cliente: 'Restaurante Sabor & Arte',
      tipo: 'locacao',
      valor: 8900.00,
      dataEmissao: '2026-04-01',
      status: 'arquivo_morto',
      clausulas: 8,
      versao: 'V1.0'
    }
  ];

  const getStatusStyle = (status: Contrato['status']) => {
    switch (status) {
      case 'rascunho': return 'bg-slate-50 text-slate-400 border-slate-100';
      case 'aguardando_assinatura': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'assinado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'arquivo_morto': return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  const getTipoLabel = (tipo: Contrato['tipo']) => {
    switch (tipo) {
      case 'venda': return 'Venda de Móveis';
      case 'servico': return 'Prestação de Serviço';
      case 'locacao': return 'Locação de Equipamentos';
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
            <span className="text-indigo-600">Gestão Jurídica de Contratos</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Contratos e Assinaturas
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Controle Jurídico: Venda, Serviço e Locação com Assinatura Eletrônica.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all text-xs font-black shadow-lg shadow-slate-200">
            <Plus size={18} />
            Gerar Novo Contrato
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Contracts Table */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar contrato, cliente ou tipo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter size={18} />
                 </button>
                 <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                    <Archive size={18} />
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente / Tipo</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cláusulas</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Judic.</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {contratos.map(ctr => (
                      <tr 
                        key={ctr.id}
                        onClick={() => setSelectedContrato(ctr)}
                        className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedContrato?.id === ctr.id ? 'bg-indigo-50/30' : ''}`}
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500 ${ctr.status === 'assinado' ? 'bg-emerald-500' : ctr.status === 'arquivo_morto' ? 'bg-rose-500' : 'bg-indigo-600'}`}>
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="text-xs font-black text-slate-800">{ctr.id}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Versão {ctr.versao}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{ctr.cliente}</p>
                            <span className="text-[10px] font-bold text-indigo-600 italic">{getTipoLabel(ctr.tipo)}</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-6 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500">{ctr.clausulas}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(ctr.status)} shadow-sm`}>
                               {ctr.status.replace('_', ' ')}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <button className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-sm"><Eye size={16} /></button>
                               <button className="p-2 bg-white text-slate-400 hover:text-emerald-600 rounded-xl border border-slate-100 shadow-sm"><Download size={16} /></button>
                               <button className="p-2 bg-white text-slate-400 hover:text-rose-500 rounded-xl border border-slate-100 shadow-sm"><MoreVertical size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Right: Contract Workflow & Editor */}
        <div className="xl:col-span-4 space-y-6">
           {selectedContrato ? (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-8 animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Gestão de Documento</h2>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2 italic">Controle Legal VMS</p>
                   </div>
                   <button onClick={() => setSelectedContrato(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-8">
                   {/* Digital Signature Card */}
                   <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -top-4 -right-4 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                         <PenTool size={80} />
                      </div>
                      <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Assinatura Eletrônica</h4>
                      <div className="space-y-4 mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><FileSignature size={16} /></div>
                            <span className="text-xs font-bold text-indigo-100">Certificação VMS Digital</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Lock size={16} /></div>
                            <span className="text-xs font-bold text-indigo-100">Hash de Segurança SHA-256</span>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 hover:bg-slate-50">
                         {selectedContrato.status === 'assinado' ? 'Ver Certificado' : 'Enviar para Assinatura'}
                      </button>
                   </div>

                   {/* Clauses & Edits */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cláusulas e Modelos</h4>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-500 transition-all group">
                            <Layers size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">Editar Itens</span>
                         </button>
                         <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-emerald-500 transition-all group">
                            <Copy size={24} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">Duplicar</span>
                         </button>
                      </div>
                   </div>

                   {/* Audit Log */}
                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trilha de Auditoria</h4>
                         <History size={14} className="text-slate-300" />
                      </div>
                      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                         {[
                           { time: '12/05 10:30', event: 'Documento assinado pelo cliente', user: 'App' },
                           { time: '11/05 09:15', event: 'Versão V1.2 enviada para e-mail', user: 'Gabriel' },
                           { time: '10/05 14:00', event: 'Alteração na cláusula 4 (Entrega)', user: 'Jurídico' }
                         ].map((log, i) => (
                           <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{log.user}</span>
                                 <span className="text-[10px] font-bold text-slate-400 italic">{log.time}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-700 italic leading-snug">{log.event}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Archive Action */}
                   <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all group">
                      <Archive size={18} className="group-hover:text-rose-500 transition-colors" />
                      Enviar para Arquivo Morto
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-slate-50 p-10 rounded-[4rem] text-center space-y-8 animate-in fade-in duration-700 border border-slate-100 border-dashed">
                <div className="w-24 h-24 bg-white text-indigo-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-xl border border-slate-100">
                   <ShieldCheck size={48} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Central Jurídica</h3>
                   <p className="text-xs text-slate-400 font-medium italic mt-4 max-w-[200px] mx-auto leading-relaxed">Selecione um contrato para gerenciar o fluxo de assinaturas, versões e auditoria.</p>
                </div>

                <div className="space-y-3 pt-6">
                   <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Taxa Retenção</p>
                         <p className="text-lg font-black text-slate-800 leading-none mt-1">94%</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Info size={20} /></div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pendentes Ass.</p>
                         <p className="text-lg font-black text-slate-800 leading-none mt-1">12</p>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendasContratos;
