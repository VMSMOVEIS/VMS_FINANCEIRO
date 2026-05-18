import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  Building2,
  X,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  LayoutDashboard,
  Trophy,
  Target,
  ShoppingCart,
  TrendingUp,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  MessageSquare,
  Clock,
  Star,
  Video,
  FileSpreadsheet,
  Link as LinkIcon,
  PhoneCall,
  Send,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Globe,
  PlusCircle,
  Eye,
  PenSquare,
  History
} from 'lucide-react';
import { Lead, LeadStatus, ModuleId, SectorId, LeadActivity } from '../types';
import { useSales } from '../src/context/SalesContext';
import { navigateTo } from '../src/lib/navigation';

export const LeadsManagement: React.FC = () => {
  const { leads, addLead, deleteLead, updateLead, isLoading } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingTargetStatus, setMappingTargetStatus] = useState<LeadStatus | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetStatus, setTransferTargetStatus] = useState<LeadStatus | null>(null);

  // Specialized states for the transfer process
  const [transferForms, setTransferForms] = useState({
    visit: {
      date: '10/05/2026',
      time: '10:00',
      type: 'Visita técnica',
      address: 'Rua das Acácias, 123 - Jardim Primavera, Campinas - SP',
      responsible: 'Gabriel Ferreira',
      companions: '',
      observations: 'Cliente pediu para entender melhor o projeto e tirar medidas do ambiente.'
    },
    proposal: {
      date: '12/05/2025',
      type: 'Orçamento de móveis planejados',
      estimatedValue: 'R$ 58.250,00',
      validityDate: '12/06/2025',
      summary: 'Projeto de cozinha planejada com ilha e área de serviço integrada.',
      responsible: 'Gabriel Ferreira',
      attachments: [{ name: 'Proposta_Mariana_Souza.pdf', size: '2.4 MB' }]
    }
  });
  
  const [formData, setFormData] = useState<Partial<Lead>>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    value: 0,
    source: 'Instagram',
    probability: 10,
    status: LeadStatus.NEW,
    environment: '',
    orderDescription: '',
    date: new Date().toISOString().split('T')[0],
    responsibleName: 'Gabriel',
    leadType: '',
    cpfCnpj: '',
    rgIe: '',
    birthDate: '',
    maritalStatus: '',
    altPhone: '',
    altEmail: '',
    whatsapp: '',
    instagram: '',
    mainInterest: '',
    budgetRange: '',
    purchasePotential: '',
    urgency: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: 'Brasil',
    tags: []
  });

  const handleResetForm = () => {
    setFormData({
      company: '',
      contactName: '',
      email: '',
      phone: '',
      value: 0,
      source: 'Instagram',
      probability: 10,
      status: LeadStatus.NEW,
      environment: '',
      orderDescription: '',
      date: new Date().toISOString().split('T')[0],
      responsibleName: 'Gabriel',
      leadType: '',
      cpfCnpj: '',
      rgIe: '',
      birthDate: '',
      maritalStatus: '',
      altPhone: '',
      altEmail: '',
      whatsapp: '',
      instagram: '',
      mainInterest: '',
      budgetRange: '',
      purchasePotential: '',
      urgency: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil',
      tags: []
    });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.environment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const opportunities = leads.filter(l => [LeadStatus.QUALIFICATION, LeadStatus.VISIT_SCHEDULED, LeadStatus.VISIT_DONE, LeadStatus.PROJECT, LeadStatus.PROPOSAL, LeadStatus.NEGOTIATION].includes(l.status)).length;
    const quotes = leads.filter(l => l.status === LeadStatus.PROPOSAL).length;
    const closed = leads.filter(l => [LeadStatus.WON, LeadStatus.ORDER].includes(l.status)).length;
    const totalValue = leads.filter(l => [LeadStatus.WON, LeadStatus.ORDER].includes(l.status)).reduce((sum, l) => sum + l.value, 0);
    const avgTicket = closed > 0 ? totalValue / closed : 0;

    return [
      { label: 'LEADS NOVOS (MÊS)', value: totalLeads, trend: '18%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'OPORTUNIDADES', value: opportunities, trend: '12%', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'ORÇAMENTOS', value: quotes, trend: '8%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'VENDAS / PEDIDOS', value: closed, trend: '25%', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'TICKET MÉDIO', value: `R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: '16%', icon: Target, color: 'text-slate-800', bg: 'bg-slate-100' },
    ];
  }, [leads]);

  const kanbanColumns = [
    { title: 'NOVO LEAD', status: LeadStatus.NEW, color: 'border-blue-400' },
    { title: 'QUALIFICAÇÃO', status: LeadStatus.QUALIFICATION, color: 'border-amber-400' },
    { title: 'VISITA AGENDADA', status: LeadStatus.VISIT_SCHEDULED, color: 'border-orange-400' },
    { title: 'VISITA REALIZADA', status: LeadStatus.VISIT_DONE, color: 'border-amber-600' },
    { title: 'PROJETO', status: LeadStatus.PROJECT, color: 'border-indigo-600' },
    { title: 'PROPOSTA ENVIADA', status: LeadStatus.PROPOSAL, color: 'border-indigo-400' },
    { title: 'NEGOCIAÇÃO', status: LeadStatus.NEGOTIATION, color: 'border-blue-700' },
    { title: 'FECHADO', status: LeadStatus.WON, color: 'border-emerald-500' },
    { title: 'PEDIDO', status: LeadStatus.ORDER, color: 'border-emerald-700' },
    { title: 'PERDIDO', status: LeadStatus.LOST, color: 'border-red-500' },
  ];

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      await updateLead(formData as Lead);
    } else {
      await addLead(formData as Lead);
    }
    setIsLeadModalOpen(false);
    setIsEditing(false);
    handleResetForm();
  };

  const openEditModal = (lead: Lead) => {
    setFormData(lead);
    setIsEditing(true);
    setIsLeadModalOpen(true);
  };

  const openTransferModal = (lead: Lead) => {
    setSelectedLead(lead);
    setTransferTargetStatus(null);
    setIsTransferModalOpen(true);
  };

  const getSourceIcon = (source: string) => {
    switch (source?.toLowerCase()) {
      case 'instagram': return <Instagram size={14} className="text-pink-500" />;
      case 'google': return <Globe size={14} className="text-blue-500" />;
      case 'indicação': return <Star size={14} className="text-amber-500" />;
      default: return <Globe size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex bg-[#f8fafd] min-h-screen font-sans">
      <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${selectedLead ? 'mr-[320px]' : ''}`}>
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            <span>Comercial</span>
            <span className="text-gray-300">›</span>
            <span className="text-indigo-600">Leads</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Comercial / Leads</h1>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform duration-500`}>
                <kpi.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate leading-none mb-2">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-lg font-black text-slate-800 tracking-tighter leading-none truncate">{kpi.value}</h3>
                  <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-500">
                    <TrendingUp size={10} />
                    {kpi.trend}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center px-4 py-2 gap-2 border-r border-gray-100 cursor-pointer hover:bg-gray-50 rounded-l-xl transition-colors group">
              <span className="text-xs font-bold text-slate-600">Todos os responsáveis</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center px-4 py-2 gap-3 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-xs font-bold text-slate-600 tracking-tight">01/05/2025 até 31/05/2025</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <button 
                onClick={() => { handleResetForm(); setIsEditing(false); setIsLeadModalOpen(true); }}
                className="bg-[#92400e] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-amber-900/10 hover:brightness-110 transition-all flex items-center gap-2 uppercase tracking-widest ml-4"
            >
              <Plus size={18} strokeWidth={3} />
              Novo Lead
            </button>
          </div>

          <div className="flex items-center gap-3 mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20 outline-none w-64 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Kanban Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={14} className="text-indigo-500" />
              Pipeline de Vendas (Kanban)
            </h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 no-scrollbar">
            {kanbanColumns.map((col, idx) => {
              const colLeads = filteredLeads.filter(l => l.status === col.status);
              const colTotal = colLeads.reduce((sum, l) => sum + (l.value || 0), 0);
              
              return (
                <div key={idx} className="flex-shrink-0 w-[220px]">
                  <div className={`bg-white border-t-4 ${col.color} rounded-t-xl rounded-b-xl shadow-sm flex flex-col h-full ring-1 ring-slate-200/50`}>
                    <div className="p-4 border-b border-gray-50 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate mr-1">{col.title}</h3>
                        <span className="text-[10px] font-black text-gray-400 leading-none">({colLeads.length})</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-tight">R$ {colTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="p-3 space-y-3 bg-slate-50/30 flex-1 min-h-[450px]">
                      <button 
                        onClick={() => { 
                          if (col.status === LeadStatus.NEW) {
                            handleResetForm(); 
                            setFormData(prev => ({ ...prev, status: col.status })); 
                            setIsLeadModalOpen(true); 
                          } else {
                            setMappingTargetStatus(col.status);
                            setIsMappingModalOpen(true);
                          }
                        }}
                        className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-all group"
                      >
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                      </button>

                      {colLeads.map((lead, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-black text-slate-800 tracking-tight leading-tight group-hover:text-amber-800 transition-colors truncate w-full">
                                {lead.company}
                            </h4>
                          </div>
                          
                          <p className="text-[10px] font-medium text-slate-400 mb-3 truncate">{lead.environment || '---'}</p>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-700 shrink-0">R$ {(lead.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            {lead.responsibleName && (
                              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                                <img 
                                  src={lead.responsibleName === 'Ana Clara' ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"} 
                                  alt="User" 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-gray-50 text-center">
                       <button 
                        onClick={() => { 
                          if (col.status === LeadStatus.NEW) {
                            handleResetForm(); 
                            setFormData(prev => ({ ...prev, status: col.status })); 
                            setIsLeadModalOpen(true); 
                          } else {
                            setMappingTargetStatus(col.status);
                            setIsMappingModalOpen(true);
                          }
                        }}
                        className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-amber-800 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                       >
                         <Plus size={14} strokeWidth={3} />
                         Novo lead
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* List Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ListIcon size={14} className="text-indigo-500" />
              Tabela Detalhada de Leads
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex space-x-8">
                <button className="text-[11px] font-black text-amber-700 border-b-2 border-amber-700 pb-2">Todos os Leads</button>
                <button className="text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors">Meus Leads</button>
                <button className="text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors">Leads sem atividade</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Ambiente</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Valor Estimado</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Etapa</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Responsável</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Origem</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Último Contato</th>
                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map((lead, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                             <img 
                                src={`https://ui-avatars.com/api/?name=${lead.company}&background=random&color=fff`} 
                                alt="Lead" 
                                className="w-full h-full object-cover" 
                             />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-800 tracking-tight">{lead.company}</span>
                            <span className="text-[10px] font-bold text-slate-400">{lead.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{lead.environment || '---'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-800">R$ {(lead.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                          lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-600' :
                          lead.status === LeadStatus.QUALIFICATION ? 'bg-amber-50 text-amber-600' :
                          lead.status === LeadStatus.VISIT_SCHEDULED ? 'bg-indigo-50 text-indigo-600' :
                          lead.status === LeadStatus.PROPOSAL ? 'bg-orange-50 text-orange-600' :
                          lead.status === LeadStatus.NEGOTIATION ? 'bg-blue-100 text-blue-800' :
                          lead.status === LeadStatus.ORDER ? 'bg-emerald-100 text-emerald-800' :
                          lead.status === LeadStatus.WON ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {kanbanColumns.find(c => c.status === lead.status)?.title || lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{lead.responsibleName || 'Gabriel'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {getSourceIcon(lead.source || '')}
                           <span className="text-xs font-medium text-slate-600">{lead.source || 'Indicação'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-medium text-slate-500">{lead.lastContact ? new Date(lead.lastContact).toLocaleString('pt-BR') : 'Sem contato'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); /* Call handler */ }}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg"
                          >
                             <PhoneCall size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); /* Call handler */ }}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-lg"
                          >
                             <MessageSquare size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(lead); }}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-500 rounded-lg"
                          >
                             <PenSquare size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg"
                          >
                             <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
               <span>Mostrando 1 até {filteredLeads.length} de {leads.length} leads</span>
               <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-all border border-gray-100"><ChevronLeft size={16} /></button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-800">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">3</button>
                  <span className="mx-1">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">12</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-all border border-gray-100"><ChevronRight size={16} /></button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sidebar */}
      {selectedLead && (
        <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <h2 className="text-lg font-black text-slate-800 tracking-tight">{selectedLead.company}</h2>
               <Star size={16} className="fill-amber-400 text-amber-400" />
            </div>
            <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Status Section */}
            <div className="flex flex-col gap-4">
               <div className="flex flex-wrap gap-2">
                 <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                   Novo Lead
                 </span>
               </div>
               
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => selectedLead && openTransferModal(selectedLead)}
                    className="w-full bg-amber-50 text-amber-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2 border border-amber-200"
                  >
                    <ArrowRight size={14} />
                    Alterar Etapa
                  </button>
                  <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"><Phone size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"><MessageSquare size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Mail size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"><Calendar size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"><MoreHorizontal size={18} /></button>
                  </div>
               </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Telefone:</span>
                      <span className="text-[11px] font-black text-slate-700">{selectedLead.phone}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Email:</span>
                      <span className="text-[11px] font-black text-slate-700 truncate">{selectedLead.email || '---'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Ambiente:</span>
                      <span className="text-[11px] font-black text-slate-700">{selectedLead.environment || '---'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Valor estimado:</span>
                      <span className="text-[11px] font-black text-slate-700">R$ {(selectedLead.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Origem:</span>
                      <span className="text-[11px] font-black text-slate-700">{selectedLead.source || '---'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Data criação:</span>
                      <span className="text-[11px] font-black text-slate-700">{selectedLead.date ? new Date(selectedLead.date).toLocaleDateString('pt-BR') : '---'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Responsável:</span>
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                         <span className="text-[11px] font-black text-slate-700">{selectedLead.responsibleName || 'Gabriel'}</span>
                      </div>
                   </div>
                </div>
            </div>

            {/* Observations */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observações</h3>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                        {selectedLead.orderDescription || 'Nenhuma observação registrada.'}
                    </p>
                </div>
            </div>

            {/* Activities */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atividades</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-[10px] font-black border border-amber-100">
                        <Plus size={14} strokeWidth={3} /> Nova atividade
                    </button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <History size={40} className="text-slate-300 mb-4" />
                    <p className="text-[11px] font-bold text-slate-400">Nenhuma atividade registrada.</p>
                </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
             <button className="w-full py-3 bg-white text-slate-600 rounded-xl text-[11px] font-black border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 Ver histórico completo
             </button>
             <div className="flex gap-2">
                 <button 
                  onClick={() => openEditModal(selectedLead)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                 >
                    <PenSquare size={16} /> Editar Lead
                 </button>
                 <button 
                  onClick={() => { if(confirm('Excluir?')) { deleteLead(selectedLead.id); setSelectedLead(null); } }}
                  className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 hover:bg-red-100 transition-colors"
                 >
                    <Trash2 size={18} />
                 </button>
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'Editar Lead' : 'Novo Lead'}</h3>
                <p className="text-sm text-gray-500 font-medium">Preencha as informações do cliente potencial</p>
              </div>
              <button 
                onClick={() => setIsLeadModalOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-gray-600 flex items-center justify-center shadow-sm border border-gray-100 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveLead} className="p-10 space-y-12 max-h-[85vh] overflow-y-auto custom-scrollbar bg-white">
              {/* Dados Principais */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                  Dados Principais
                </h4>
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Nome do Lead <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                      placeholder="Ex: Mariana Souza"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Telefone Principal <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                      placeholder="(19) 99999-1111"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">E-mail</label>
                    <input 
                      type="email" value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Tipo de Lead <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.leadType}
                      onChange={(e) => setFormData({...formData, leadType: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Final">Consumidor Final</option>
                      <option value="Arquitetura">Escritório de Arquitetura</option>
                      <option value="Construtora">Construtora</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">CPF / CNPJ</label>
                    <input 
                      type="text" value={formData.cpfCnpj}
                      onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">RG / IE</label>
                    <input 
                      type="text" value={formData.rgIe}
                      onChange={(e) => setFormData({...formData, rgIe: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Data de Nascimento / Fundação</label>
                    <input 
                      type="date" value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Estado Civil</label>
                    <select 
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Solteiro">Solteiro(a)</option>
                      <option value="Casado">Casado(a)</option>
                      <option value="Divorciado">Divorciado(a)</option>
                      <option value="Viúvo">Viúvo(a)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contato Adicional */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2 border-t border-gray-50 pt-8">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  Contato Adicional
                </h4>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Telefone Alternativo</label>
                    <input 
                      type="text" value={formData.altPhone}
                      onChange={(e) => setFormData({...formData, altPhone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="(19) 88888-2222"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">E-mail Alternativo</label>
                    <input 
                      type="email" value={formData.altEmail}
                      onChange={(e) => setFormData({...formData, altEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="outro@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">WhatsApp</label>
                    <input 
                      type="text" value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="(19) 99999-1111"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Instagram</label>
                    <input 
                      type="text" value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="@usuario"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2 border-t border-gray-50 pt-8">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                  Endereço
                </h4>
                <div className="grid grid-cols-4 gap-6">
                  <div className="flex gap-2 col-span-1">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">CEP <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type="text" required value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                          placeholder="00000-000"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors">
                          <Search size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Rua <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Número <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="123"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Complemento</label>
                    <input 
                      type="text" value={formData.complement}
                      onChange={(e) => setFormData({...formData, complement: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="Apto, Sala, Casa..."
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Bairro <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.neighborhood}
                      onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="Nome do bairro"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Cidade <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Estado <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">País</label>
                    <input 
                      type="text" value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      placeholder="Brasil"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Comerciais */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2 border-t border-gray-50 pt-8">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Informações Comerciais
                </h4>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Origem do Lead <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Google">Google</option>
                      <option value="Indicação">Indicação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Responsável <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.responsibleName}
                      onChange={(e) => setFormData({...formData, responsibleName: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="Gabriel">Gabriel</option>
                      <option value="Ana Clara">Ana Clara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Interesse Principal <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.mainInterest}
                      onChange={(e) => setFormData({...formData, mainInterest: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Móveis Planejados">Móveis Planejados</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ambiente de Interesse <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.environment}
                      onChange={(e) => setFormData({...formData, environment: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione o ambiente</option>
                      <option value="Cozinha Planejada">Cozinha Planejada</option>
                      <option value="Quarto">Quarto</option>
                      <option value="Sala">Sala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Faixa de Orçamento <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.budgetRange}
                      onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="R$ 10k - 20k">R$ 10k - 20k</option>
                      <option value="R$ 20k - 40k">R$ 20k - 40k</option>
                      <option value="R$ 40k+">R$ 40k+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Potencial de Compra <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.purchasePotential}
                      onChange={(e) => setFormData({...formData, purchasePotential: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Alto">Alto</option>
                      <option value="Médio">Médio</option>
                      <option value="Baixo">Baixo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Valor Estimado <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                      <input 
                        type="number" required value={formData.value || ''}
                        onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xs font-semibold"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Urgência / Prazo <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Imediato">Imediato</option>
                      <option value="30 dias">30 dias</option>
                      <option value="90 dias">90 dias</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Status do Lead <span className="text-red-500">*</span></label>
                    <select 
                      required value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as LeadStatus})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none"
                    >
                      <option value={LeadStatus.NEW}>Novo Lead</option>
                      {kanbanColumns.map(c => <option key={c.status} value={c.status}>{c.title}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações e Tags */}
              <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Observações</label>
                  <textarea 
                    value={formData.orderDescription}
                    onChange={(e) => setFormData({...formData, orderDescription: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold min-h-[100px]"
                    placeholder="Observações adicionais sobre o lead..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Tags / Etiquetas</label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold appearance-none">
                     <option>Adicionar tags</option>
                  </select>
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mt-10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Resumo (como aparecerá na lista)</h4>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg border-2 border-white shadow-sm">
                         {formData.company ? formData.company.charAt(0).toUpperCase() : 'L'}
                      </div>
                      <div>
                         <h5 className="text-sm font-black text-slate-800">{formData.company || 'Nome do Lead'}</h5>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Phone size={10} /> {formData.phone || '(00) 00000-0000'}</span>
                            <span className="flex items-center gap-1"><Mail size={10} /> {formData.email || 'email@exemplo.com'}</span>
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-5 gap-8 flex-1 ml-12">
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-gray-400 uppercase">Ambiente</span>
                         <span className="text-[11px] font-black text-slate-700">{formData.environment || '---'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-gray-400 uppercase">Valor Estimado</span>
                         <span className="text-[11px] font-black text-slate-700">R$ {formData.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-gray-400 uppercase">Etapa</span>
                         <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase inline-flex items-center justify-center w-fit">
                            {kanbanColumns.find(c => c.status === formData.status)?.title || 'Novo Lead'}
                         </span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-gray-400 uppercase">Responsável</span>
                         <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                            <span className="text-[11px] font-black text-slate-700">{formData.responsibleName}</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-gray-400 uppercase">Origem</span>
                         <span className="text-[11px] font-black text-slate-700">{formData.source}</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="pt-8 flex justify-end gap-4 border-t border-slate-50">
                <button 
                  type="button" onClick={() => setIsLeadModalOpen(false)}
                  className="px-8 py-3.5 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-3.5 text-xs font-black text-white bg-[#6b4226] rounded-xl shadow-lg shadow-amber-900/10 hover:brightness-110 transition-all flex items-center gap-3 uppercase tracking-widest"
                >
                  Salvar Lead
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Transfer Stage Modal */}
      {isTransferModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Alterar etapa do lead</h3>
                <p className="text-xs text-slate-500 font-medium italic mt-1">Movimentação de pipeline</p>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="bg-white p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Selected Lead Info */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead selecionado</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-500 font-black text-lg border shadow-sm">
                      {selectedLead.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-800">{selectedLead.company}</h5>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Phone size={10} /> {selectedLead.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> {selectedLead.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase mb-1">Etapa atual</span>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{kanbanColumns.find(c => c.status === selectedLead.status)?.title}</p>
                  </div>
                </div>
              </div>

            {/* Pipeline Flow */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nova etapa</h4>
              <div className="flex items-center justify-between px-2 overflow-x-auto pb-4">
                {kanbanColumns.filter(c => c.status !== LeadStatus.LOST).map((col, i, arr) => (
                  <React.Fragment key={col.status}>
                    <button 
                      onClick={() => setTransferTargetStatus(col.status)}
                      className={`flex-shrink-0 flex flex-col items-center gap-3 group transition-all ${transferTargetStatus === col.status ? 'scale-110' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
                        transferTargetStatus === col.status 
                          ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200' 
                          : selectedLead.status === col.status
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                      }`}>
                        {col.status === LeadStatus.NEW && <LayoutGrid size={20} />}
                        {col.status === LeadStatus.QUALIFICATION && <ShieldAlert size={20} />}
                        {col.status === LeadStatus.VISIT_SCHEDULED && <Calendar size={20} />}
                        {col.status === LeadStatus.VISIT_DONE && <CheckCircle2 size={20} />}
                        {col.status === LeadStatus.PROJECT && <PenSquare size={20} />}
                        {col.status === LeadStatus.PROPOSAL && <FileText size={20} />}
                        {col.status === LeadStatus.NEGOTIATION && <Target size={20} />}
                        {col.status === LeadStatus.WON && <Trophy size={20} />}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-tight text-center max-w-[80px] ${
                        transferTargetStatus === col.status ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        {col.title}
                      </span>
                    </button>
                    {i < arr.length - 1 && (
                      <div className="flex-shrink-0 w-8 h-px bg-slate-100 mx-2 mb-8"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Fields: Conditional based on Target Status */}
            {transferTargetStatus === LeadStatus.VISIT_SCHEDULED ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Data e hora da visita <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                            type="text" value={transferForms.visit.date} 
                            onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, date: e.target.value}})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                         />
                       </div>
                       <div className="relative flex-1">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                            type="text" value={transferForms.visit.time} 
                            onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, time: e.target.value}})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                         />
                       </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Tipo de visita <span className="text-red-500">*</span></label>
                    <select 
                      value={transferForms.visit.type}
                      onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, type: e.target.value}})}
                      className="w-full px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 appearance-none bg-slate-50/30"
                    >
                      <option>Visita técnica</option>
                      <option>Medição final</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Endereço da visita <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" value={transferForms.visit.address}
                        onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, address: e.target.value}})}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                        placeholder="Pesquisar endereço..."
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Responsável pela visita <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 overflow-hidden border">
                         <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="" />
                      </div>
                      <select 
                        value={transferForms.visit.responsible}
                        onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, responsible: e.target.value}})}
                        className="w-full pl-12 pr-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 appearance-none bg-slate-50/30"
                      >
                        <option>Gabriel Ferreira</option>
                        <option>Ana Clara</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Acompanhantes</label>
                    <select className="w-full px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-500 outline-none bg-slate-50/30 italic">
                      <option>selecione (opcional)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Observações da visita</label>
                    <div className="relative">
                        <textarea 
                          value={transferForms.visit.observations}
                          onChange={(e) => setTransferForms({...transferForms, visit: {...transferForms.visit, observations: e.target.value}})}
                          className="w-full px-5 py-4 border border-slate-200 rounded-[1.5rem] text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30 min-h-[100px]"
                        />
                        <span className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-300">76/500</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : transferTargetStatus === LeadStatus.PROPOSAL ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Data do envio da proposta <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                         type="text" value={transferForms.proposal.date}
                         onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, date: e.target.value}})}
                         className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Tipo de proposta <span className="text-red-500">*</span></label>
                    <select 
                      value={transferForms.proposal.type}
                      onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, type: e.target.value}})}
                      className="w-full px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 appearance-none bg-slate-50/30"
                    >
                      <option>Orçamento de móveis planejados</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Valor estimado da proposta <span className="text-red-500">*</span></label>
                    <input 
                      type="text" value={transferForms.proposal.estimatedValue}
                      onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, estimatedValue: e.target.value}})}
                      className="w-full px-5 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Prazo de validade da proposta <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                         type="text" value={transferForms.proposal.validityDate}
                         onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, validityDate: e.target.value}})}
                         className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Resumo da proposta</label>
                    <div className="relative">
                        <textarea 
                          value={transferForms.proposal.summary}
                          onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, summary: e.target.value}})}
                          className="w-full px-5 py-4 border border-slate-200 rounded-[1.5rem] text-xs font-black text-slate-700 outline-none focus:border-amber-500 bg-slate-50/30 min-h-[80px]"
                        />
                        <span className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-300">60/500</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Responsável pelo envio <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 overflow-hidden border">
                         <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="" />
                      </div>
                      <select 
                        value={transferForms.proposal.responsible}
                        onChange={(e) => setTransferForms({...transferForms, proposal: {...transferForms.proposal, responsible: e.target.value}})}
                        className="w-full pl-12 pr-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-amber-500 appearance-none bg-slate-50/30"
                      >
                        <option>Gabriel Ferreira</option>
                        <option>Ana Clara</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 px-1">Anexos enviados (opcional)</label>
                    <div className="flex flex-wrap gap-2">
                        {transferForms.proposal.attachments.map((file, idx) => (
                           <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                              <FileText size={16} className="text-indigo-500" />
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-800">{file.name}</span>
                                 <span className="text-[9px] font-bold text-slate-400">{file.size}</span>
                              </div>
                              <button className="p-1 hover:bg-white rounded transition-colors text-slate-400">
                                 <X size={14} />
                              </button>
                           </div>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-slate-400 hover:border-slate-300 transition-all">
                           <Plus size={14} /> Adicionar arquivo
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 px-1">Motivo / Status desta etapa <span className="text-red-500">*</span></label>
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-slate-50/30">
                    <option value="">Selecione um motivo</option>
                    <option value="demonstrou-interesse">Cliente respondeu e demonstrou interesse</option>
                    <option value="visita-solicitada">Solicitou visita técnica</option>
                    <option value="orcamento-aprovado">Aprovou orçamento preliminar</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 px-1">Prioridade / Potencial <span className="text-red-500">*</span></label>
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-slate-50/30">
                    <option value="Alta">Muito Alto</option>
                    <option value="Alta">Alto</option>
                    <option value="Media">Médio</option>
                    <option value="Baixa">Baixo</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 px-1">Observações da movimentação</label>
                  <textarea 
                    className="w-full px-5 py-4 border border-slate-200 rounded-[1.5rem] text-xs font-black text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all min-h-[100px] bg-slate-50/30"
                    placeholder="Descreva o que aconteceu para motivar esta mudança de etapa..."
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 px-1">Responsável pela ação</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 overflow-hidden border">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="" />
                    </div>
                    <select className="w-full pl-12 pr-5 py-3.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-slate-50/30">
                      <option value="Gabriel">Gabriel Ferreira</option>
                      <option value="Ana Clara">Ana Clara</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            </div>

            <div className="px-10 py-8 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/50">
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="px-8 py-3.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all font-sans"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  if (transferTargetStatus && selectedLead) {
                    await updateLead({ ...selectedLead, status: transferTargetStatus });
                    setIsTransferModalOpen(false);
                    setTransferTargetStatus(null);
                  }
                }}
                disabled={!transferTargetStatus}
                className="px-10 py-3.5 text-xs font-black text-white bg-[#6b4226] rounded-xl shadow-lg shadow-amber-900/10 hover:brightness-110 transition-all flex items-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Modal - To move existing leads to different stages */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Buscar cadastros existentes</h3>
                <p className="text-xs text-gray-500 font-medium italic mt-1">Mover para: {kanbanColumns.find(c => c.status === mappingTargetStatus)?.title}</p>
              </div>
              <button onClick={() => setIsMappingModalOpen(false)} className="bg-white p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
              {(() => {
                  const sourceStatus = (() => {
                    switch (mappingTargetStatus) {
                      case LeadStatus.QUALIFICATION: return LeadStatus.NEW;
                      case LeadStatus.VISIT_SCHEDULED: return LeadStatus.QUALIFICATION;
                      case LeadStatus.VISIT_DONE: return LeadStatus.VISIT_SCHEDULED;
                      case LeadStatus.PROJECT: return LeadStatus.VISIT_DONE;
                      case LeadStatus.PROPOSAL: return LeadStatus.PROJECT;
                      case LeadStatus.NEGOTIATION: return LeadStatus.PROPOSAL;
                      case LeadStatus.WON: return LeadStatus.NEGOTIATION;
                      case LeadStatus.ORDER: return LeadStatus.WON;
                      default: return null;
                    }
                  })();

                const sourceTitle = kanbanColumns.find(c => c.status === sourceStatus)?.title || 'Etapa Anterior';
                const availableLeads = sourceStatus ? leads.filter(l => l.status === sourceStatus) : leads.filter(l => l.status !== mappingTargetStatus);

                if (availableLeads.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <p className="text-xs font-bold text-gray-400">
                        Nenhum lead em "{sourceTitle}" disponível para mover.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Selecione na etapa {sourceTitle}:</p>
                    {availableLeads.map((lead, i) => (
                      <button 
                        key={i}
                        onClick={async () => {
                          if (mappingTargetStatus) {
                            await updateLead({ ...lead, status: mappingTargetStatus });
                            setIsMappingModalOpen(false);
                            setMappingTargetStatus(null);
                          }
                        }}
                        className="w-full p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm overflow-hidden text-xs">
                            {lead.company.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 group-hover:text-amber-900">{lead.company}</p>
                            <p className="text-[10px] font-bold text-slate-400">Status atual: <span className="text-indigo-600">{kanbanColumns.find(c => c.status === lead.status)?.title || lead.status}</span></p>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="p-6 border-t border-gray-50 flex justify-end bg-gray-50/30">
              <button 
                onClick={() => setIsMappingModalOpen(false)}
                className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
