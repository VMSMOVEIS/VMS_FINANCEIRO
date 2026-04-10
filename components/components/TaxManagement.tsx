import React, { useState } from 'react';
import { FileText, Calendar, AlertTriangle, Plus, Info, Trash2, CheckCircle, X, Calculator } from 'lucide-react';
import { useTransactions } from '../src/context/TransactionContext';
import { Tax } from '../types';

export const TaxManagement: React.FC = () => {
  const { taxes, addTax, updateTax, deleteTax, generateAnnualTaxes } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  
  const [newTax, setNewTax] = useState<Omit<Tax, 'id'>>({
    name: '',
    type: 'das',
    competence: '',
    dueDate: '',
    value: 0,
    status: 'pending',
    description: ''
  });

  const [annualForm, setAnnualForm] = useState({
    year: new Date().getFullYear(),
    totalValue: 0,
    type: 'das' as Tax['type'],
    name: 'DAS - Simples Nacional'
  });

  const handleAddTax = async () => {
    if (!newTax.name || !newTax.competence || !newTax.dueDate || newTax.value <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    await addTax(newTax);
    setIsAddModalOpen(false);
    setNewTax({
      name: '',
      type: 'das',
      competence: '',
      dueDate: '',
      value: 0,
      status: 'pending',
      description: ''
    });
  };

  const handleAnnualSubmit = async () => {
    if (annualForm.totalValue <= 0 || !annualForm.name) {
      alert('Por favor, preencha o valor total e o nome do tributo.');
      return;
    }
    await generateAnnualTaxes(annualForm.year, annualForm.totalValue, annualForm.type, annualForm.name);
    setIsAnnualModalOpen(false);
  };

  const getStatusColor = (status: Tax['status']) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fiscal & Tributário</h1>
          <p className="text-gray-500">Gestão de impostos e obrigações acessórias</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAnnualModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Calculator size={18} />
            Cobrança Anual
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Gerar Guia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vencimentos Próximos</p>
              <p className="text-lg font-bold text-gray-900">
                {taxes.filter(t => t.status !== 'paid').length} Guias
              </p>
            </div>
          </div>
          <div className="text-xs text-red-500 font-medium">
            {taxes.some(t => t.status === 'overdue') ? 'Existem guias em atraso!' : 'Nenhuma guia em atraso'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pendente</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(taxes.filter(t => t.status !== 'paid').reduce((acc, t) => acc + t.value, 0))}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Total de {taxes.length} guias registradas</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Competência Atual</p>
              <p className="text-lg font-bold text-gray-900">
                {new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date())}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Fechamento mensal em andamento</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Obrigações Fiscais</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Tributo</th>
                <th className="px-6 py-3">Competência</th>
                <th className="px-6 py-3">Vencimento</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taxes.length > 0 ? (
                taxes.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400 uppercase">{item.type}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.competence}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(item.value)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status === 'paid' ? 'Pago' : item.status === 'pending' ? 'Pendente' : 'Atrasado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {item.status !== 'paid' && (
                          <button 
                            onClick={() => updateTax(item.id, { status: 'paid' })}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Marcar como Pago"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedTax(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver Detalhes"
                        >
                          <Info size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Deseja excluir esta guia?')) deleteTax(item.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Nenhuma obrigação fiscal registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Adicionar Guia */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Nova Guia de Imposto</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Tributo</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newTax.name}
                  onChange={e => setNewTax({...newTax, name: e.target.value})}
                  placeholder="Ex: DAS - Simples Nacional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTax.type}
                    onChange={e => setNewTax({...newTax, type: e.target.value as Tax['type']})}
                  >
                    <option value="das">DAS</option>
                    <option value="iss">ISS</option>
                    <option value="icms">ICMS</option>
                    <option value="inss">INSS</option>
                    <option value="fgts">FGTS</option>
                    <option value="pis">PIS</option>
                    <option value="cofins">COFINS</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competência</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTax.competence}
                    onChange={e => setNewTax({...newTax, competence: e.target.value})}
                    placeholder="MM/AAAA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                  <input 
                    type="date"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTax.dueDate}
                    onChange={e => setNewTax({...newTax, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTax.value || ''}
                    onChange={e => setNewTax({...newTax, value: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20"
                  value={newTax.description}
                  onChange={e => setNewTax({...newTax, description: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddTax}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Salvar Guia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cobrança Anual */}
      {isAnnualModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Registrar Cobrança Anual</h3>
              <button onClick={() => setIsAnnualModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Insira o valor total anual e o sistema distribuirá igualmente entre os 12 meses do ano selecionado.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Tributo</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={annualForm.name}
                  onChange={e => setAnnualForm({...annualForm, name: e.target.value})}
                  placeholder="Ex: Taxa de Alvará Anual"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={annualForm.year}
                    onChange={e => setAnnualForm({...annualForm, year: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={annualForm.type}
                    onChange={e => setAnnualForm({...annualForm, type: e.target.value as Tax['type']})}
                  >
                    <option value="das">DAS</option>
                    <option value="iss">ISS</option>
                    <option value="icms">ICMS</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total do Ano</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">R$</span>
                  <input 
                    type="number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={annualForm.totalValue || ''}
                    onChange={e => setAnnualForm({...annualForm, totalValue: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Serão geradas 12 guias de {formatCurrency(annualForm.totalValue / 12)} cada.
                </p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsAnnualModalOpen(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAnnualSubmit}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Distribuir Valor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Guia */}
      {selectedTax && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Detalhes da Obrigação</h3>
              <button onClick={() => setSelectedTax(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedTax.name}</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">{selectedTax.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedTax.status)}`}>
                  {selectedTax.status === 'paid' ? 'PAGO' : selectedTax.status === 'pending' ? 'PENDENTE' : 'ATRASADO'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Competência</p>
                  <p className="text-lg font-medium text-gray-800">{selectedTax.competence}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Vencimento</p>
                  <p className="text-lg font-medium text-gray-800">
                    {new Date(selectedTax.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Valor Original</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedTax.value)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Multas/Juros</p>
                  <p className="text-lg font-medium text-red-500">R$ 0,00</p>
                </div>
              </div>

              {selectedTax.description && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Observações</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                    "{selectedTax.description}"
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                {selectedTax.status !== 'paid' && (
                  <button 
                    onClick={() => {
                      updateTax(selectedTax.id, { status: 'paid' });
                      setSelectedTax(null);
                    }}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    Confirmar Pagamento
                  </button>
                )}
                <button 
                  onClick={() => setSelectedTax(null)}
                  className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
