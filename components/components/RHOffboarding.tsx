import React from 'react';
import { 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  UserMinus, 
  Clock, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  BarChart3
} from 'lucide-react';

const RHOffboarding: React.FC = () => {
  const offboardings = [
    { id: '1', employee: 'Lucas Mendes', department: 'Vendas', type: 'Pedido de Demissão', status: 'in-progress', date: '20/03/2026' },
    { id: '2', employee: 'Fernanda Rocha', department: 'Marketing', type: 'Término de Contrato', status: 'completed', date: '10/03/2026' },
    { id: '3', employee: 'Gabriel Souza', department: 'TI', type: 'Pedido de Demissão', status: 'pending', date: '25/03/2026' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LogOut className="text-pink-600" size={28} />
            Offboarding & Desligamento
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de saídas, entrevistas de desligamento e devolução de ativos</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Novo Desligamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <UserMinus size={20} />
            </div>
            <h3 className="font-bold">Turnover Mensal</h3>
          </div>
          <p className="text-3xl font-bold">1.8%</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">Abaixo da média do setor</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingDown size={20} />
            </div>
            <h3 className="font-bold">Taxa de Retenção</h3>
          </div>
          <p className="text-3xl font-bold">98.2%</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Estável nos últimos 6 meses</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold">Entrevistas Realizadas</h3>
          </div>
          <p className="text-3xl font-bold">100%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Todas as saídas entrevistadas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="font-bold">Processos em Aberto</h3>
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Aguardando finalização</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg">Processos de Desligamento</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar colaborador..." 
                    className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20"
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
                    <th className="px-6 py-4">Colaborador</th>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data Saída</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {offboardings.map(process => (
                    <tr key={process.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                            {process.employee.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm">{process.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{process.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{process.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          process.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          process.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {process.status === 'completed' ? 'Finalizado' : 
                           process.status === 'in-progress' ? 'Em Andamento' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{process.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-pink-600 hover:text-pink-700 font-bold text-sm">Gerenciar</button>
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
              <AlertCircle className="text-amber-500" size={20} />
              Checklist de Ativos
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400">
                    <FileText size={18} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Notebook Dell XPS</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pendente</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400">
                    <FileText size={18} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Crachá / Acesso</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Devolvido</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400">
                    <FileText size={18} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Celular Corporativo</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Devolvido</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="text-pink-600" size={20} />
              Motivos de Saída
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">Melhor Proposta</p>
                  <span className="text-xs font-bold text-pink-600">45%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">Crescimento Profissional</p>
                  <span className="text-xs font-bold text-blue-600">30%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">Clima Organizacional</p>
                  <span className="text-xs font-bold text-amber-600">15%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHOffboarding;
