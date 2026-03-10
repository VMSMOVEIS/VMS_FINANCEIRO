import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ArrowRight,
  History,
  Tag,
  Calendar,
  Layers,
  Box
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';

interface InventoryItem {
  id: string;
  name: string;
  category: 'pronta_entrega' | 'sob_medida';
  type: 'mp' | 'pa' | 'processo';
  quantity: number;
  unit: string;
  entryDate: string;
  location: string;
  value: number;
}

const MOCK_INVENTORY: InventoryItem[] = [
  // PA - Pronta Entrega
  { id: 'PA-001', name: 'Mesa de Jantar Carvalho 6 Lugares', category: 'pronta_entrega', type: 'pa', quantity: 5, unit: 'UN', entryDate: '2025-12-10', location: 'A-01', value: 2500 },
  { id: 'PA-002', name: 'Cadeira Estofada Veludo Cinza', category: 'pronta_entrega', type: 'pa', quantity: 24, unit: 'UN', entryDate: '2026-01-15', location: 'A-02', value: 450 },
  { id: 'PA-003', name: 'Aparador Retrô Off White', category: 'pronta_entrega', type: 'pa', quantity: 3, unit: 'UN', entryDate: '2025-11-20', location: 'B-05', value: 890 },
  
  // PA - Sob Medida
  { id: 'PA-SM-001', name: 'Cozinha Planejada - Cliente João', category: 'sob_medida', type: 'pa', quantity: 1, unit: 'KIT', entryDate: '2026-03-01', location: 'Expedição', value: 15000 },
  { id: 'PA-SM-002', name: 'Painel TV Ripado - Cliente Maria', category: 'sob_medida', type: 'pa', quantity: 1, unit: 'UN', entryDate: '2026-03-05', location: 'Expedição', value: 3200 },

  // Processo - Pronta Entrega
  { id: 'PR-001', name: 'Sofá 3 Lugares Retrátil (Estrutura)', category: 'pronta_entrega', type: 'processo', quantity: 10, unit: 'UN', entryDate: '2026-03-08', location: 'Tapeçaria', value: 1200 },
  
  // Processo - Sob Medida
  { id: 'PR-SM-001', name: 'Dormitório Casal - Cliente Carlos', category: 'sob_medida', type: 'processo', quantity: 1, unit: 'KIT', entryDate: '2026-03-09', location: 'Montagem', value: 8500 },

  // MP
  { id: 'MP-001', name: 'Chapa MDF 18mm Carvalho', category: 'pronta_entrega', type: 'mp', quantity: 45, unit: 'CH', entryDate: '2026-02-10', location: 'Almoxarifado', value: 280 },
];

interface ProductionInventoryProps {
  activeSubItem?: string | null;
}

export const ProductionInventory: React.FC<ProductionInventoryProps> = ({ activeSubItem }) => {
  const { stockAgingConfigs, inventory } = useProduction();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeSubItem === 'estoque_mp') return matchesSearch && item.type === 'mp';
      if (activeSubItem === 'estoque_pa_pronta') return matchesSearch && item.type === 'pa' && item.category === 'pronta_entrega';
      if (activeSubItem === 'estoque_pa_medida') return matchesSearch && item.type === 'pa' && item.category === 'sob_medida';
      if (activeSubItem === 'estoque_processo_pronta') return matchesSearch && item.type === 'processo' && item.category === 'pronta_entrega';
      if (activeSubItem === 'estoque_processo_medida') return matchesSearch && item.type === 'processo' && item.category === 'sob_medida';
      
      return matchesSearch;
    });
  }, [activeSubItem, searchTerm]);

  const calculateDiscount = (entryDate: string) => {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const applicableConfig = [...stockAgingConfigs]
      .filter(c => c.active && diffDays >= c.days)
      .sort((a, b) => b.days - a.days)[0];

    return applicableConfig ? applicableConfig.discount : 0;
  };

  const getTitle = () => {
    switch (activeSubItem) {
      case 'estoque_mp': return 'Estoque de Matéria-Prima';
      case 'estoque_pa_pronta': return 'Estoque PA - Pronta Entrega';
      case 'estoque_pa_medida': return 'Estoque PA - Sob Medida';
      case 'estoque_processo_pronta': return 'Processo - Pronta Entrega';
      case 'estoque_processo_medida': return 'Processo - Sob Medida';
      default: return 'Gestão de Estoques';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-orange-600" size={28} />
            {getTitle()}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Controle de saldos, localizações e envelhecimento de produtos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm">
          <Plus size={18} /> Entrada de Estoque
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white transition-colors">
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Desconto Aging</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => {
                const discount = calculateDiscount(item.entryDate);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                          {item.type === 'mp' ? <Layers size={20} /> : item.type === 'pa' ? <Box size={20} /> : <History size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono uppercase">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                        <span className="text-[10px] font-bold text-gray-400">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.entryDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                        {item.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-[10px] font-bold flex items-center gap-1">
                            <Tag size={10} /> -{discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Sem desconto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhum item encontrado no estoque selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
