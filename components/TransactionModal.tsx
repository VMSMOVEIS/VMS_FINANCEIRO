import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, DollarSign, Briefcase, Wallet, Hash, User, Plus } from 'lucide-react';
import { getAccountPlans, getTransactionTypes, AccountPlan, TransactionType } from '../services/financialData';
import { useTransactions } from '../src/context/TransactionContext';
import { Transaction, Payment } from '../types';
import { SearchTransactionModal } from './SearchTransactionModal';

export const TransactionModal: React.FC = () => {
  const { 
    isModalOpen, 
    closeModal, 
    editingTransaction, 
    addTransaction, 
    updateTransaction, 
    transactions,
    accounts, 
    paymentMethods,
    accountPlans
  } = useTransactions();

  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [linkedTransactionId, setLinkedTransactionId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    transactionTypeId: '',
    category: '',
    documentType: 'NF',
    orderNumber: '',
    customerName: '',
    value: 0,
    payments: []
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalType, setSearchModalType] = useState<'payment_receipt' | 'advance'>('payment_receipt');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTransactionTypes(getTransactionTypes());
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({ ...editingTransaction });
      setLinkedTransactionId(null);
    } else {
      setFormData({
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        transactionTypeId: '',
        category: '',
        documentType: 'NF',
        orderNumber: '',
        customerName: '',
        value: 0,
        payments: []
      });
      setLinkedTransactionId(null);
    }
  }, [editingTransaction, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const selectedType = transactionTypes.find(t => t.id === typeId);
    
    if (selectedType) {
      const newType = selectedType.defaultType;
      let initialPayments: Payment[] = [];

      if (typeId === 'duplicata_receber' || typeId === 'duplicata_pagar') {
        initialPayments = [{
          id: Date.now().toString(),
          method: 'A Definir',
          value: formData.value || 0,
          dueDate: formData.date || new Date().toISOString().split('T')[0],
          destination: typeId === 'duplicata_receber' ? 'Contas a Receber' : 'Contas a Pagar',
          status: 'pending'
        }];
      } else if (typeId === 'transferencia') {
        initialPayments = [{
          id: Date.now().toString(),
          method: 'Transferência',
          value: formData.value || 0,
          dueDate: formData.date || new Date().toISOString().split('T')[0],
          source: accounts[0]?.name || '',
          bankId: accounts[0]?.id,
          destination: accounts[1]?.name || '',
          status: 'completed'
        }];
      }

      setFormData(prev => ({
        ...prev,
        transactionTypeId: typeId,
        type: typeId === 'transferencia' ? 'expense' : newType,
        payments: initialPayments
      }));

      if (!editingTransaction) {
        if (['pagamento', 'recebimento'].includes(typeId)) {
          setSearchModalType('payment_receipt');
          setIsSearchModalOpen(true);
        } else if (['venda', 'compra'].includes(typeId)) {
          setSearchModalType('advance');
          setIsSearchModalOpen(true);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, transactionTypeId: typeId }));
    }
  };

  const handleSearchModalSelect = (selectedTransaction: Transaction) => {
    setLinkedTransactionId(selectedTransaction.id);
    if (searchModalType === 'payment_receipt') {
        setFormData(prev => ({
            ...prev,
            description: selectedTransaction.description,
            value: selectedTransaction.value,
            category: selectedTransaction.category,
            documentType: selectedTransaction.documentType,
            customerName: selectedTransaction.customerName,
            orderNumber: selectedTransaction.orderNumber,
        }));
    } else if (searchModalType === 'advance') {
        const advancePayment: Payment = {
            id: `adv-${Date.now()}`,
            method: 'Adiantamento',
            value: selectedTransaction.value,
            dueDate: formData.date || '',
            destination: 'Adiantamento Abatido',
            status: 'completed'
        };

        setFormData(prev => ({
            ...prev,
            payments: [...(prev.payments || []).filter(p => p.method !== 'Adiantamento'), advancePayment]
        }));
    }
    setIsSearchModalOpen(false);
  };

  const addPayment = (amount: number) => {
    const defaultMethod = paymentMethods.find(pm => pm.type === 'pix');
    const defaultAccount = accounts.find(acc => acc.id === defaultMethod?.defaultAccountId);

    const payment: Payment = {
      id: Date.now().toString(),
      method: defaultMethod?.name || 'Pix', 
      value: amount,
      dueDate: formData.date || new Date().toISOString().split('T')[0],
      destination: defaultAccount?.name || 'Caixa', 
      status: 'completed' 
    };

    setFormData(prev => ({
      ...prev,
      payments: [...(prev.payments || []), payment]
    }));
  };

  const updatePayment = (index: number, field: keyof Payment, value: any) => {
    setFormData(prev => {
      const updatedPayments = [...(prev.payments || [])];
      const payment = { ...updatedPayments[index], [field]: value };

      if (field === 'method') {
        if (value === 'A Definir' || value === 'Outros') {
          payment.destination = formData.type === 'income' ? 'Contas a Receber' : 'Contas a Pagar';
          payment.status = 'pending';
        } else {
          const selectedMethod = paymentMethods.find(pm => pm.name === value);
          if (selectedMethod && selectedMethod.defaultAccountId) {
            const account = accounts.find(a => a.id === selectedMethod.defaultAccountId);
            if (account) {
              payment.destination = account.name;
            }
          }
          
          if (selectedMethod) {
               if (['credit_card', 'boleto', 'other'].includes(selectedMethod.type)) {
                   payment.status = 'pending';
               } else {
                   payment.status = 'completed';
               }
          }
        }
      }

      updatedPayments[index] = payment;
      return { ...prev, payments: updatedPayments };
    });
  };

  const removePayment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      payments: (prev.payments || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const allCompleted = formData.payments?.every(p => p.status === 'completed');
      const allPending = formData.payments?.every(p => p.status === 'pending');
      let status: 'completed' | 'pending' | 'partial' = 'partial';
      if (allCompleted) status = 'completed';
      if (allPending) status = 'pending';

      const transaction: Omit<Transaction, 'id'> = {
        date: formData.date || '',
        description: formData.description || '',
        category: isTransfer ? null : (formData.category || null),
        value: Number(formData.value) || 0,
        type: formData.type as 'income' | 'expense',
        transactionTypeId: formData.transactionTypeId || '',
        documentType: isTransfer ? 'Transferência' : (formData.documentType || 'Outros'),
        orderNumber: isTransfer ? null : (formData.orderNumber || null),
        customerName: isTransfer ? null : (formData.customerName || null),
        payments: formData.payments || [],
        status: status
      };
      
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
      } else {
        await addTransaction(transaction);
        
        // If this was a payment/receipt or advance for another transaction, settle it
        if (linkedTransactionId) {
          const original = transactions.find(t => t.id === linkedTransactionId);
          if (original) {
            const updatedPayments = original.payments.map(p => ({ ...p, status: 'completed' as const }));
            await updateTransaction(linkedTransactionId, { 
              ...original, 
              status: 'completed', 
              payments: updatedPayments 
            });
          }
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const totalPayments = formData.payments?.reduce((sum, p) => sum + p.value, 0) || 0;
  const remainingValue = (formData.value || 0) - totalPayments;
  const isTransfer = formData.transactionTypeId === 'transferencia';
  const isDuplicata = formData.transactionTypeId?.includes('duplicata');
  const isAdvance = formData.transactionTypeId?.includes('adiantamento');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lançamento</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                  name="transactionTypeId"
                  required
                  value={formData.transactionTypeId || ''}
                  onChange={handleTypeChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                >
                  <option value="">Selecione...</option>
                  {transactionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Natureza</label>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                    formData.type === 'income' 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    formData.type === 'expense' 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev, 
                      type: 'transfer',
                      transactionTypeId: 'transferencia',
                      payments: [{
                        id: Date.now(),
                        value: prev.value || 0,
                        method: 'Transferência',
                        dueDate: prev.date || new Date().toISOString().split('T')[0],
                        status: 'completed',
                        destination: '',
                        source: ''
                      }]
                    }));
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                    formData.type === 'transfer' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Transferência
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="date" 
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
            {!isTransfer && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc.</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      name="documentType"
                      value={formData.documentType || 'Outros'}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                    >
                      <option value="NF-e">Nota Fiscal (NF-e)</option>
                      <option value="NFS-e">Nota de Serviço (NFS-e)</option>
                      <option value="Recibo">Recibo</option>
                      <option value="Pedido">Pedido de Venda/Compra</option>
                      <option value="Contrato">Contrato</option>
                      <option value="Boleto">Boleto Bancário</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº Pedido {isAdvance ? '(Opcional)' : ''}</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      name="orderNumber"
                      placeholder="Ex: 123"
                      value={formData.orderNumber || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </>
            )}
            {!isTransfer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'income' ? 'Cliente' : 'Fornecedor'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    name="customerName"
                    placeholder={formData.type === 'income' ? 'Nome do Cliente' : 'Nome do Fornecedor'}
                    value={formData.customerName || ''}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input 
              type="text" 
              name="description"
              required
              placeholder="Ex: Venda de Mercadorias para Cliente X"
              value={formData.description || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="number" 
                  name="value"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.value || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData(prev => {
                      const updates: any = { value: val };
                      if (isTransfer && prev.payments && prev.payments.length > 0) {
                        const updatedPayments = [...prev.payments];
                        updatedPayments[0] = { ...updatedPayments[0], value: val };
                        updates.payments = updatedPayments;
                      }
                      return { ...prev, ...updates };
                    });
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {!isTransfer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Contas</label>
                <select 
                  name="category"
                  required
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                >
                  <option value="">Selecione...</option>
                  {accountPlans
                    .filter(acc => acc.type === (formData.type === 'income' ? 'receita' : 'despesa'))
                    .map(acc => (
                      <option key={acc.id} value={acc.name}>{acc.code} - {acc.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isTransfer && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conta Origem</label>
                <select
                  required
                  value={formData.payments?.[0]?.source || ''}
                  onChange={(e) => {
                    const account = accounts.find(acc => acc.name === e.target.value);
                    updatePayment(0, 'source', e.target.value);
                    if (account) updatePayment(0, 'bankId', account.id);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">Selecione...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.name}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conta Destino</label>
                <select
                  required
                  value={formData.payments?.[0]?.destination || ''}
                  onChange={(e) => updatePayment(0, 'destination', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">Selecione...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.name}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!isTransfer ? (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Wallet size={18} className="text-emerald-600" />
                  Pagamentos / Parcelas
                </h4>
                <div className="text-sm">
                  <span className="text-gray-500">Restante: </span>
                  <span className={`font-bold ${remainingValue !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    R$ {remainingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {formData.payments?.map((payment, index) => (
                  <div key={payment.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Valor</label>
                      <input
                        type="number"
                        value={payment.value}
                        onChange={(e) => updatePayment(index, 'value', parseFloat(e.target.value))}
                        className="w-full text-xs p-2 border rounded"
                        readOnly={payment.method === 'Adiantamento'}
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="text-xs text-gray-500 block mb-1">Forma</label>
                      <select
                        value={payment.method}
                        onChange={(e) => updatePayment(index, 'method', e.target.value)}
                        className="w-full text-xs p-2 border rounded"
                        disabled={payment.method === 'Adiantamento' || isDuplicata}
                      >
                        <option value="A Definir">A Definir</option>
                        {paymentMethods.map(pm => {
                          const account = accounts.find(a => a.id === pm.defaultAccountId);
                          return (
                            <option key={pm.id} value={pm.name}>
                              {pm.name} {account ? `(${account.name})` : ''}
                            </option>
                          );
                        })}
                        <option value="Adiantamento">Adiantamento</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Vencimento</label>
                      <input
                        type="date"
                        value={payment.dueDate}
                        onChange={(e) => updatePayment(index, 'dueDate', e.target.value)}
                        className="w-full text-xs p-2 border rounded"
                      />
                    </div>

                    <div className="col-span-4">
                       <label className="text-xs text-gray-500 block mb-1">Destino</label>
                       <select
                         value={payment.destination}
                         onChange={(e) => updatePayment(index, 'destination', e.target.value)}
                         className="w-full text-xs p-2 border rounded"
                         disabled={isDuplicata}
                       >
                         <option value="">Selecione...</option>
                         {accounts.map(acc => (
                           <option key={acc.id} value={acc.name}>{acc.name}</option>
                         ))}
                         <option value="Contas a Receber">Contas a Receber</option>
                         <option value="Contas a Pagar">Contas a Pagar</option>
                         <option value="Fluxo de Caixa">Fluxo de Caixa</option>
                       </select>
                    </div>

                    <div className="col-span-1 flex justify-center pb-1">
                      <button 
                        type="button"
                        onClick={() => removePayment(index)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {remainingValue > 0 && (
                  <button
                    type="button"
                    onClick={() => addPayment(remainingValue)}
                    className="w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Pagamento de R$ {remainingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </button>
                )}
              </div>
            </div>
          ) : null}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={Math.abs(remainingValue) > 0.01 || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {editingTransaction ? 'Salvar Alterações' : 'Salvar Lançamento'}
            </button>
          </div>
        </form>
      </div>

      <SearchTransactionModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        type={searchModalType}
        transactionType={formData.type as 'income' | 'expense'}
        onSelect={handleSearchModalSelect}
        onRegisterNew={() => {
          setIsSearchModalOpen(false);
          setLinkedTransactionId(null);
        }}
      />
    </div>
  );
};
