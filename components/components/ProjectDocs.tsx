import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  Tag,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  Trash2
} from 'lucide-react';

const ProjectDocs: React.FC = () => {
  const [docs, setDocs] = useState([
    { id: '1', title: 'Escopo do Projeto ERP', content: 'Definição detalhada dos módulos e funcionalidades...', author: 'Ricardo Silva', updatedAt: '18/03/2026', tags: ['Escopo', 'ERP'], type: 'doc' },
    { id: '2', title: 'Manual de Integração Logística', content: 'Guia passo a passo para integrar com APIs externas...', author: 'Ana Paula', updatedAt: '15/03/2026', tags: ['Manual', 'Logística'], type: 'pdf' },
    { id: '3', title: 'Ata de Reunião - Kickoff', content: 'Resumo da reunião inicial com stakeholders...', author: 'Carlos Eduardo', updatedAt: '10/03/2026', tags: ['Reunião', 'Kickoff'], type: 'doc' },
    { id: '4', title: 'Mockups de Interface - Dashboard', content: 'Link para o Figma com os designs aprovados...', author: 'Juliana Costa', updatedAt: '12/03/2026', tags: ['Design', 'UX'], type: 'figma' },
    { id: '5', title: 'Plano de Testes de Qualidade', content: 'Critérios de aceitação e cenários de teste...', author: 'Ricardo Silva', updatedAt: '05/03/2026', tags: ['QA', 'Testes'], type: 'xls' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar documentos..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Folder className="w-4 h-4" />
            <span>Nova Pasta</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Documento</span>
          </button>
        </div>
      </div>

      {/* Folders Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Planejamento', 'Design', 'Desenvolvimento', 'Testes'].map((folder, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Folder className="w-5 h-5 text-amber-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{folder}</h4>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{idx + 2} Arquivos</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                doc.type === 'pdf' ? 'bg-rose-50 text-rose-600' :
                doc.type === 'figma' ? 'bg-indigo-50 text-indigo-600' :
                doc.type === 'xls' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{doc.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1">{doc.content}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {doc.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                  {doc.author.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {doc.updatedAt}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Baixar">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all min-h-[200px]">
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">Novo Documento</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectDocs;
