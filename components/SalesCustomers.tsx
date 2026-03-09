import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  ExternalLink,
  History,
  MessageSquare
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    contact: 'Carlos Oliveira',
    email: 'contato@techsolutions.com',
    phone: '(11) 98765-4321',
    address: 'São Paulo, SP',
    totalSpent: 150000,
    lastOrder: '2026-02-15',
    status: 'active',
    segment: 'Tecnologia'
  },
  {
    id: '2',
    name: 'Indústria Metalúrgica Silva',
    cnpj: '98.765.432/0001-10',
    contact: 'Ana Paula',
    email: 'ana.paula@silvametal.com.br',
    phone: '(11) 91234-5678',
    address: 'Guarulhos, SP',
    totalSpent: 450000,
    lastOrder: '2026-03-01',
    status: 'active',
    segment: 'Indústria'
  },
  {
    id: '3',
    name: 'Varejo Express',
    cnpj: '45.678.901/0001-22',
    contact: 'Roberto Santos',
    email: 'financeiro@varejoexpress.com',
    phone: '(21) 99887-7665',
    address: 'Rio de Janeiro, RJ',
    totalSpent: 85000,
    lastOrder: '2026-01-20',
    status: 'inactive',
    segment: 'Varejo'
  },
  {
    id: '4',
    name: 'Logística Global S.A.',
    cnpj: '33.444.555/0001-33',
    contact: 'Fernanda Lima',
    email: 'fernanda@logglobal.com',
    phone: '(41) 97766-5544',
    address: 'Curitiba, PR',
    totalSpent: 210000,
    lastOrder: '2026-03-05',
    status: 'active',
    segment: 'Logística'
  }
];

const SalesCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="text-emerald-600" size={28} />
            Gestão de Clientes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Base de dados centralizada e histórico de relacionamento</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, CNPJ ou contato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <option value="">Todos os Segmentos</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="industria">Indústria</option>
            <option value="varejo">Varejo</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.cnpj}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{customer.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Comprado</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Último Pedido</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Histórico">
                  <History size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Mensagens">
                  <MessageSquare size={18} />
                </button>
              </div>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Ver Perfil
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesCustomers;
