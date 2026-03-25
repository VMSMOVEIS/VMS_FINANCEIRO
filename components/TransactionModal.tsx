import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, FileText, DollarSign, Briefcase, Wallet, Hash, User, Plus, AlertCircle } from 'lucide-react';
import { getAccountPlans, getTransactionTypes, AccountPlan, TransactionType } from '../services/financialData';
import { useTransactions } from '@/src/context/TransactionContext';
import { Transaction, Payment } from '../types';
import { SearchTransactionModal } from './SearchTransactionModal';

export const TransactionModal: React.FC = () => {
  const { 
    isModalOpen, 
    openModal,
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
  const [linkedTransactionIds, setLinkedTransactionIds] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    transactionTypeId: '',
    category: '',
    categoryCode: '',
    documentType: 'NF',
    orderNumber: '',
    customerName: '',
    value: 0,
    payments: []
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalType, setSearchModalType] = useState<'payment_receipt' | 'advance'>('payment_receipt');
  const [searchModalTransactionType, setSearchModalTransactionType] = useState<'income' | 'expense'>('income');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const [targetPaymentId, setTargetPaymentId] = useState<string | null>(null);
  const [targetTransactionId, setTargetTransactionId] = useState<number | null>(null);
  const prevIsModalOpen = useRef(false);
  const hasPreFilled = useRef(false);

  useEffect(() => {
    setTransactionTypes(getTransactionTypes());
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      prevIsModalOpen.current = false;
      hasPreFilled.current = false;
      setError(null);
      return;
    }

    const justOpened = !prevIsModalOpen.current;
    prevIsModalOpen.current = true;

    if (editingTransaction) {
      // If we are pending completion (came from "Recebimento"/"Pagamento" selection),
      // we want to auto-complete the transaction and its payments.
      if (pendingCompletion && !hasPreFilled.current) {
        const completedPayments = editingTransaction.payments?.map(p => {
            // If a specific payment was targeted, only complete that one
            if (targetPaymentId) {
                return p.id === targetPaymentId ? { ...p, status: 'completed' as const } : p;
            }
            // Otherwise complete all (legacy behavior or if no specific target)
            return { ...p, status: 'completed' as const };
        }) || [];

        // Determine overall status
        const allCompleted = completedPayments.every(p => p.status === 'completed');
        
        setFormData({
            ...editingTransaction,
            status: allCompleted ? 'completed' : 'partial',
            payments: completedPayments
        });
        hasPreFilled.current = true;
      } else if (!hasPreFilled.current) {
        setFormData({ ...editingTransaction });
      }
      
      setLinkedTransactionIds([]);

      // If it's a new transaction (no ID) but has a type (e.g. from "Adicionar Conta"), initialize payments if needed
      if (!editingTransaction.id && (editingTransaction.transactionTypeId === 'duplicata_receber' || editingTransaction.transactionTypeId === 'duplicata_pagar')) {
         if (!editingTransaction.payments || editingTransaction.payments.length === 0) {
            const typeId = editingTransaction.transactionTypeId;
            const initialPayments: Payment[] = [{
                id: Date.now().toString(),
                method: 'A Definir',
                value: editingTransaction.value || 0,
                dueDate: editingTransaction.date || new Date().toISOString().split('T')[0],
                destination: typeId === 'duplicata_receber' ? 'Contas a Receber' : 'Contas a Pagar',
                status: 'pending'
            }];
            setFormData(prev => ({ ...prev, payments: initialPayments }));
         }
      }
    } else {
      if (pendingCompletion && targetTransactionId && targetPaymentId && !hasPreFilled.current) {
        // Find the original transaction to get details for the independent launch
        const original = transactions.find(t => t.id === targetTransactionId);
        const payment = original?.payments.find(p => p.id === targetPaymentId);

        if (original && payment) {
          const defaultMethod = paymentMethods.find(pm => pm.type === 'pix');
          const defaultAccount = accounts.find(acc => acc.id === defaultMethod?.defaultAccountId);

          setFormData({
            type: original.type,
            date: new Date().toISOString().split('T')[0],
            transactionTypeId: original.type === 'income' ? 'recebimento' : 'pagamento',
            category: original.category || '',
            documentType: original.documentType,
            orderNumber: original.orderNumber || '',
            customerName: original.customerName || '',
            description: `Recebimento: ${original.description}`,
            value: payment.value,
            linkedTransactionId: original.id,
            linkedPaymentId: payment.id,
            payments: [{
              id: String(Date.now()),
              method: defaultMethod?.name || 'Pix',
              value: payment.value,
              dueDate: new Date().toISOString().split('T')[0],
              destination: defaultAccount?.name || 'Caixa',
              status: 'completed'
            }]
          });
          hasPreFilled.current = true;
          return;
        }
      }

      if (justOpened && !pendingCompletion) {
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
        setLinkedTransactionIds([]);
      }
    }
  }, [editingTransaction, isModalOpen, pendingCompletion, targetTransactionId, targetPaymentId, transactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If date changes, update all payments' due dates to match
      if (name === 'date') {
        newData.payments = prev.payments?.map(p => ({
          ...p,
          dueDate: value
        })) || [];
      }

      // Auto-fill category when code is entered
      if (name === 'categoryCode') {
        const plan = accountPlans.find(p => p.code === value);
        if (plan) {
          newData.category = plan.name;
        }
      }

      // Auto-fill code when category is selected
      if (name === 'category') {
        const plan = accountPlans.find(p => p.name === value);
        if (plan) {
          newData.categoryCode = plan.code;
        }
      }
      
      return newData;
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    setError(null);
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
        type: typeId === 'transferencia' ? 'transfer' : newType,
        category: typeId === 'transferencia' ? 'Transferência' : '',
        payments: initialPayments
      }));

      if (!editingTransaction) {
        if (['pagamento', 'recebimento'].includes(typeId)) {
          setSearchModalType('payment_receipt');
          setSearchModalTransactionType(newType);
          setIsSearchModalOpen(true);
        } else if (['venda', 'compra'].includes(typeId)) {
          setSearchModalType('advance');
          setSearchModalTransactionType(newType);
          setIsSearchModalOpen(true);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, transactionTypeId: typeId }));
    }
  };

  const handleSearchModalSelect = (selected: any) => {
    if (searchModalType === 'payment_receipt') {
        // Single selection for payment/receipt
        // 'selected' is now a SearchableItem which contains originalTransaction and paymentId
        const item = selected;
        if (!item || !item.originalTransaction) return;

        setPendingCompletion(true);
        setTargetPaymentId(item.paymentId); // Set the specific payment to complete
        setTargetTransactionId(item.originalTransaction.id);
        
        // Open modal for a NEW independent transaction
        openModal(); 
        setIsSearchModalOpen(false);
    } else if (searchModalType === 'advance') {
        const selectedTransactions = Array.isArray(selected) ? selected : [selected];
        if (selectedTransactions.length === 0) return;

        const ids = selectedTransactions.map(t => t.id);
        setLinkedTransactionIds(ids);

        const advancePayments: Payment[] = selectedTransactions.map(t => ({
            id: `adv-${t.id}-${Date.now()}`,
            method: 'Adiantamento',
            value: t.value,
            dueDate: formData.date || new Date().toISOString().split('T')[0],
            destination: 'Adiantamento Abatido',
            status: 'completed'
        }));

        // Use the first transaction's details for pre-filling if not already set
        const first = selectedTransactions[0];

        setFormData(prev => ({
            ...prev,
            customerName: first.customerName || prev.customerName,
            orderNumber: first.orderNumber || prev.orderNumber,
            payments: [...(prev.payments || []).filter(p => p.method !== 'Adiantamento'), ...advancePayments]
        }));
        setIsSearchModalOpen(false);
    }
  };

  const addPayment = (amount: number) => {
    const isDuplicata = formData.transactionTypeId === 'duplicata_receber' || formData.transactionTypeId === 'duplicata_pagar';
    const defaultMethod = paymentMethods.find(pm => pm.type === 'pix');
    const defaultAccount = accounts.find(acc => acc.id === defaultMethod?.defaultAccountId);

    const payment: Payment = {
      id: Date.now().toString(),
      method: isDuplicata ? 'A Definir' : (defaultMethod?.name || 'Pix'), 
      value: amount,
      dueDate: formData.date || new Date().toISOString().split('T')[0],
      destination: isDuplicata 
        ? (formData.transactionTypeId === 'duplicata_receber' ? 'Contas a Receber' : 'Contas a Pagar')
        : (defaultAccount?.name || 'Caixa'), 
      status: isDuplicata ? 'pending' : 'completed' 
    };

    setFormData(prev => ({
      ...prev,
      payments: [...(prev.payments || []), payment]
    }));
  };

  const updatePayment = (index: number, field: keyof Payment, value: any) => {
    setError(null);
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
               // If the payment is assigned to a specific account (not "Contas a Pagar/Receber"), 
               // it should be considered completed/realized in that account's ledger.
               // This applies to Credit Cards too (it's a realized debt/expense on the card account).
               const isSpecificAccount = accounts.some(a => a.name === payment.destination);
               
               if (isSpecificAccount) {
                   payment.status = 'completed';
               } else if (['credit_card', 'boleto', 'other'].includes(selectedMethod.type)) {
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
    setError(null);
    
    try {
      // Validate that all payments have a dueDate
      if (formData.payments?.some(p => !p.dueDate)) {
        setError('Todos os pagamentos devem ter uma data de vencimento.');
        setIsSubmitting(false);
        return;
      }

      const allCompleted = formData.payments?.every(p => p.status === 'completed');
      const allPending = formData.payments?.every(p => p.status === 'pending');
      let status: 'completed' | 'pending' | 'partial' | 'a_compensar' = 'partial';
      if (allCompleted) status = 'completed';
      if (allPending) status = 'pending';

      // Force 'a_compensar' status for new advances
      if (isAdvance && !editingTransaction) {
          status = 'a_compensar';
      }

        const transaction: Omit<Transaction, 'id'> = {
          date: formData.date || '',
          description: formData.description || '',
          category: isTransfer ? null : (formData.category || null),
          categoryCode: isTransfer ? null : (formData.categoryCode || null),
          value: Number(formData.value) || 0,
          type: formData.type as 'income' | 'expense' | 'transfer',
          transactionTypeId: formData.transactionTypeId || '',
          documentType: isTransfer ? 'Transferência' : (formData.documentType || 'Outros'),
          orderNumber: isTransfer ? null : (formData.orderNumber || null),
          customerName: isTransfer ? null : (formData.customerName || null),
          payments: formData.payments || [],
          status: status,
          linkedTransactionId: formData.linkedTransactionId,
          linkedPaymentId: formData.linkedPaymentId
        };
      
      if (editingTransaction && editingTransaction.id) {
        await updateTransaction(editingTransaction.id, transaction);
      } else {
        await addTransaction(transaction);
        
        // If this was a payment/receipt or advance for another transaction, settle it
        if (formData.linkedTransactionId && formData.linkedPaymentId) {
            const original = transactions.find(t => t.id === formData.linkedTransactionId);
            if (original) {
                const updatedPayments = original.payments.map(p => 
                    p.id === formData.linkedPaymentId ? { ...p, status: 'completed' as const } : p
                );
                const allCompleted = updatedPayments.every(p => p.status === 'completed');
                await updateTransaction(original.id, {
                    ...original,
                    status: allCompleted ? 'completed' : 'partial',
                    payments: updatedPayments
                });
            }
            // Reset flags
            setPendingCompletion(false);
            setTargetPaymentId(null);
            setTargetTransactionId(null);
        } else if (linkedTransactionIds.length > 0) {
          for (const id of linkedTransactionIds) {
            const original = transactions.find(t => t.id === id);
            if (original) {
              const updatedPayments = original.payments.map(p => ({ ...p, status: 'completed' as const }));
              await updateTransaction(id, { 
                ...original, 
                status: 'completed', 
                payments: updatedPayments 
              });
            }
          }
        }
      }
      // If this is a new transaction, handle separate launches for discounts and surcharges
      if (!editingTransaction && formData.payments) {
        for (const p of formData.payments) {
          if (p.discount && p.discount > 0) {
            const discountTransaction: Omit<Transaction, 'id'> = {
              date: p.dueDate,
              description: `Desconto: ${formData.description}`,
              value: p.discount,
              type: formData.type === 'income' ? 'expense' : 'income',
              transactionTypeId: formData.type === 'income' ? 'pagamento' : 'recebimento',
              category: formData.type === 'income' ? 'Descontos Concedidos' : 'Descontos Obtidos',
              categoryCode: formData.type === 'income' ? '6.2.05' : '4.2.02',
              documentType: 'Outros',
              customerName: formData.customerName,
              payments: [{
                id: String(Date.now() + Math.random()),
                method: p.method,
                value: p.discount,
                dueDate: p.dueDate,
                destination: p.destination,
                status: 'completed'
              }],
              status: 'completed'
            };
            await addTransaction(discountTransaction);
          }
          if (p.surcharge && p.surcharge > 0) {
            const surchargeTransaction: Omit<Transaction, 'id'> = {
              date: p.dueDate,
              description: `Acréscimo/Juros: ${formData.description}`,
              value: p.surcharge,
              type: formData.type === 'income' ? 'income' : 'expense',
              transactionTypeId: formData.type === 'income' ? 'recebimento' : 'pagamento',
              category: formData.type === 'income' ? 'Juros Recebidos' : 'Juros Pagos',
              categoryCode: formData.type === 'income' ? '4.2.03' : '6.3.01',
              documentType: 'Outros',
              customerName: formData.customerName,
              payments: [{
                id: String(Date.now() + Math.random()),
                method: p.method,
                value: p.surcharge,
                dueDate: p.dueDate,
                destination: p.destination,
                status: 'completed'
              }],
              status: 'completed'
            };
            await addTransaction(surchargeTransaction);
          }
        }
      }

      closeModal();
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar transação. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const totalPayments = formData.payments?.reduce((sum, p) => sum + p.value + (p.discount || 0) - (p.surcharge || 0), 0) || 0;
  const remainingValue = (formData.value || 0) - totalPayments;
  const isTransfer = formData.transactionTypeId === 'transferencia';
  const isDuplicata = formData.transactionTypeId?.includes('duplicata');
  const isAdvance = formData.transactionTypeId?.includes('adiantamento');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
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
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Entrada
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
                  Saída
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev, 
                      type: 'transfer',
                      transactionTypeId: 'transferencia',
                      category: 'Transferência',
                      payments: [{
                        id: String(Date.now()),
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Nota">Nota</option>
                      <option value="NF-e">Nota Fiscal (NF-e)</option>
                      <option value="NFC-e">NFC-e</option>
                      <option value="NFS-e">Nota de Serviço (NFS-e)</option>
                      <option value="CT-e">CT-e</option>
                      <option value="MDF-e">MDF-e</option>
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {!isTransfer && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input 
                      type="text"
                      name="categoryCode"
                      value={formData.categoryCode || ''}
                      onChange={handleInputChange}
                      placeholder="Ex: 1.1.01.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Contas (Analítico)</label>
                    <input 
                      list="account-plans-list"
                      name="category"
                      required
                      autoComplete="off"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      placeholder="Digite ou selecione uma categoria..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    />
                    <datalist id="account-plans-list">
                      {accountPlans
                        .filter(acc => {
                          // Only show analytical accounts (level 'analitica' or code parts length === 4)
                          const isAnalytic = acc.level === 'analitica' || acc.code.split('.').length === 4;
                          return isAnalytic;
                        })
                        .map(acc => (
                          <option key={acc.id} value={acc.name}>{acc.code} - {acc.name}</option>
                      ))}
                    </datalist>
                  </div>
                </div>
                
                {formData.category && (() => {
                  const plan = accountPlans.find(p => p.name === formData.category);
                  const isAnalytic = plan?.code.split('.').length === 4;
                  if (plan && !isAnalytic) {
                    return (
                      <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">
                        Atenção: A conta "{plan.name}" é sintética. Por favor, selecione uma conta analítica (ex: {plan.code}.01).
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          {!isTransfer && (
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Adiantamento</label>
               <div className="relative">
                 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="text" 
                   value={(formData.payments?.filter(p => p.method === 'Adiantamento').reduce((sum, p) => sum + p.value, 0) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                   readOnly
                   className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                 />
               </div>
            </div>
          )}

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
                  <Wallet size={18} className="text-blue-600" />
                  Pagamentos / Parcelas
                </h4>
                <div className="text-sm">
                  <span className="text-gray-500">Restante: </span>
                  <span className={`font-bold ${remainingValue !== 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    R$ {remainingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {formData.payments?.map((payment, index) => {
                  if (payment.method === 'Adiantamento') return null;
                  return (
                  <div key={payment.id} className="grid grid-cols-12 gap-2 items-end relative pr-8">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Valor</label>
                      <input
                        type="number"
                        value={payment.value || ''}
                        onChange={(e) => updatePayment(index, 'value', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={(payment.discount || 0) > 0 || (payment.surcharge || 0) > 0}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Desc.</label>
                      <input
                        type="number"
                        value={payment.discount || ''}
                        onChange={(e) => updatePayment(index, 'discount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border rounded bg-green-50"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Acrés.</label>
                      <input
                        type="number"
                        value={payment.surcharge || ''}
                        onChange={(e) => updatePayment(index, 'surcharge', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border rounded bg-red-50"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Forma</label>
                      <select
                        value={payment.method}
                        onChange={(e) => updatePayment(index, 'method', e.target.value)}
                        className="w-full text-xs p-2 border rounded"
                        disabled={isDuplicata}
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

                    <div className="col-span-2">
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

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2">
                      <button 
                        type="button"
                        onClick={() => removePayment(index)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )})}

                {remainingValue > 0 && (
                  <button
                    type="button"
                    onClick={() => addPayment(remainingValue)}
                    className="w-full py-2 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-2"
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        transactionType={searchModalTransactionType}
        onSelect={handleSearchModalSelect}
        onRegisterNew={() => {
          setIsSearchModalOpen(false);
          setLinkedTransactionIds([]);
        }}
      />
    </div>
  );
};
