import React from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ArrowRight,
  Plus,
  FileText
} from 'lucide-react';

const PurchasingQuotes: React.FC = () => {
  const quotes = [
    { id: '1', title: 'Cotação de Aço Inox 304', category: 'Matéria-Prima', suppliers: 5, responses: 3, status: 'active', deadline: '2026-03-25', budget: 'R$ 50.000,00' },
    { id: '2', title: 'Compra de EPIs Trimestral', category: 'Segurança', suppliers: 3, responses: 3, status: 'completed', deadline: '2026-03-15', budget: 'R$ 12.500,00' },
    { id: '3', title: 'Novas Cadeiras Ergonômicas', category: 'Mobiliário', suppliers: 4, responses: 1, status: 'active', deadline: '2026-03-30', budget: 'R$ 8.000,00' },
    { id: '4', title: 'Manutenção Ar Condicionado', category: 'Serviços', suppliers: 2, responses: 0, status: 'waiting', deadline: '2026-03-22', budget: 'R$ 3.500,00' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700"><Clock size={12} /> Em Aberto</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700"><CheckCircle2 size={12} /> Finalizada</span>;
      case 'waiting':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700"><AlertCircle size={12} /> Aguardando</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" size={28} />
            Cotações de Preço
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie processos de cotação e escolha as melhores propostas</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={18} />
            Nova Cotação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quotes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar cotações..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {quotes.map(quote => (
              <div key={quote.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors">{quote.title}</h3>
                      <p className="text-sm text-gray-500">{quote.category} • {quote.suppliers} fornecedores convidados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Orçamento Est.</p>
                      <p className="text-sm font-bold text-gray-900">{quote.budget}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Respostas</p>
                      <p className="text-sm font-bold text-emerald-600">{quote.responses} / {quote.suppliers}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(quote.status)}
                      <span className="text-[10px] text-gray-400">Vence em {new Date(quote.deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary / Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="text-emerald-500" size={20} />
              Economia Gerada (Mês)
            </h3>
            
            <div className="text-center py-4">
              <h4 className="text-3xl font-bold text-emerald-600">R$ 18.450,00</h4>
              <p className="text-sm text-gray-500 mt-1">Economia média de 12% por cotação</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Cotações em aberto:</span>
                <span className="font-bold text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Aguardando aprovação:</span>
                <span className="font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Finalizadas este mês:</span>
                <span className="font-bold text-gray-900">15</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Relatório de Compras</h4>
            <p className="text-gray-400 text-sm mb-6">Analise o histórico de preços e performance de fornecedores.</p>
            <button className="w-full py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasingQuotes;
