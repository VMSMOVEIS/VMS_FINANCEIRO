import React from 'react';
import { FileText, Calendar, AlertTriangle } from 'lucide-react';

export const TaxManagement: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fiscal & Tributário</h1>
          <p className="text-gray-500">Gestão de impostos e obrigações acessórias</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          Gerar Guia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vencimentos Próximos</p>
              <p className="text-lg font-bold text-gray-900">3 Guias</p>
            </div>
          </div>
          <div className="text-xs text-red-500 font-medium">Atenção: DAS vence amanhã</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Notas Emitidas (Mês)</p>
              <p className="text-lg font-bold text-gray-900">145 NF-e</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Total: R$ 450.000,00</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Competência Atual</p>
              <p className="text-lg font-bold text-gray-900">Fev/2026</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Fechamento em 5 dias</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Obrigações Fiscais</h3>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Tributo</th>
              <th className="px-6 py-3">Competência</th>
              <th className="px-6 py-3">Vencimento</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'DAS - Simples Nacional', comp: '01/2026', due: '20/02/2026', val: 'R$ 12.500,00', status: 'Pago' },
              { name: 'FGTS', comp: '01/2026', due: '07/02/2026', val: 'R$ 4.200,00', status: 'Pago' },
              { name: 'INSS', comp: '01/2026', due: '20/02/2026', val: 'R$ 8.900,00', status: 'Pendente' },
              { name: 'ISSQN', comp: '01/2026', due: '15/02/2026', val: 'R$ 1.500,00', status: 'Atrasado' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.comp}</td>
                <td className="px-6 py-4 text-gray-500">{item.due}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{item.val}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
