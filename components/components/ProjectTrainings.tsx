import React from 'react';
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2,
  BookOpen,
  Award
} from 'lucide-react';

const ProjectTrainings: React.FC = () => {
  const trainings = [
    { id: '1', title: 'Metodologias Ágeis: Scrum & Kanban', description: 'Aprenda a gerenciar projetos de forma eficiente com as metodologias ágeis mais utilizadas no mercado.', duration: '120', modules: 8, category: 'Metodologia', rating: 4.8, students: 124, progress: 100 },
    { id: '2', title: 'Gestão de Riscos em Projetos ERP', description: 'Identifique, analise e mitigue riscos em projetos de grande escala e alta complexidade.', duration: '90', modules: 6, category: 'Gestão', rating: 4.5, students: 85, progress: 45 },
    { id: '3', title: 'UX/UI Design para Desenvolvedores', description: 'Fundamentos de design para criar interfaces centradas no usuário e com alta usabilidade.', duration: '180', modules: 12, category: 'Design', rating: 4.9, students: 210, progress: 0 },
    { id: '4', title: 'Liderança e Gestão de Equipes Remotas', description: 'Como manter a produtividade e o engajamento de times distribuídos geograficamente.', duration: '60', modules: 4, category: 'Liderança', rating: 4.7, students: 56, progress: 15 },
    { id: '5', title: 'Ferramentas de Automação de Testes', description: 'Introdução ao Selenium, Cypress e outras ferramentas para garantir a qualidade do software.', duration: '150', modules: 10, category: 'QA', rating: 4.6, students: 92, progress: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar treinamentos..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Novo Treinamento</span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Metodologia', 'Gestão', 'Design', 'Liderança', 'QA', 'Soft Skills'].map((cat, idx) => (
          <button 
            key={idx} 
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              idx === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map(training => (
          <div key={training.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col">
            <div className="h-40 bg-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  {training.category}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 text-indigo-600 fill-indigo-600" />
                </div>
              </div>
              {training.progress === 100 && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{training.title}</h4>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {training.rating}
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{training.description}</p>
              
              <div className="space-y-4">
                {training.progress > 0 && training.progress < 100 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Progresso</span>
                      <span>{training.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full" 
                        style={{ width: `${training.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{training.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{training.modules} aulas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{training.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all min-h-[300px]">
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">Novo Treinamento</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectTrainings;
