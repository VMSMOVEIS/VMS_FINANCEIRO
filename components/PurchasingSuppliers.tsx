import React from 'react';
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
  Plus
} from 'lucide-react';

const PurchasingSuppliers: React.FC = () => {
  const suppliers = [
    { id: '1', name: 'Metalúrgica Gerdau S.A.', category: 'Matéria-Prima', contact: 'Carlos Alberto', email: 'vendas@gerdau.com.br', phone: '(11) 4004-1234', rating: 4.8, status: 'active', lastOrder: '2026-03-10' },
    { id: '2', name: 'Plásticos Ipiranga Ltda', category: 'Embalagens', contact: 'Ana Paula', email: 'comercial@ipiranga.com.br', phone: '(11) 3322-5544', rating: 4.2, status: 'active', lastOrder: '2026-03-05' },
    { id: '3', name: 'Ferramentas Bosch', category: 'Manutenção', contact: 'Marcos Silva', email: 'suporte@bosch.com.br', phone: '(19) 2103-9000', rating: 4.9, status: 'active', lastOrder: '2026-02-20' },
    { id: '4', name: 'Logística Expressa S.A.', category: 'Serviços', contact: 'Fabiana Costa', email: 'contato@logexpress.com.br', phone: '(11) 5566-7788', rating: 3.5, status: 'on_review', lastOrder: '2026-03-15' },
  ];

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
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
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
            placeholder="Buscar por nome, categoria ou contato..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
        
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
          <option value="">Todas as Categorias</option>
          <option value="Matéria-Prima">Matéria-Prima</option>
          <option value="Embalagens">Embalagens</option>
          <option value="Manutenção">Manutenção</option>
          <option value="Serviços">Serviços</option>
        </select>

        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
          <option value="">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="on_review">Em Revisão</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                {supplier.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{supplier.name}</h3>
                <p className="text-emerald-600 text-sm font-medium mt-0.5">{supplier.category}</p>
                <div className="mt-2 flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-900">{supplier.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Phone size={16} className="text-gray-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FileText size={16} className="text-gray-400" />
                <span>Último Pedido: {new Date(supplier.lastOrder).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {supplier.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={12} /> Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                    <AlertCircle size={12} /> Em Revisão
                  </span>
                )}
              </div>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasingSuppliers;
