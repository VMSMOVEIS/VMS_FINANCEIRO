import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Truck
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { Supplier } from '../types';

const PurchasingSuppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useProduction();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    category: '',
    status: 'active',
    notes: '',
    rating: 0,
    lastOrderDate: ''
  });

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.cnpj && s.cnpj.includes(searchTerm)) ||
                         (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({ ...supplier });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        cnpj: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        category: '',
        status: 'active',
        notes: '',
        rating: 0,
        lastOrderDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      await updateSupplier({ ...formData, id: editingSupplier.id });
    } else {
      await addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const categories = Array.from(new Set(suppliers.map(s => s.category).filter(Boolean)));

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-emerald-600" size={28} />
            Gestão de Fornecedores
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cadastro, homologação e avaliação de desempenho de fornecedores</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, CNPJ ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
        
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Todas as Categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4 flex gap-1">
              <button 
                onClick={() => handleOpenModal(supplier)}
                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Excluir fornecedor?')) deleteSupplier(supplier.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                {supplier.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="pr-12">
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors truncate">{supplier.name}</h3>
                <p className="text-emerald-600 text-sm font-medium mt-0.5">{supplier.category || 'Geral'}</p>
                <div className="mt-2 flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-900">{supplier.rating || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Users size={16} className="text-gray-400" />
                <span>{supplier.contactName || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Phone size={16} className="text-gray-400" />
                <span>{supplier.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{supplier.email || '-'}</span>
              </div>
              {supplier.lastOrderDate && (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FileText size={16} className="text-gray-400" />
                  <span>Último Pedido: {new Date(supplier.lastOrderDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {supplier.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={12} /> Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                    <AlertCircle size={12} /> Inativo
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleOpenModal(supplier)}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Truck size={20} /> {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Razão Social</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CNPJ</label>
                  <input 
                    type="text" 
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato Responsável</label>
                  <input 
                    type="text" 
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                    placeholder="Ex: Madeiras, Ferragens"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                  <input 
                    type="text" 
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avaliação (0-5)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm resize-none" 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                  {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasingSuppliers;
