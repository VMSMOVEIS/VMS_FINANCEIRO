import React from 'react';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const RHPerformance: React.FC = () => {
  const evaluations = [
    { id: '1', employee: 'Ana Silva', department: 'Marketing', score: 4.8, status: 'completed', date: '12/03/2026' },
    { id: '2', employee: 'Carlos Santos', department: 'Vendas', score: 4.2, status: 'completed', date: '10/03/2026' },
    { id: '3', employee: 'Mariana Costa', department: 'TI', score: 0, status: 'pending', date: '15/03/2026' },
    { id: '4', employee: 'Ricardo Oliveira', department: 'Financeiro', score: 3.9, status: 'completed', date: '08/03/2026' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-pink-600" size={28} />
            Desempenho & Metas
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhamento de avaliações, OKRs e feedback contínuo</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Nova Avaliação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Target size={20} />
            </div>
            <h3 className="font-bold">Ciclo Atual</h3>
          </div>
          <p className="text-3xl font-bold">75%</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">Conclusão das avaliações</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold">Média Global</h3>
          </div>
          <p className="text-3xl font-bold">4.2</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Escala de 1 a 5</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award size={20} />
            </div>
            <h3 className="font-bold">Top Performers</h3>
          </div>
          <p className="text-3xl font-bold">18%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Colaboradores nota 5.0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-bold">Feedbacks</h3>
          </div>
          <p className="text-3xl font-bold">142</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Enviados este mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg">Avaliações Recentes</h3>
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
                    <th className="px-6 py-4">Nota</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {evaluations.map(evalItem => (
                    <tr key={evalItem.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                            {evalItem.employee.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm">{evalItem.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{evalItem.department}</td>
                      <td className="px-6 py-4">
                        {evalItem.score > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm">{evalItem.score}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Award key={star} size={12} className={star <= Math.floor(evalItem.score) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          evalItem.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {evalItem.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{evalItem.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-pink-600 hover:text-pink-700 font-bold text-sm">Ver Detalhes</button>
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
              <Target className="text-pink-600" size={20} />
              OKRs Corporativos
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">Crescimento de Receita</p>
                  <span className="text-xs font-bold text-pink-600">82%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">Satisfação do Cliente (NPS)</p>
                  <span className="text-xs font-bold text-blue-600">65%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">Retenção de Talentos</p>
                  <span className="text-xs font-bold text-emerald-600">94%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="text-amber-500" size={20} />
              Próximos Feedbacks
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">João Souza</p>
                  <p className="text-xs text-gray-500">Amanhã, às 14:30</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
              </div>

              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ML
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Maria Lima</p>
                  <p className="text-xs text-gray-500">Quarta, às 09:00</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHPerformance;
