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
  Box,
  X,
  Trash2,
  Edit2
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { InventoryItem } from '../types';

interface ProductionInventoryProps {
  activeSubItem?: string | null;
}

export const ProductionInventory: React.FC<ProductionInventoryProps> = ({ activeSubItem }) => {
  const { stockAgingConfigs, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useProduction();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: 'pronta_entrega',
    type: 'mp',
    quantity: 0,
    unit: 'UN',
    entryDate: new Date().toISOString().split('T')[0],
    location: '',
    value: 0,
    estimatedCost: 0
  });

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
  }, [activeSubItem, searchTerm, inventory]);

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

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        type: item.type,
        quantity: item.quantity,
        unit: item.unit,
        entryDate: item.entryDate,
        location: item.location,
        value: item.value,
        estimatedCost: item.estimatedCost
      });
    } else {
      setEditingItem(null);
      // Auto-set type based on activeSubItem
      let defaultType: 'mp' | 'pa' | 'processo' = 'mp';
      let defaultCategory: 'pronta_entrega' | 'sob_medida' = 'pronta_entrega';
      
      if (activeSubItem?.includes('mp')) defaultType = 'mp';
      else if (activeSubItem?.includes('pa')) defaultType = 'pa';
      else if (activeSubItem?.includes('processo')) defaultType = 'processo';

      if (activeSubItem?.includes('medida')) defaultCategory = 'sob_medida';

      setFormData({
        name: '',
        category: defaultCategory,
        type: defaultType,
        quantity: 0,
        unit: 'UN',
        entryDate: new Date().toISOString().split('T')[0],
        location: '',
        value: 0,
        estimatedCost: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateInventoryItem({ ...formData, id: editingItem.id });
    } else {
      await addInventoryItem({ ...formData, id: '' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
      await deleteInventoryItem(id);
      setShowActions(null);
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
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm"
        >
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
                          <p className="text-[10px] text-gray-500 font-mono uppercase truncate max-w-[100px]">{item.id}</p>
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
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setShowActions(showActions === item.id ? null : item.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {showActions === item.id && (
                        <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                          <button 
                            onClick={() => {
                              handleOpenModal(item);
                              setShowActions(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <Edit2 size={16} /> Editar Item
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} /> Excluir Item
                          </button>
                        </div>
                      )}
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

      {/* Modal de Entrada de Estoque */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus size={24} />
                {editingItem ? 'Editar Item' : 'Entrada de Estoque'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Produto/Material</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                    placeholder="Ex: Chapa MDF 18mm Carvalho" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Estoque</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="mp">Matéria-Prima (MP)</option>
                    <option value="pa">Produto Acabado (PA)</option>
                    <option value="processo">Em Processo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="pronta_entrega">Pronta Entrega</option>
                    <option value="sob_medida">Sob Medida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantidade</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Unidade</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="UN">Unidade (UN)</option>
                    <option value="CH">Chapa (CH)</option>
                    <option value="MT">Metro (MT)</option>
                    <option value="M2">Metro Quadrado (M2)</option>
                    <option value="KG">Quilo (KG)</option>
                    <option value="KIT">Kit (KIT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Data de Entrada</label>
                  <input 
                    type="date" 
                    required
                    value={formData.entryDate}
                    onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Localização</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                    placeholder="Ex: Almoxarifado A-01" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Valor Unitário (R$)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Custo Estimado (R$)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({...formData, estimatedCost: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" 
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                  {editingItem ? 'Salvar Alterações' : 'Confirmar Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
