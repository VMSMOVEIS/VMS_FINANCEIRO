import React from 'react';
import { 
  Globe, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Layout, 
  Settings, 
  Eye, 
  Clock, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Users,
  MessageSquare
} from 'lucide-react';

const RHPortal: React.FC = () => {
  const announcements = [
    { id: '1', title: 'Novo Plano de Saúde 2026', category: 'Benefícios', author: 'Ana Silva', date: '12/03/2026', views: 142 },
    { id: '2', title: 'Workshop de Liderança - Inscrições Abertas', category: 'Treinamento', author: 'Mariana Costa', date: '10/03/2026', views: 85 },
    { id: '3', title: 'Comunicado: Feriado de Páscoa', category: 'Comunicado', author: 'RH Corporativo', date: '05/03/2026', views: 210 },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="text-pink-600" size={28} />
            Portal do Colaborador
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de conteúdo, comunicados e autoatendimento</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <Settings size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
            <Plus size={18} />
            Novo Comunicado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-bold">Acessos Hoje</h3>
          </div>
          <p className="text-3xl font-bold">85</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">60% da base ativa</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold">Comunicados Ativos</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Publicados este mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold">Solicitações</h3>
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Aguardando RH</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Layout size={20} />
            </div>
            <h3 className="font-bold">Widgets</h3>
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Configurados no portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg">Comunicados Recentes</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar comunicado..." 
                    className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 w-64"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <Filter size={16} />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Autor</th>
                    <th className="px-6 py-4">Visualizações</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {announcements.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                            <MessageSquare size={16} />
                          </div>
                          <span className="font-semibold text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Eye size={14} />
                          {item.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Layout className="text-pink-600" size={20} />
              Links Rápidos
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-pink-50 rounded-xl font-semibold text-sm transition-all group border border-gray-100 hover:border-pink-200">
                <div className="flex items-center gap-3">
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Portal de Benefícios</span>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-pink-50 rounded-xl font-semibold text-sm transition-all group border border-gray-100 hover:border-pink-200">
                <div className="flex items-center gap-3">
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Holerites Online</span>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-pink-50 rounded-xl font-semibold text-sm transition-all group border border-gray-100 hover:border-pink-200">
                <div className="flex items-center gap-3">
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Solicitar Férias</span>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-amber-500" size={20} />
              Status do Sistema
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Portal Web</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Operacional
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">App Mobile</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Operacional
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Integração</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  Lentidão
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHPortal;
