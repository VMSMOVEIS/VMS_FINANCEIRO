import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  History,
  MessageSquare,
  Clock,
  Trash2,
  Edit2,
  X,
  Heart,
  Briefcase,
  Cake,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useSales } from '../src/context/SalesContext';
import { Customer } from '../types';

const SalesCustomers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, isLoading } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    documentType: 'CNPJ',
    document: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'active',
    address: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    birthday: '',
    observations: ''
  });

  const filteredCustomers = customers.filter(customer => 
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.contactName && customer.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.document && customer.document.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        documentType: 'CNPJ',
        document: '',
        contactName: '',
        email: '',
        phone: '',
        status: 'active',
        address: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        birthday: '',
        observations: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      await updateCustomer({ ...editingCustomer, ...formData } as Customer);
    } else {
      await addCustomer(formData as Customer);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteCustomer(id);
    }
  };

  const getStatusStyle = (status: Customer['status']) => {
    switch (status) {
      case 'premium': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'recorrente': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'active': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'inactive': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStatusLabel = (status: Customer['status']) => {
    switch (status) {
      case 'premium': return 'Premium';
      case 'recorrente': return 'Recorrente';
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return 'Pendente';
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
            <span className="text-emerald-600">Base de Clientes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Base Oficial de Clientes
            {isLoading && <Clock className="animate-spin text-blue-500" size={20} />}
          </h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1 leading-none italic">Dados oficiais, histórico completo e classificações.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Tabela
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Cards
            </button>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all text-xs font-black shadow-lg shadow-slate-200"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF/CNPJ, cidade ou contato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Filter size={16} />
            Filtrar por Status
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <UserCheck size={36} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Nenhum cliente na base oficial</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm italic">
            {searchTerm ? 'Ajuste seus termos de busca para encontrar o cliente.' : 'A base de clientes é alimentada quando um lead é fechado ou cadastrado manualmente.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100/50">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento / CPF</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cidade/UF</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Classificação</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50/70 transition-all group cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-800 font-black group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                          {(customer.name || '??').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 truncate leading-tight mb-0.5">{customer.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Mail size={10} className="text-slate-300" /> {customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-700 tracking-tighter">{customer.document || '---'}</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{customer.documentType}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-700 italic">{customer.city ? `${customer.city} - ${customer.state}` : '---'}</p>
                      {customer.phone && <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Phone size={10} /> {customer.phone}</p>}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(customer.status)}`}>
                          {getStatusLabel(customer.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => handleOpenModal(customer)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.map(customer => (
            <div 
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform duration-500 border border-slate-100 shadow-sm">
                  {(customer.name || '??').substring(0, 2).toUpperCase()}
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(customer.status)}`}>
                  {getStatusLabel(customer.status)}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight">{customer.name}</h3>
              <p className="text-xs text-slate-400 font-bold mb-6 flex items-center gap-1 italic"><MapPin size={12} className="text-indigo-400" /> {customer.city ? `${customer.city}, ${customer.state}` : 'Sem endereço'}</p>
              
              <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-xs font-black text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Phone size={14} /></div>
                  {customer.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-xs font-black text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Mail size={14} /></div>
                  <span className="truncate">{customer.email || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal / Slide-over with History */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-[150] animate-in fade-in duration-300">
          <div className="bg-[#f8fafd] w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-start">
               <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-[2rem] bg-white text-slate-800 flex items-center justify-center font-black text-3xl shadow-xl border border-white">
                    {(selectedCustomer.name || '??').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedCustomer.name}</h2>
                    <p className="text-slate-400 text-sm font-bold flex items-center gap-2 mt-1 italic">
                      <span className="uppercase">{selectedCustomer.documentType}: {selectedCustomer.document}</span>
                      <span className="text-slate-200">|</span>
                      <span className="flex items-center gap-1"><Cake size={14} className="text-rose-400" /> {selectedCustomer.birthday || 'Aniversário não info'}</span>
                    </p>
                    <div className="flex gap-2 mt-4">
                       <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedCustomer.status)}`}>
                         Classificação: {getStatusLabel(selectedCustomer.status)}
                       </span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setSelectedCustomer(null)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-2xl shadow-sm transition-all hover:rotate-90">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
               {/* Quick Info Grid */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contatos</h4>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Phone size={14} /></div>
                           <span className="text-xs font-black text-slate-700">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Mail size={14} /></div>
                           <span className="text-xs font-black text-slate-700 truncate">{selectedCustomer.email}</span>
                        </div>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Localização</h4>
                     <div className="space-y-3">
                        <p className="text-xs font-black text-slate-700 leading-tight italic">
                           {selectedCustomer.street ? `${selectedCustomer.street}, ${selectedCustomer.number}` : selectedCustomer.address || 'Endereço não informado'}
                           <br />{selectedCustomer.neighborhood ? selectedCustomer.neighborhood : ''}
                           <br />{selectedCustomer.city ? `${selectedCustomer.city} - ${selectedCustomer.state}` : ''}
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-all">
                           <MapPin size={12} /> Abrir Mapa
                        </button>
                     </div>
                  </div>
               </div>

               {/* Relationship History */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 transition-all">
                        <History size={16} className="text-indigo-600" /> Histórico de Relacionamento
                     </h3>
                     <button className="text-[9px] font-black text-indigo-600 uppercase border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all font-sans">Ver Full Logs</button>
                  </div>
                  
                  <div className="space-y-4">
                     {[
                        { type: 'visita', title: 'Visita Técnica Realizada', date: '10/05/2026', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Medições finais do ambiente da cozinha e sala de estar.' },
                        { type: 'projeto', title: 'Projeto Aprovado', date: '05/05/2026', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Versão V3.1 aprovada formalmente pelo proprietário.' },
                        { type: 'proposta', title: 'Proposta #2026-45 Enviada', date: '02/05/2026', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Valor total: R$ 42.500,00 - Condição 10x sem juros.' },
                        { type: 'pos-venda', title: 'NPS de Projeto: 10/10', date: '12/04/2026', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Cliente extremamente satisfeito com o layout e atendimento.' }
                     ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 group hover:translate-x-1 transition-all">
                           <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <item.icon size={22} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                 <h5 className="text-sm font-black text-slate-800">{item.title}</h5>
                                 <span className="text-[9px] font-bold text-slate-400 italic shrink-0">{item.date}</span>
                              </div>
                              <p className="text-xs text-slate-400 font-medium italic">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Observations */}
               <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <MessageSquare size={14} className="text-indigo-400" /> Observações Particulares
                  </h4>
                  <p className="text-xs text-slate-300 font-bold leading-relaxed italic opacity-80">
                     {selectedCustomer.observations || 'Nenhuma observação interna registrada para este cliente. Utilize o modo de edição para adicionar perfil comportamental, preferências de materiais ou notas importantes.'}
                  </p>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
               <button 
                  onClick={() => handleOpenModal(selectedCustomer)}
                  className="flex-1 py-4 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
               >
                  <Edit2 size={16} /> Editar Cadastro
               </button>
               <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="px-8 py-4 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
               >
                  Fechar
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingCustomer ? 'Editar Cliente' : 'Novo Cadastro Oficial'}</h3>
                <p className="text-xs text-slate-400 font-medium italic mt-1 leading-none italic">Preencha todos os dados técnicos e contratuais.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-500 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Identification Section */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">1. Identificação Principal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Nome Completo / Razão Social</label>
                       <input 
                         required type="text" value={formData.name || ''}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                         placeholder="Ex: João Silva ou Marcenaria XYZ Ltda"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tipo de Documento</label>
                       <select 
                         value={formData.documentType}
                         onChange={e => setFormData({...formData, documentType: e.target.value as any})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all appearance-none bg-white"
                       >
                         <option value="CPF">CPF (Pessoa Física)</option>
                         <option value="CNPJ">CNPJ (Pessoa Jurídica)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Número do Documento</label>
                       <input 
                         type="text" value={formData.document || ''}
                         onChange={e => setFormData({...formData, document: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                         placeholder="000.000.000-00"
                       />
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">2. Contatos & Clasificação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">WhatsApp / Telefone</label>
                       <input 
                         required type="text" value={formData.phone || ''}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                         placeholder="(00) 00000-0000"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">E-mail Principal</label>
                       <input 
                         required type="email" value={formData.email || ''}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                         placeholder="exemplo@email.com"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Data de Aniversário</label>
                       <input 
                         type="date" value={formData.birthday || ''}
                         onChange={e => setFormData({...formData, birthday: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Classificação oficial</label>
                       <select 
                         value={formData.status}
                         onChange={e => setFormData({...formData, status: e.target.value as any})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all appearance-none bg-white"
                       >
                         <option value="active">Cliente Ativo</option>
                         <option value="premium">Premium / VIP</option>
                         <option value="recorrente">Recorrente / Parceiro</option>
                         <option value="inactive">Inativo</option>
                       </select>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">3. Endereço & Localização</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="col-span-3">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Rua / Logradouro</label>
                       <input 
                         type="text" value={formData.street || ''}
                         onChange={e => setFormData({...formData, street: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Nº</label>
                       <input 
                         type="text" value={formData.number || ''}
                         onChange={e => setFormData({...formData, number: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Cidade</label>
                       <input 
                         type="text" value={formData.city || ''}
                         onChange={e => setFormData({...formData, city: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all"
                       />
                    </div>
                    <div className="col-span-1">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Estado / UF</label>
                       <input 
                         type="text" value={formData.state || ''}
                         onChange={e => setFormData({...formData, state: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all"
                       />
                    </div>
                     <div className="col-span-1">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">CEP</label>
                       <input 
                         type="text" value={formData.zipCode || ''}
                         onChange={e => setFormData({...formData, zipCode: e.target.value})}
                         className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 outline-none transition-all"
                       />
                    </div>
                  </div>
                </div>

                {/* Observations Section */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">4. Notas & Perfil Comportamental</h4>
                   <textarea 
                     value={formData.observations || ''}
                     onChange={e => setFormData({...formData, observations: e.target.value})}
                     className="w-full px-8 py-6 border border-slate-200 rounded-[2rem] text-xs font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all min-h-[120px] bg-slate-50/20"
                     placeholder="Perfis do cliente, avisos técnicos, preferências, etc..."
                   />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
                >
                  {editingCustomer ? 'Salvar Alterações' : 'Confirmar Cadastro Oficial'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCustomers;
