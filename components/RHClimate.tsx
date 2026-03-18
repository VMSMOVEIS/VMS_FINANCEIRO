import React from 'react';
import { 
  Smile, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Heart, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const RHClimate: React.FC = () => {
  const surveys = [
    { id: '1', title: 'Pesquisa de Clima 2026', type: 'Anual', participants: 142, completion: '92%', status: 'active', date: '15/03/2026' },
    { id: '2', title: 'Satisfação Home Office', type: 'Pulse', participants: 85, completion: '100%', status: 'completed', date: '10/02/2026' },
    { id: '3', title: 'Integração Novos Colaboradores', type: 'Onboarding', participants: 12, completion: '75%', status: 'active', date: '01/03/2026' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Smile className="text-pink-600" size={28} />
            Clima & Engajamento
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitoramento da satisfação, cultura e bem-estar organizacional</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Nova Pesquisa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Smile size={20} />
            </div>
            <h3 className="font-bold">eNPS Atual</h3>
          </div>
          <p className="text-3xl font-bold">72</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">Zona de Excelência</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold">Engajamento</h3>
          </div>
          <p className="text-3xl font-bold">88%</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">+5% em relação ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Heart size={20} />
            </div>
            <h3 className="font-bold">Bem-estar</h3>
          </div>
          <p className="text-3xl font-bold">4.5</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Média de satisfação global</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold">Sugestões</h3>
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Aguardando revisão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg">Pesquisas de Clima</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar pesquisa..." 
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
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Participantes</th>
                    <th className="px-6 py-4">Conclusão</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {surveys.map(survey => (
                    <tr key={survey.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                            <BarChart3 size={16} />
                          </div>
                          <span className="font-semibold text-sm">{survey.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{survey.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{survey.participants} colaboradores</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-600 rounded-full" style={{ width: survey.completion }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-700">{survey.completion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          survey.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {survey.status === 'active' ? 'Em Aberto' : 'Finalizada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-pink-600 hover:text-pink-700 font-bold text-sm">Ver Resultados</button>
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
              <MessageSquare className="text-pink-600" size={20} />
              Sugestões Recentes
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-pink-200 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Infraestrutura</span>
                  <span className="text-[10px] text-gray-400">Há 2 horas</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors italic">"Melhoria na iluminação da área de convivência..."</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={12} />
                    <span>Anônimo</span>
                  </div>
                  <button className="text-xs font-bold text-pink-600 hover:underline">Responder</button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-pink-200 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Benefícios</span>
                  <span className="text-[10px] text-gray-400">Há 1 dia</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors italic">"Sugestão de parceria com novas academias..."</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={12} />
                    <span>Anônimo</span>
                  </div>
                  <button className="text-xs font-bold text-pink-600 hover:underline">Responder</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Cultura em Foco</h4>
            <p className="text-indigo-100 text-sm mb-6">Nosso próximo Happy Hour será temático! Vote no tema preferido até sexta.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
              Votar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHClimate;
