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
  AlertTriangle
} from 'lucide-react';
import { useProduction } from '../src/context/ProductionContext';
import { StockAgingConfig } from '../types';

export const ProductionSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aging' | 'general'>('aging');
  const { stockAgingConfigs, addStockAgingConfig, updateStockAgingConfig, deleteStockAgingConfig } = useProduction();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConfig, setNewConfig] = useState<Partial<StockAgingConfig>>({
    days: 0,
    discount: 0,
    active: true
  });

  const handleSaveConfig = () => {
    if (newConfig.days !== undefined) {
      if (newConfig.id) {
        updateStockAgingConfig(newConfig as StockAgingConfig);
      } else {
        addStockAgingConfig({
          ...newConfig,
          id: Math.random().toString(36).substr(2, 9)
        } as StockAgingConfig);
      }
      setShowAddModal(false);
      setNewConfig({ days: 0, discount: 0, active: true });
    }
  };

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
              <span className="font-medium">Configuração de Estoque</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'aging' ? 'opacity-100' : 'opacity-0'} />
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === 'general' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings2 size={18} />
              <span className="font-medium">Geral</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'general' ? 'opacity-100' : 'opacity-0'} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'aging' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-900">Envelhecimento de Estoque</h3>
                  <p className="text-xs text-gray-500">Defina descontos automáticos baseados no tempo de permanência no estoque PA</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors"
                >
                  <Plus size={16} /> Nova Regra
                </button>
              </div>
              <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Como funciona:</strong> O sistema calcula o tempo desde a entrada do produto no Estoque PA. 
                  Ao atingir os dias configurados, o desconto é sugerido ou aplicado automaticamente no catálogo e PDV.
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
                          setNewConfig(config);
                          setShowAddModal(true);
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

          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Settings2 size={48} className="mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Configurações Gerais</h3>
              <p className="text-gray-500">Outras configurações de produção estarão disponíveis em breve.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {newConfig.id ? 'Editar Regra' : 'Nova Regra de Envelhecimento'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
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
                    value={newConfig.days}
                    onChange={(e) => setNewConfig({...newConfig, days: Number(e.target.value)})}
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
                    value={newConfig.discount}
                    onChange={(e) => setNewConfig({...newConfig, discount: Number(e.target.value)})}
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active-aging"
                  checked={newConfig.active}
                  onChange={(e) => setNewConfig({...newConfig, active: e.target.checked})}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="active-aging" className="text-sm font-medium text-gray-700">Regra ativa</label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveConfig}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
              >
                Salvar Regra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
