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
  CheckCircle,
  Edit2
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { InventoryItem } from '../types';

interface ProductionInventoryProps {
  activeSubItem?: string | null;
}

export const ProductionInventory: React.FC<ProductionInventoryProps> = ({ activeSubItem }) => {
  const { 
    stockAgingConfigs, 
    stockConfigItems,
    inventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem,
    finalizeProcess,
    addStockConfigItem
  } = useProduction();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<any>(null);
  const [quickAddName, setQuickAddName] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sob_medida' | 'pronta_entrega'>('sob_medida');

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    code: '',
    name: '',
    description: '',
    type: 'mp',
    category: '',
    stockCategory: 'pronta_entrega',
    brand: '',
    model: '',
    quantity: 0,
    unit: 'UN',
    location: '',
    value: 0,
    estimatedCost: 0,
    minStock: 0,
    maxStock: 0,
    margin: 0,
    markup: 0,
    commission: 0,
    warranty: '',
    productionLeadTime: 0,
    ncm: '',
    cfop: '',
    cst_csosn: '',
    entryDate: new Date().toISOString().split('T')[0],
    trackStock: true,
    averageCost: 0,
    lastPurchaseCost: 0,
    standardCost: 0,
    defaultSupplierId: '',
    purchaseLeadTime: 0,
    minPurchaseQuantity: 0,
    purchaseUnit: '',
    consumptionUnit: '',
    conversionFactor: 1,
    thickness: undefined,
    color: '',
    length: undefined,
    width: undefined,
    baseMaterial: '',
    productOrigin: '',
    status: 'active'
  });

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeSubItem === 'estoque_mp') return matchesSearch && item.type === 'mp';
      if (activeSubItem === 'estoque_pa') {
        return matchesSearch && item.type === 'pa' && item.stockCategory === activeTab;
      }
      if (activeSubItem === 'estoque_processo') {
        return matchesSearch && item.type === 'processo' && item.stockCategory === activeTab;
      }
      
      return matchesSearch;
    });
  }, [activeSubItem, searchTerm, inventory, activeTab]);

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
      case 'estoque_pa': return 'Estoque de Produtos Acabados (PA)';
      case 'estoque_processo': return 'Estoque de Produtos em Processo';
      default: return 'Gestão de Estoques';
    }
  };

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code || '',
        name: item.name,
        description: item.description || '',
        type: item.type,
        category: item.category || '',
        stockCategory: item.stockCategory || 'pronta_entrega',
        brand: item.brand || '',
        model: item.model || '',
        quantity: item.quantity,
        unit: item.unit,
        location: item.location || '',
        value: item.value,
        estimatedCost: item.estimatedCost || 0,
        minStock: item.minStock || 0,
        maxStock: item.maxStock || 0,
        margin: item.margin || 0,
        markup: item.markup || 0,
        commission: item.commission || 0,
        warranty: item.warranty || '',
        productionLeadTime: item.productionLeadTime || 0,
        ncm: item.ncm || '',
        cfop: item.cfop || '',
        cst_csosn: item.cst_csosn || '',
        entryDate: item.entryDate,
        trackStock: item.trackStock ?? true,
        averageCost: item.averageCost || 0,
        lastPurchaseCost: item.lastPurchaseCost || 0,
        standardCost: item.standardCost || 0,
        defaultSupplierId: item.defaultSupplierId || '',
        purchaseLeadTime: item.purchaseLeadTime || 0,
        minPurchaseQuantity: item.minPurchaseQuantity || 0,
        purchaseUnit: item.purchaseUnit || '',
        consumptionUnit: item.consumptionUnit || '',
        conversionFactor: item.conversionFactor || 1,
        thickness: item.thickness,
        color: item.color || '',
        length: item.length,
        width: item.width,
        baseMaterial: item.baseMaterial || '',
        productOrigin: item.productOrigin || '',
        status: item.status || 'active'
      });
    } else {
      setEditingItem(null);
      // Auto-set type based on activeSubItem
      let defaultType: 'mp' | 'pa' | 'processo' = 'mp';
      let defaultStockCategory: 'pronta_entrega' | 'sob_medida' = 'pronta_entrega';
      
      if (activeSubItem === 'estoque_mp') {
        defaultType = 'mp';
        defaultStockCategory = 'pronta_entrega';
      } else if (activeSubItem === 'estoque_pa') {
        defaultType = 'pa';
        defaultStockCategory = activeTab;
      } else if (activeSubItem === 'estoque_processo') {
        defaultType = 'processo';
        defaultStockCategory = activeTab;
      }

      setFormData({
        code: '',
        name: '',
        description: '',
        type: defaultType,
        category: '',
        stockCategory: defaultStockCategory,
        brand: '',
        model: '',
        quantity: 0,
        unit: 'UN',
        location: '',
        value: 0,
        estimatedCost: 0,
        minStock: 0,
        maxStock: 0,
        margin: 0,
        markup: 0,
        commission: 0,
        warranty: '',
        productionLeadTime: 0,
        ncm: '',
        cfop: '',
        cst_csosn: '',
        entryDate: new Date().toISOString().split('T')[0],
        trackStock: true,
        averageCost: 0,
        lastPurchaseCost: 0,
        standardCost: 0,
        defaultSupplierId: '',
        purchaseLeadTime: 0,
        minPurchaseQuantity: 0,
        purchaseUnit: '',
        consumptionUnit: '',
        conversionFactor: 1,
        thickness: undefined,
        color: '',
        length: undefined,
        width: undefined,
        baseMaterial: '',
        productOrigin: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleQuickAdd = () => {
    if (quickAddName && quickAddType) {
      addStockConfigItem({
        name: quickAddName,
        type: quickAddType
      });
      setQuickAddName('');
      setIsQuickAddOpen(false);
    }
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

  const isMP = activeSubItem === 'estoque_mp';

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
          <Plus size={18} /> {isMP ? 'Cadastrar Matéria-Prima' : 'Cadastrar Produto'}
        </button>
      </div>

      {/* Tabs for PA and Processo */}
      {(activeSubItem === 'estoque_pa' || activeSubItem === 'estoque_processo') && (
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('sob_medida')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'sob_medida' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sob Medida
          </button>
          <button
            onClick={() => setActiveTab('pronta_entrega')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'pronta_entrega' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pronta Entrega
          </button>
        </div>
      )}

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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{isMP ? 'Material' : 'Produto'}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                {isMP && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Modelo</th>
                  </>
                )}
                {!isMP && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo</th>
                {!isMP && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço de Venda</th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => {
                const discount = calculateDiscount(item.entryDate);
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => handleOpenModal(item)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600 font-bold">{item.code || '-'}</span>
                    </td>
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
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                        {item.category || '-'}
                      </span>
                    </td>
                    {isMP && (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.brand || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.model || '-'}</td>
                      </>
                    )}
                    {!isMP && (
                      <td className="px-6 py-4 text-sm text-gray-600">{item.brand || '-'}</td>
                    )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                          <span className="text-[10px] font-bold text-gray-400">{item.unit}</span>
                        </div>
                        {discount > 0 && (item.type === 'pa' || item.type === 'processo') && (
                          <div className="flex items-center gap-1 mt-1">
                            <History size={10} className="text-orange-500" />
                            <span className="text-[10px] font-bold text-orange-600">-{discount}% aging</span>
                          </div>
                        )}
                      </td>
                    {!isMP && (
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
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
                          {item.type === 'processo' && (
                            <button 
                              onClick={() => {
                                finalizeProcess(item.id);
                                setShowActions(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <CheckCircle size={16} /> Finalizar
                            </button>
                          )}
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
                {isMP ? <Layers size={24} /> : <Box size={24} />}
                {editingItem ? 'Editar Item' : isMP ? 'Cadastrar Matéria-Prima' : 'Cadastrar Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-100px)] max-h-[900px]">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Identificação */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Tag size={16} /> Identificação
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          placeholder={isMP ? "Ex: Chapa MDF 18mm Carvalho" : "Ex: Mesa de Jantar 6 Lugares"} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código</label>
                        <input 
                          type="text" 
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          placeholder="Ex: MP001" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-500 uppercase">Categoria</label>
                          <button 
                            type="button"
                            onClick={() => {
                              setQuickAddType(isMP ? 'mp_category' : 'pa_category');
                              setIsQuickAddOpen(true);
                            }}
                            className="text-orange-600 hover:text-orange-700 p-1"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                        >
                          <option value="">Selecione...</option>
                          {stockConfigItems
                            .filter(i => i.type === (isMP ? 'mp_category' : 'pa_category'))
                            .map(i => (
                              <option key={i.id} value={i.name}>{i.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marca</label>
                        <input 
                          type="text" 
                          value={formData.brand}
                          onChange={(e) => setFormData({...formData, brand: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo</label>
                        <input 
                          type="text" 
                          value={formData.model}
                          onChange={(e) => setFormData({...formData, model: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm h-20 resize-none" 
                        />
                      </div>
                    </div>
                  </section>

                  {isMP && (
                    <>
                      {/* Especificações Técnicas */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Filter size={16} /> Especificações Técnicas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Espessura (mm)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.thickness || ''}
                              onChange={(e) => setFormData({...formData, thickness: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor / Padrão</label>
                            <input 
                              type="text" 
                              value={formData.color}
                              onChange={(e) => setFormData({...formData, color: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Material Base</label>
                            <select 
                              value={formData.baseMaterial}
                              onChange={(e) => setFormData({...formData, baseMaterial: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="MDF">MDF</option>
                              <option value="MDP">MDP</option>
                              <option value="Metal">Metal</option>
                              <option value="Plástico">Plástico</option>
                              <option value="Madeira">Madeira Maciça</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comprimento (mm)</label>
                            <input 
                              type="number" 
                              value={formData.length || ''}
                              onChange={(e) => setFormData({...formData, length: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Largura (mm)</label>
                            <input 
                              type="number" 
                              value={formData.width || ''}
                              onChange={(e) => setFormData({...formData, width: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Controle de Estoque */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Box size={16} /> Controle de Estoque
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Atual</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.quantity}
                              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Mínimo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.minStock}
                              onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Máximo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.maxStock}
                              onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('uom');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.unit}
                              onChange={(e) => setFormData({...formData, unit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'uom')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                              {stockConfigItems.filter(i => i.type === 'uom').length === 0 && (
                                <>
                                  <option value="UN">Unidade (UN)</option>
                                  <option value="CH">Chapa (CH)</option>
                                  <option value="MT">Metro (MT)</option>
                                  <option value="M2">Metro Quadrado (M2)</option>
                                  <option value="KG">Quilo (KG)</option>
                                  <option value="KIT">Kit (KIT)</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Localização</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('location');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'location')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <input 
                              type="checkbox" 
                              id="trackStock"
                              checked={formData.trackStock}
                              onChange={(e) => setFormData({...formData, trackStock: e.target.checked})}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="trackStock" className="text-xs font-bold text-gray-500 uppercase cursor-pointer">Controla Estoque</label>
                          </div>
                        </div>
                      </section>

                      {/* Informações de Custos */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <History size={16} /> Informações de Custos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Médio (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.averageCost}
                              onChange={(e) => setFormData({...formData, averageCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Último Custo (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.lastPurchaseCost}
                              onChange={(e) => setFormData({...formData, lastPurchaseCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Padrão (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.standardCost}
                              onChange={(e) => setFormData({...formData, standardCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Informações de Compra */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Plus size={16} /> Informações de Compra
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor Padrão</label>
                            <input 
                              type="text" 
                              value={formData.defaultSupplierId}
                              onChange={(e) => setFormData({...formData, defaultSupplierId: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                              placeholder="ID ou Nome do Fornecedor"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo Entrega (dias)</label>
                            <input 
                              type="number" 
                              value={formData.purchaseLeadTime}
                              onChange={(e) => setFormData({...formData, purchaseLeadTime: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qtd Mínima Compra</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.minPurchaseQuantity}
                              onChange={(e) => setFormData({...formData, minPurchaseQuantity: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Compra</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('purchase_unit');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.purchaseUnit}
                              onChange={(e) => setFormData({...formData, purchaseUnit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'purchase_unit')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </section>

                      {/* Conversão de Unidades */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ArrowRight size={16} /> Conversão de Unidades
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Consumo</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('consumption_unit');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.consumptionUnit}
                              onChange={(e) => setFormData({...formData, consumptionUnit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'consumption_unit')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fator de Conversão</label>
                            <input 
                              type="number" 
                              step="0.0001"
                              value={formData.conversionFactor}
                              onChange={(e) => setFormData({...formData, conversionFactor: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                              placeholder="Ex: 5.5"
                            />
                          </div>
                          <p className="md:col-span-2 text-[10px] text-gray-400 italic">
                            Exemplo: 1 {formData.unit || 'unidade'} = {formData.conversionFactor} {formData.consumptionUnit || 'unidade de consumo'}
                          </p>
                        </div>
                      </section>
                    </>
                  )}

                  {!isMP && (
                    <>
                      {/* Preço e Custo (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <History size={16} /> Preço e Custo
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo de Produção (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.estimatedCost}
                              onChange={(e) => setFormData({...formData, estimatedCost: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço de Venda (R$)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.value}
                              onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Margem (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.margin}
                              onChange={(e) => setFormData({...formData, margin: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Markup (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.markup}
                              onChange={(e) => setFormData({...formData, markup: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>

                      {/* Controle de Estoque (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Box size={16} /> Controle de Estoque
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Atual</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.quantity}
                              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Mínimo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.minStock}
                              onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Máximo</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.maxStock}
                              onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase">Unidade de Medida</label>
                              <button 
                                type="button"
                                onClick={() => {
                                  setQuickAddType('uom');
                                  setIsQuickAddOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <select 
                              value={formData.unit}
                              onChange={(e) => setFormData({...formData, unit: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'uom')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                              {stockConfigItems.filter(i => i.type === 'uom').length === 0 && (
                                <>
                                  <option value="UN">Unidade (UN)</option>
                                  <option value="M2">Metro Quadrado (M2)</option>
                                  <option value="MT">Metro Linear (MT)</option>
                                  <option value="KG">Quilo (KG)</option>
                                  <option value="KIT">Kit (KIT)</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Localização</label>
                            <select 
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                            >
                              <option value="">Selecione...</option>
                              {stockConfigItems
                                .filter(i => i.type === 'location')
                                .map(i => (
                                  <option key={i.id} value={i.name}>{i.name}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </section>

                      {/* Informações Comerciais (PA/Processo) */}
                      <section>
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Plus size={16} /> Informações Comerciais
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comissão (%)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              value={formData.commission}
                              onChange={(e) => setFormData({...formData, commission: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Garantia</label>
                            <input 
                              type="text" 
                              value={formData.warranty}
                              onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo Produção (dias)</label>
                            <input 
                              type="number" 
                              value={formData.productionLeadTime}
                              onChange={(e) => setFormData({...formData, productionLeadTime: Number(e.target.value)})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  {/* Informações Fiscais (Comum) */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Filter size={16} /> Informações Fiscais
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NCM</label>
                        <input 
                          type="text" 
                          value={formData.ncm}
                          onChange={(e) => setFormData({...formData, ncm: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CFOP Padrão</label>
                        <input 
                          type="text" 
                          value={formData.cfop}
                          onChange={(e) => setFormData({...formData, cfop: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                        />
                      </div>
                      {isMP ? (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origem do Produto</label>
                          <select 
                            value={formData.productOrigin}
                            onChange={(e) => setFormData({...formData, productOrigin: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                          >
                            <option value="">Selecione...</option>
                            <option value="0">0 - Nacional</option>
                            <option value="1">1 - Estrangeira (Importação Direta)</option>
                            <option value="2">2 - Estrangeira (Adquirida no Mercado Interno)</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CST/CSOSN</label>
                          <input 
                            type="text" 
                            value={formData.cst_csosn}
                            onChange={(e) => setFormData({...formData, cst_csosn: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Controle do Sistema */}
                  <section>
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar size={16} /> Controle do Sistema
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white text-sm"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Cadastro</label>
                        <input 
                          type="date" 
                          disabled
                          value={formData.entryDate}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm" 
                        />
                      </div>
                      {editingItem && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Última Atualização</label>
                          <input 
                            type="text" 
                            disabled
                            value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString('pt-BR') : '-'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm" 
                          />
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                {editingItem?.type === 'processo' && (
                  <button 
                    type="button"
                    onClick={() => {
                      finalizeProcess(editingItem.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Finalizar Produção
                  </button>
                )}
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                  {editingItem ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Adicionar Opção
              </h3>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Opção</label>
                <input 
                  type="text" 
                  autoFocus
                  value={quickAddName}
                  onChange={(e) => setQuickAddName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" 
                  placeholder="Digite o nome..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleQuickAdd}
                  disabled={!quickAddName}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
