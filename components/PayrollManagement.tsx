import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { useEmployees } from '../src/context/EmployeeContext';

interface PayrollManagementProps {
  activeSubItem?: string | null;
}

export const PayrollManagement: React.FC<PayrollManagementProps> = ({ activeSubItem }) => {
  const { employees } = useEmployees();
  const [view, setView] = useState<'processing' | 'payslips' | 'taxes'>('processing');

  useEffect(() => {
    if (activeSubItem === 'folha_geral') setView('processing');
    else if (activeSubItem === 'folha_holerite') setView('payslips');
    else if (activeSubItem === 'folha_encargos') setView('taxes');
  }, [activeSubItem]);

  const renderProcessing = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Competência Atual</h3>
            <p className="text-sm text-gray-500">Março / 2026</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors shadow-sm">
            Processar Folha
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Fechar Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Bruto</p>
          <h4 className="text-2xl font-bold text-gray-900">R$ 145.230,00</h4>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp size={12} /> +4.2% vs mês anterior
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Encargos Sociais</p>
          <h4 className="text-2xl font-bold text-gray-900">R$ 42.180,00</h4>
          <p className="text-xs text-gray-400 mt-2">FGTS, INSS, RAT</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Líquido</p>
          <h4 className="text-2xl font-bold text-gray-900">R$ 103.050,00</h4>
          <p className="text-xs text-gray-400 mt-2">Pagamento em 05/04/2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Resumo por Colaborador</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20" />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Salário Base</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Proventos</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descontos</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Líquido</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">R$ {emp.salary.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-sm text-emerald-600">+ R$ 250,00</td>
                <td className="px-6 py-4 text-sm text-red-600">- R$ 480,00</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">R$ {(emp.salary - 230).toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">Pendente</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayslips = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Emissão de Holerites</h3>
          <p className="text-sm text-gray-500">Visualize e imprima os comprovantes de pagamento</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Printer size={18} /> Imprimir Todos
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors shadow-sm">
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  {emp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{emp.name}</h4>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md">MAR/26</span>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Salário Líquido:</span>
                <span className="font-bold text-gray-900">R$ {(emp.salary * 0.85).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Data de Pagamento:</span>
                <span className="text-gray-600">05/04/2026</span>
              </div>
            </div>
            <button className="w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold group-hover:bg-pink-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
              <FileText size={16} /> Visualizar Holerite
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTaxes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'FGTS', value: 'R$ 12.450,00', status: 'A vencer', date: '07/04', color: 'bg-blue-500' },
          { label: 'INSS Patronal', value: 'R$ 28.120,00', status: 'A vencer', date: '20/04', color: 'bg-pink-500' },
          { label: 'IRRF Folha', value: 'R$ 8.940,00', status: 'A vencer', date: '20/04', color: 'bg-amber-500' },
          { label: 'PIS sobre Folha', value: 'R$ 1.450,00', status: 'A vencer', date: '25/04', color: 'bg-emerald-500' },
        ].map((tax, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2 h-8 rounded-full ${tax.color}`}></div>
              <h4 className="font-bold text-gray-900">{tax.label}</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{tax.value}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Vencimento: {tax.date}</span>
              <span className="font-bold text-amber-600">{tax.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Guias de Recolhimento</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { name: 'GRRF - Março/2026', type: 'FGTS', amount: 'R$ 12.450,00', due: '07/04/2026' },
            { name: 'DARF Previdenciário', type: 'INSS', amount: 'R$ 28.120,00', due: '20/04/2026' },
            { name: 'DARF IRRF', type: 'IRRF', amount: 'R$ 8.940,00', due: '20/04/2026' },
          ].map((guia, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{guia.name}</p>
                  <p className="text-xs text-gray-500">{guia.type} • Vence em {guia.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-900">{guia.amount}</span>
                <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="text-pink-600" size={28} />
          Folha de Pagamento
        </h1>
        <p className="text-gray-500 text-sm mt-1">Processamento, holerites e gestão de encargos sociais</p>
      </div>

      {view === 'processing' && renderProcessing()}
      {view === 'payslips' && renderPayslips()}
      {view === 'taxes' && renderTaxes()}
    </div>
  );
};

const TrendingUp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
