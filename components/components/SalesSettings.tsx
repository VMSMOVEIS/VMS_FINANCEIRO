import React, { useState } from 'react';
import { 
  CreditCard, 
  Percent, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Settings2,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useSales } from '../src/context/SalesContext';
import { SalesPaymentMethod } from '../types';

export const SalesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'discounts'>('payments');
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, isLoading } = useSales();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<SalesPaymentMethod>>({
    name: '',
    discount: 0,
    active: true
  });

  const handleSaveMethod = () => {
    if (newMethod.name) {
      if (newMethod.id) {
        updatePaymentMethod(newMethod as SalesPaymentMethod);
      } else {
        addPaymentMethod({
          ...newMethod,
          id: Math.random().toString(36).substr(2, 9)
        } as SalesPaymentMethod);
      }
      setShowAddModal(false);
      setNewMethod({ name: '', discount: 0, active: true });
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings2 className="text-emerald-600" size={28} />
          Configurações de Vendas
          {isLoading && <Clock className="animate-spin text-blue-500" size={20} />}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie formas de pagamento, descontos e regras comerciais</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === 'payments' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard size={18} />
              <span className="font-medium">Formas de Pagamento</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'payments' ? 'opacity-100' : 'opacity-0'} />
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === 'discounts' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Percent size={18} />
              <span className="font-medium">Descontos Automáticos</span>
            </div>
            <ChevronRight size={16} className={activeTab === 'discounts' ? 'opacity-100' : 'opacity-0'} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-900">Formas de Pagamento</h3>
                  <p className="text-xs text-gray-500">Configure as opções disponíveis no PDV e seus respectivos descontos</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {paymentMethods.map(method => (
                  <div key={method.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{method.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${method.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {method.active ? 'ATIVO' : 'INATIVO'}
                          </span>
                          {method.discount > 0 && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                              {method.discount}% DE DESCONTO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setNewMethod(method);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => deletePaymentMethod(method.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discounts' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Descontos por Forma de Pagamento</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Os descontos são configurados diretamente em cada forma de pagamento. 
                Vá na aba "Formas de Pagamento" para definir as porcentagens.
              </p>
              <button 
                onClick={() => setActiveTab('payments')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
              >
                Configurar Agora
              </button>
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
                {newMethod.id ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Forma de Pagamento</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Pix, Dinheiro, Cartão..."
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desconto Automático (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0"
                    value={newMethod.discount}
                    onChange={(e) => setNewMethod({...newMethod, discount: Number(e.target.value)})}
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Este desconto será aplicado automaticamente no PDV ao selecionar esta forma.</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  checked={newMethod.active}
                  onChange={(e) => setNewMethod({...newMethod, active: e.target.checked})}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Forma de pagamento ativa</label>
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
                onClick={handleSaveMethod}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
