import React from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2, 
  PlayCircle,
  Award,
  ArrowRight
} from 'lucide-react';

const RHTraining: React.FC = () => {
  const trainings = [
    { id: '1', title: 'Segurança do Trabalho (NR-12)', category: 'Obrigatório', duration: '8h', participants: 45, status: 'in-progress', date: '2026-03-20' },
    { id: '2', title: 'Liderança e Gestão de Equipes', category: 'Desenvolvimento', duration: '16h', participants: 12, status: 'scheduled', date: '2026-03-25' },
    { id: '3', title: 'Excel Avançado para Finanças', category: 'Técnico', duration: '20h', participants: 8, status: 'completed', date: '2026-02-28' },
    { id: '4', title: 'Comunicação Não-Violenta', category: 'Soft Skills', duration: '4h', participants: 30, status: 'scheduled', date: '2026-04-05' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="text-pink-600" size={28} />
            Treinamentos & Desenvolvimento
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de capacitação, cursos e trilhas de aprendizagem</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Novo Treinamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Cursos Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">3 iniciados esta semana</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Participantes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">95</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">60% do quadro total</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Certificações</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">142</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Emitidas nos últimos 12 meses</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Horas Acumuladas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1.240h</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Média de 8h por colaborador</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar treinamentos..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainings.map(training => (
              <div key={training.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <PlayCircle size={24} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    training.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    training.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {training.status === 'completed' ? 'Concluído' : 
                     training.status === 'in-progress' ? 'Em Andamento' : 
                     'Agendado'}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-pink-600 transition-colors">{training.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{training.category}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={14} />
                    <span>Duração: {training.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users size={14} />
                    <span>{training.participants} inscritos</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Data: {new Date(training.date).toLocaleDateString('pt-BR')}</span>
                  <button className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    Ver Detalhes
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="text-amber-500" size={20} />
              Trilhas de Aprendizagem
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-900 mb-1">Liderança VMS</p>
                <p className="text-xs text-gray-500 mb-4">4 cursos • 32 horas totais</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">75%</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-900 mb-1">Excelência em Vendas</p>
                <p className="text-xs text-gray-500 mb-4">3 cursos • 12 horas totais</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">30%</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              Ver Todas as Trilhas
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Plataforma EAD</h4>
            <p className="text-indigo-100 text-sm mb-6">Acesse nossa plataforma de cursos online e aprenda no seu ritmo.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
              Acessar Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHTraining;
