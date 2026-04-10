import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Percent, 
  Plus, 
  Trash2, 
  Save, 
  Settings2,
  ChevronRight,
  History,
  AlertTriangle,
  Box,
  MapPin,
  Scale,
  ShoppingCart,
  ArrowRightLeft,
  Layers,
  Edit2
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { StockAgingConfig, StockConfigItem } from '../types';

export const ProductionSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aging' | 'stock_config'>('aging');
  const { 
    stockAgingConfigs, addStockAgingConfig, updateStockAgingConfig, deleteStockAgingConfig,
    stockConfigItems, addStockConfigItem, updateStockConfigItem, deleteStockConfigItem
  } = useProduction();
  
  const [showAgingModal, setShowAgingModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const [newAgingConfig, setNewAgingConfig] = useState<Partial<StockAgingConfig>>({
    days: 0,
    discount: 0,
    active: true
  });

  const [newConfigItem, setNewConfigItem] = useState<Partial<StockConfigItem>>({
    name: '',
    type: 'mp_category'
  });

  const [configTypeFilter, setConfigTypeFilter] = useState<StockConfigItem['type']>('mp_category');

  const handleSaveAgingConfig = () => {
    if (newAgingConfig.days !== undefined) {
      if (newAgingConfig.id) {
        updateStockAgingConfig(newAgingConfig as StockAgingConfig);
      } else {
        addStockAgingConfig({
          ...newAgingConfig,
          id: Math.random().toString(36).substr(2, 9)
        } as StockAgingConfig);
      }
      setShowAgingModal(false);
      setNewAgingConfig({ days: 0, discount: 0, active: true });
    }
  };

  const handleSaveConfigItem = () => {
    if (newConfigItem.name) {
      if (newConfigItem.id) {
        updateStockConfigItem(newConfigItem as StockConfigItem);
      } else {
        addStockConfigItem(newConfigItem as Omit<StockConfigItem, 'id'>);
      }
      setShowConfigModal(false);
      setNewConfigItem({ name: '', type: configTypeFilter });
    }
  };

  const configTypes = [
    { id: 'mp_category', label: 'Categoria de MP', icon: <Layers size={18} /> },
    { id: 'location', label: 'Localização', icon: <MapPin size={18} /> },
    { id: 'uom', label: 'Unidade de Medida', icon: <Scale size={18} /> },
    { id: 'purchase_unit', label: 'Unidade de Compra', icon: <ShoppingCart size={18} /> },
    { id: 'consumption_unit', label: 'Unidade de Consumo', icon: <ArrowRightLeft size={18} /> },
    { id: 'pa_category', label: 'Categoria PA/Processo', icon: <Package size={18} /> },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings2 className="text-orange-600" size={28} />
          Configurações de Produção
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie regras de estoque, envelhecimento e parâmetros de fabricação</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('aging')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === 'aging' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <History size={18} />
              <span className="font-medium">Envelhecimento</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'aging' ? 'opacity-100' : 'opacity-0'} />
          </button>

          <button
            onClick={() => setActiveTab('stock_config')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === 'stock_config' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Box size={18} />
              <span className="font-medium">Configuração de Estoque</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'stock_config' ? 'opacity-100' : 'opacity-0'} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'aging' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-900">Envelhecimento de Estoque</h3>
                  <p className="text-xs text-gray-500">Defina descontos automáticos baseados no tempo de permanência no estoque</p>
                </div>
                <button 
                  onClick={() => {
                    setNewAgingConfig({ days: 0, discount: 0, active: true });
                    setShowAgingModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors"
                >
                  <Plus size={16} /> Nova Regra
                </button>
              </div>
              <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Como funciona:</strong> O sistema calcula o tempo desde a entrada do produto no estoque. 
                  Ao atingir os dias configurados, o desconto é sugerido ou aplicado automaticamente.
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {stockAgingConfigs.map(config => (
                  <div key={config.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Acima de {config.days} dias</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {config.active ? 'ATIVO' : 'INATIVO'}
                          </span>
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            {config.discount}% DE DESCONTO
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setNewAgingConfig(config);
                          setShowAgingModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => deleteStockAgingConfig(config.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {stockAgingConfigs.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Nenhuma regra de envelhecimento configurada.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stock_config' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sub-tabs Vertical */}
              <div className="w-full md:w-64 space-y-1">
                <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-wider">Parâmetros</p>
                  {configTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setConfigTypeFilter(type.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        configTypeFilter === type.id
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={configTypeFilter === type.id ? 'text-white' : 'text-gray-400'}>
                          {type.icon}
                        </span>
                        {type.label}
                      </div>
                      {configTypeFilter === type.id && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* List Area */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {configTypes.find(t => t.id === configTypeFilter)?.label}
                      </h3>
                      <p className="text-xs text-gray-500">Gerencie as opções disponíveis nos formulários</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNewConfigItem({ name: '', type: configTypeFilter });
                        setShowConfigModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shrink-0"
                    >
                      <Plus size={16} /> Adicionar
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                    {stockConfigItems.filter(item => item.type === configTypeFilter).map(item => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setNewConfigItem(item);
                              setShowConfigModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteStockConfigItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {stockConfigItems.filter(item => item.type === configTypeFilter).length === 0 && (
                      <div className="p-12 text-center text-gray-400">
                        <Box size={48} className="mx-auto mb-4 opacity-10" />
                        <p>Nenhum item cadastrado para esta categoria.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aging Modal */}
      {showAgingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {newAgingConfig.id ? 'Editar Regra' : 'Nova Regra de Envelhecimento'}
              </h2>
              <button onClick={() => setShowAgingModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo de Estoque (Dias)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Ex: 90"
                    value={newAgingConfig.days}
                    onChange={(e) => setNewAgingConfig({...newAgingConfig, days: Number(e.target.value)})}
                  />
                  <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desconto a Aplicar (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="0"
                    value={newAgingConfig.discount}
                    onChange={(e) => setNewAgingConfig({...newAgingConfig, discount: Number(e.target.value)})}
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active-aging"
                  checked={newAgingConfig.active}
                  onChange={(e) => setNewAgingConfig({...newAgingConfig, active: e.target.checked})}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="active-aging" className="text-sm font-medium text-gray-700">Regra ativa</label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowAgingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveAgingConfig}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
              >
                Salvar Regra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Item Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {newConfigItem.id ? 'Editar Item' : 'Novo Item de Configuração'}
              </h2>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Descrição</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Ex: MDF, Almoxarifado, UN..."
                  value={newConfigItem.name}
                  onChange={(e) => setNewConfigItem({...newConfigItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  value={newConfigItem.type}
                  onChange={(e) => setNewConfigItem({...newConfigItem, type: e.target.value as any})}
                >
                  {configTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveConfigItem}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
              >
                Salvar Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
