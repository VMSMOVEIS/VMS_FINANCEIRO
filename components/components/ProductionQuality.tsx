import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Plus,
  FileText,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

const ProductionQuality: React.FC = () => {
  const inspections = [
    { id: 'INS-001', product: 'Eixo de Transmissão X1', batch: 'LOTE-2026-A', date: '2026-03-18', result: 'approved', inspector: 'João Silva' },
    { id: 'INS-002', product: 'Engrenagem Cônica Z2', batch: 'LOTE-2026-B', date: '2026-03-18', result: 'rejected', inspector: 'Maria Santos' },
    { id: 'INS-003', product: 'Suporte Metálico S3', batch: 'LOTE-2026-C', date: '2026-03-17', result: 'approved', inspector: 'João Silva' },
    { id: 'INS-004', product: 'Pino de Fixação P4', batch: 'LOTE-2026-D', date: '2026-03-17', result: 'warning', inspector: 'Carlos Lima' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={28} />
            Controle de Qualidade
          </h1>
          <p className="text-gray-500 text-sm mt-1">Inspeções, conformidade e gestão de não-conformidades</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Nova Inspeção
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Taxa de Aprovação</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">98.2%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">+0.5% em relação ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <XCircle size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Não Conformidades</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">14</p>
          <p className="text-xs text-rose-600 mt-1 font-medium">8 pendentes de resolução</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Auditorias Realizadas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Próxima auditoria em 15 dias</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar inspeções..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 py-4">ID Inspeção</th>
                <th className="px-6 py-4">Produto / Lote</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Inspetor</th>
                <th className="px-6 py-4">Resultado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inspections.map(ins => (
                <tr key={ins.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{ins.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{ins.product}</p>
                    <p className="text-xs text-gray-500">{ins.batch}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(ins.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ins.inspector}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                      ins.result === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      ins.result === 'rejected' ? 'bg-rose-100 text-rose-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {ins.result === 'approved' ? <CheckCircle2 size={10} /> : 
                       ins.result === 'rejected' ? <XCircle size={10} /> : 
                       <AlertTriangle size={10} />}
                      {ins.result === 'approved' ? 'Aprovado' : 
                       ins.result === 'rejected' ? 'Reprovado' : 
                       'Condicional'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionQuality;
