import React from 'react';
import { FileBarChart, Download, Calendar } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios & BI</h1>
          <p className="text-gray-500">Análise detalhada e relatórios gerenciais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'DRE Gerencial', desc: 'Demonstrativo de Resultados do Exercício' },
          { title: 'Fluxo de Caixa', desc: 'Análise de entradas e saídas por período' },
          { title: 'Balancete', desc: 'Posição patrimonial e financeira' },
          { title: 'Contas a Pagar', desc: 'Relatório detalhado de obrigações' },
          { title: 'Contas a Receber', desc: 'Relatório de faturamento e inadimplência' },
          { title: 'Centro de Custos', desc: 'Despesas por departamento/projeto' },
        ].map((report, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <FileBarChart size={24} />
              </div>
              <button className="text-gray-400 hover:text-emerald-600">
                <Download size={20} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{report.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
            <div className="flex items-center text-xs text-gray-400 gap-2">
              <Calendar size={14} />
              <span>Última geração: 27/02/2026</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
