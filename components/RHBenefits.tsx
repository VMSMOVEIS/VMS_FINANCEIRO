import React from 'react';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Stethoscope, 
  Utensils, 
  Car, 
  Home, 
  Gift,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const RHBenefits: React.FC = () => {
  const benefits = [
    { id: '1', title: 'Plano de Saúde Bradesco', category: 'Saúde', provider: 'Bradesco Saúde', coverage: 'Nacional', status: 'active', cost: 'R$ 450,00' },
    { id: '2', title: 'Vale Refeição / Alimentação', category: 'Alimentação', provider: 'Sodexo', coverage: 'Cartão Flex', status: 'active', cost: 'R$ 850,00' },
    { id: '3', title: 'Seguro de Vida em Grupo', category: 'Segurança', provider: 'Porto Seguro', coverage: 'Vida e Acidentes', status: 'active', cost: 'R$ 25,00' },
    { id: '4', title: 'Auxílio Creche', category: 'Família', provider: 'Reembolso', coverage: 'Até 5 anos', status: 'active', cost: 'R$ 350,00' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="text-pink-600" size={28} />
            Gestão de Benefícios
          </h1>
          <p className="text-gray-500 text-sm mt-1">Administração de planos, convênios e vantagens corporativas</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold shadow-sm">
          <Plus size={18} />
          Novo Benefício
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Benefícios Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-pink-600 mt-1 font-medium">98% de adesão total</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Stethoscope size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Sinistralidade</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Dentro da meta esperada</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Utensils size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Investimento Mensal</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ 142k</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Média de R$ 910 por colaborador</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Gift size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Novas Parcerias</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Implementadas este trimestre</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar benefícios..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map(benefit => (
              <div key={benefit.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    {benefit.category === 'Saúde' ? <Stethoscope size={24} /> : 
                     benefit.category === 'Alimentação' ? <Utensils size={24} /> : 
                     benefit.category === 'Segurança' ? <ShieldCheck size={24} /> : 
                     <Gift size={24} />}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    Ativo
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-pink-600 transition-colors">{benefit.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{benefit.provider}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 size={14} />
                    <span>{benefit.coverage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ArrowRight size={14} />
                    <span>{benefit.cost} / mês</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Categoria: {benefit.category}</span>
                  <button className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    Gerenciar
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
              <Gift className="text-amber-500" size={20} />
              Vantagens & Descontos
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-pink-600 shadow-sm">
                  <Home size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Gympass</p>
                  <p className="text-xs text-gray-500">Academias e bem-estar</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-pink-600 shadow-sm">
                  <Car size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">TotalPass</p>
                  <p className="text-xs text-gray-500">Saúde e exercícios</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-pink-600 shadow-sm">
                  <Gift size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Clube de Descontos</p>
                  <p className="text-xs text-gray-500">Parcerias em lojas e lazer</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              Ver Todos os Convênios
            </button>
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-pink-700 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Seguro Saúde</h4>
            <p className="text-rose-100 text-sm mb-6">Abertura de dependentes e alteração de plano disponível até 30/03.</p>
            <button className="w-full py-2 bg-white text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors">
              Solicitar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHBenefits;
