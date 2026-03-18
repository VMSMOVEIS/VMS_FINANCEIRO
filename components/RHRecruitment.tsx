import React from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

const RHRecruitment: React.FC = () => {
  const jobs = [
    { id: '1', title: 'Analista de Sistemas Pleno', department: 'TI', location: 'Remoto', type: 'CLT', salary: 'R$ 8.500,00', candidates: 12, status: 'open', date: '2026-03-10' },
    { id: '2', title: 'Gerente Comercial', department: 'Vendas', location: 'São Paulo, SP', type: 'PJ', salary: 'R$ 12.000,00 + Comissões', candidates: 45, status: 'open', date: '2026-03-12' },
    { id: '3', title: 'Auxiliar Administrativo', department: 'Financeiro', location: 'Curitiba, PR', type: 'CLT', salary: 'R$ 2.800,00', candidates: 89, status: 'closed', date: '2026-02-28' },
    { id: '4', title: 'Desenvolvedor Frontend Sênior', department: 'TI', location: 'Híbrido', type: 'CLT', salary: 'R$ 15.000,00', candidates: 8, status: 'open', date: '2026-03-15' },
  ];

  const candidates = [
    { id: '1', name: 'Ricardo Oliveira', job: 'Analista de Sistemas Pleno', stage: 'Entrevista Técnica', rating: 4.5, date: '2026-03-18' },
    { id: '2', name: 'Mariana Santos', job: 'Gerente Comercial', stage: 'Triagem', rating: 4.0, date: '2026-03-17' },
    { id: '3', name: 'Carlos Eduardo', job: 'Desenvolvedor Frontend Sênior', stage: 'Teste Prático', rating: 4.8, date: '2026-03-18' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="text-pink-600" size={28} />
            Recrutamento & Seleção
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie vagas, candidatos e processos seletivos</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={18} />
            Nova Vaga
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar vagas..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {job.status === 'open' ? 'Aberta' : 'Encerrada'}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-pink-600 transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{job.department} • {job.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users size={14} />
                    <span>{job.candidates} candidatos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>Postada em {new Date(job.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{job.salary}</span>
                  <button className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    Ver Detalhes
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity / Candidates */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="text-amber-500" size={20} />
              Atividade Recente
            </h3>
            
            <div className="space-y-6">
              {candidates.map(candidate => (
                <div key={candidate.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                    {candidate.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{candidate.name}</p>
                    <p className="text-xs text-gray-500 truncate">{candidate.job}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded uppercase">
                        {candidate.stage}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(candidate.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors border-t border-gray-50 pt-4">
              Ver Todos os Candidatos
            </button>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-rose-700 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Banco de Talentos</h4>
            <p className="text-pink-100 text-sm mb-6">Acesse mais de 2.500 currículos qualificados em nossa base.</p>
            <button className="w-full py-2 bg-white text-pink-600 rounded-xl text-sm font-bold hover:bg-pink-50 transition-colors">
              Explorar Base
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHRecruitment;
