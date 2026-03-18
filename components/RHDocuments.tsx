import React from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Folder, 
  File, 
  Download, 
  Share2, 
  Trash2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';

const RHDocuments: React.FC = () => {
  const documents = [
    { id: '1', name: 'Manual do Colaborador 2026.pdf', type: 'PDF', size: '2.4 MB', date: '12/03/2026', category: 'Políticas' },
    { id: '2', name: 'Contrato Social - Atualizado.pdf', type: 'PDF', size: '1.8 MB', date: '10/03/2026', category: 'Jurídico' },
    { id: '3', name: 'Tabela Salarial - Q1 2026.xlsx', type: 'XLSX', size: '450 KB', date: '05/03/2026', category: 'Financeiro' },
    { id: '4', name: 'Formulário de Férias.docx', type: 'DOCX', size: '120 KB', date: '01/03/2026', category: 'Modelos' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-pink-600" size={28} />
            Documentos & Arquivos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Repositório central de documentos, políticas e formulários de RH</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
            <Plus size={18} />
            Upload de Arquivo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Folder size={20} />
            </div>
            <h3 className="font-bold">Total de Arquivos</h3>
          </div>
          <p className="text-3xl font-bold">248</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">1.2 GB utilizados</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <h3 className="font-bold">Documentos Ativos</h3>
          </div>
          <p className="text-3xl font-bold">182</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Atualizados este ano</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold">Assinaturas Pendentes</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Aguardando colaboradores</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-bold">Vencimentos Próximos</h3>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Exames e certificados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Folder className="text-pink-600" size={20} />
              Categorias
            </h3>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-pink-50 text-pink-600 rounded-xl font-bold text-sm transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <Folder size={18} />
                  <span>Todos os Arquivos</span>
                </div>
                <span className="text-xs">248</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all group">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Políticas Internas</span>
                </div>
                <span className="text-xs text-gray-400">42</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all group">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Contratos & Aditivos</span>
                </div>
                <span className="text-xs text-gray-400">85</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all group">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Benefícios</span>
                </div>
                <span className="text-xs text-gray-400">24</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all group">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                  <span>Treinamentos</span>
                </div>
                <span className="text-xs text-gray-400">36</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg">Arquivos Recentes</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar arquivo..." 
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
                    <th className="px-6 py-4">Nome do Arquivo</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tamanho</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {documents.map(docItem => (
                    <tr key={docItem.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
                            <File size={16} />
                          </div>
                          <div>
                            <span className="font-semibold text-sm block">{docItem.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{docItem.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {docItem.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{docItem.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{docItem.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                            <Download size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Share2 size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        </div>
      </div>
    </div>
  );
};

export default RHDocuments;
