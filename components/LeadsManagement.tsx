import React, { useState, useEffect } from 'react';
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
  XCircle,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Lead, LeadStatus, ModuleId, SectorId } from '../types';
import { useSales } from '../src/context/SalesContext';
import { navigateTo } from '../src/lib/navigation';

export const LeadsManagement: React.FC = () => {
  const { leads, addLead, deleteLead, updateLead } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    value: 0,
    source: 'Site',
    probability: 10,
    status: LeadStatus.NEW,
    orderDescription: '',
    date: new Date().toISOString().split('T')[0],
    lastContact: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Get unique companies and contacts for suggestions
  const companySuggestions = Array.from(new Set(leads.map(l => l.company)));
  const contactSuggestions = Array.from(new Set(leads.map(l => l.contactName)));

  // Effect to find last contact when company or phone changes
  useEffect(() => {
    if (newLead.company || newLead.phone) {
      const existingLead = leads.find(l => 
        (newLead.company && l.company.toLowerCase() === newLead.company.toLowerCase()) ||
        (newLead.phone && l.phone === newLead.phone)
      );
      if (existingLead && existingLead.lastContact) {
        setNewLead(prev => ({ ...prev, lastContact: existingLead.lastContact }));
      }
    }
  }, [newLead.company, newLead.phone, leads]);

  const filteredLeads = leads.filter(lead => 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.company || !newLead.contactName || !newLead.phone) {
      alert('Por favor, preencha os campos obrigatórios: Empresa, Contato e Telefone.');
      return;
    }
    await addLead(newLead as Lead);
    setIsLeadModalOpen(false);
    setNewLead({
      company: '',
      contactName: '',
      email: '',
      phone: '',
      value: 0,
      source: 'Site',
      probability: 10,
      status: LeadStatus.NEW,
      orderDescription: '',
      date: new Date().toISOString().split('T')[0],
      lastContact: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: ''
    });
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      await deleteLead(id);
    }
  };

  const handleSendToQuote = (lead: Lead) => {
    // Navigate to Quotes module
    navigateTo(SectorId.VENDAS, ModuleId.VENDAS_ORCAMENTOS);
  };

  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'Novo Lead';
      case LeadStatus.QUALIFICATION: return 'Qualificação';
      case LeadStatus.QUOTE: return 'Orçamentos';
      case LeadStatus.NEGOTIATION: return 'Negociação';
      case LeadStatus.WON: return 'Venda Concluída';
      case LeadStatus.LOST: return 'Perdido';
      default: return status;
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LeadStatus.QUALIFICATION: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case LeadStatus.WON: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LeadStatus.LOST: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-emerald-600" size={28} />
            Gestão de Leads
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cadastre e gerencie seus leads antes de transformá-los em orçamentos</p>
        </div>

        <button 
          onClick={() => setIsLeadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Novo Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por empresa ou contato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa / Contato</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do Pedido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Último Contato</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLeads.map(lead => (
              <tr 
                key={lead.id} 
                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{lead.date ? new Date(lead.date).toLocaleDateString('pt-BR') : '---'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      {lead.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.contactName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(lead.status)}`}>
                    {getStatusLabel(lead.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)}
                  </p>
                  <p className="text-[10px] text-gray-400">{lead.source}</p>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-sm text-gray-600 truncate" title={lead.orderDescription}>
                    {lead.orderDescription || '---'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('pt-BR') : 'Sem contato'}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleSendToQuote(lead)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                      title="Fazer orçamento"
                    >
                      <FileText size={14} />
                      Fazer orçamento
                    </button>
                    <button 
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir Lead"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Novo Lead</h3>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={newLead.date}
                    onChange={(e) => setNewLead({...newLead, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Último Contato</label>
                  <input 
                    type="date" 
                    value={newLead.lastContact ? newLead.lastContact.split('T')[0] : ''}
                    onChange={(e) => setNewLead({...newLead, lastContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  list="company-suggestions"
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Nome da empresa"
                />
                <datalist id="company-suggestions">
                  {companySuggestions.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contato <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  list="contact-suggestions"
                  value={newLead.contactName}
                  onChange={(e) => setNewLead({...newLead, contactName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Nome do contato"
                />
                <datalist id="contact-suggestions">
                  {contactSuggestions.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>

              {newLead.lastContact && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Último contato em: <span className="font-bold">{new Intl.DateTimeFormat('pt-BR').format(new Date(newLead.lastContact))}</span>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                  <input 
                    type="text" 
                    value={newLead.street}
                    onChange={(e) => setNewLead({...newLead, street: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Rua..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input 
                    type="text" 
                    value={newLead.number}
                    onChange={(e) => setNewLead({...newLead, number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nº"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input 
                    type="text" 
                    value={newLead.neighborhood}
                    onChange={(e) => setNewLead({...newLead, neighborhood: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={newLead.city}
                    onChange={(e) => setNewLead({...newLead, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                  <input 
                    type="text" 
                    maxLength={2}
                    value={newLead.state}
                    onChange={(e) => setNewLead({...newLead, state: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="UF"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Pedido</label>
                <textarea 
                  value={newLead.orderDescription}
                  onChange={(e) => setNewLead({...newLead, orderDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[80px]"
                  placeholder="Descreva o que o cliente está procurando..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
                  <input 
                    type="number" 
                    value={newLead.value}
                    onChange={(e) => setNewLead({...newLead, value: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                  <select 
                    value={newLead.source}
                    onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                  >
                    <option value="Site">Site</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Detalhes do Lead</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl">
                  {selectedLead.company.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedLead.company}</h2>
                  <p className="text-gray-500">{selectedLead.contactName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(selectedLead.status)}`}>
                    {getStatusLabel(selectedLead.status)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Estimado</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedLead.value)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {selectedLead.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {selectedLead.email || '---'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Endereço</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                    <span>
                      {selectedLead.street ? `${selectedLead.street}, ${selectedLead.number}` : 'Endereço não informado'}
                      {selectedLead.neighborhood && <><br />{selectedLead.neighborhood}</>}
                      {selectedLead.city && <><br />{selectedLead.city} - {selectedLead.state}</>}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do Pedido</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                  {selectedLead.orderDescription || 'Nenhuma descrição informada.'}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
