import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, FileText, DollarSign, Briefcase, Wallet, Hash, User, Plus, AlertCircle, Search } from 'lucide-react';
import { getAccountPlans, getTransactionTypes, AccountPlan, TransactionType } from '../services/financialData';
import { useTransactions } from '@/src/context/TransactionContext';
import { Transaction, Payment, TransactionSplit } from '../types';
import { SearchTransactionModal } from './SearchTransactionModal';
import { ChartOfAccounts } from './ChartOfAccounts';

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
  const [accountingAlerts, setAccountingAlerts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChartOfAccountsOpen, setIsChartOfAccountsOpen] = useState(false);
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

  const isVenda = formData.transactionTypeId === 'venda';
  const isTransfer = formData.transactionTypeId === 'transferencia';
  const isAdvance = formData.transactionTypeId?.includes('adiantamento');
  const isDuplicata = formData.transactionTypeId?.includes('duplicata');
  const isAccountingEnabled = !isTransfer;
  
  const totalPayments = formData.payments?.reduce((sum, p) => sum + p.value + (p.discount || 0) - (p.surcharge || 0), 0) || 0;
  const remainingValue = (formData.value || 0) - totalPayments;
  const debits = formData.multiAccounts?.filter(s => s.type === 'debit').reduce((sum, s) => sum + s.value, 0) || 0;
  const credits = formData.multiAccounts?.filter(s => s.type === 'credit').reduce((sum, s) => sum + s.value, 0) || 0;
  const totalValue = Number(formData.value) || 0;
  const isAccountingBalanced = !isAccountingEnabled || (
    Math.abs(debits - credits) < 0.01 && debits > 0
  );

  useEffect(() => {
    if (!isAccountingEnabled) {
      setAccountingAlerts([]);
      return;
    }

    const alerts: string[] = [];
    const payments = formData.payments || [];
    const splits = formData.multiAccounts || [];

    // Check for Adiantamento
    const adiantamentoValue = payments.filter(p => p.method === 'Adiantamento').reduce((sum, p) => sum + p.value, 0);
    if (adiantamentoValue > 0) {
      if (formData.type === 'income') {
        const hasAdiantamentoDebit = splits.some(s => s.type === 'debit' && (s.accountPlanName?.toLowerCase().includes('adiantamento de clientes') || s.accountPlanCode?.startsWith('2.1.05')));
        if (!hasAdiantamentoDebit) {
          alerts.push(`Sugestão: Você tem R$ ${adiantamentoValue.toLocaleString('pt-BR')} em Adiantamento. Considere debitar a conta "Adiantamento de Clientes".`);
        }
      } else {
        const hasAdiantamentoCredit = splits.some(s => s.type === 'credit' && (s.accountPlanName?.toLowerCase().includes('adiantamento a fornecedores') || s.accountPlanCode?.startsWith('1.1.04.02')));
        if (!hasAdiantamentoCredit) {
          alerts.push(`Sugestão: Você tem R$ ${adiantamentoValue.toLocaleString('pt-BR')} em Adiantamento. Considere creditar a conta "Adiantamento a Fornecedores".`);
        }
      }
    }

    // Special check for Advance creation transactions
    if (formData.transactionTypeId === 'adiantamento_cliente') {
      const hasAdiantamentoCredit = splits.some(s => s.type === 'credit' && (s.accountPlanName?.toLowerCase().includes('adiantamento de clientes') || s.accountPlanCode?.startsWith('2.1.05')));
      if (!hasAdiantamentoCredit) {
        alerts.push(`Atenção: Para Adiantamento de Cliente, considere creditar a conta "Adiantamento de Clientes".`);
      }
    } else if (formData.transactionTypeId === 'adiantamento_fornecedor') {
      const hasAdiantamentoDebit = splits.some(s => s.type === 'debit' && (s.accountPlanName?.toLowerCase().includes('adiantamento a fornecedores') || s.accountPlanCode?.startsWith('1.1.04.02')));
      if (!hasAdiantamentoDebit) {
        alerts.push(`Atenção: Para Adiantamento a Fornecedor, considere debitar a conta "Adiantamento a Fornecedores".`);
      }
    }

    // Check for Dinheiro (Cash) -> Debit/Credit Caixa
    const cashValue = payments.filter(p => p.method === 'Dinheiro' || p.method === 'Espécie').reduce((sum, p) => sum + p.value, 0);
    if (cashValue > 0) {
      const type = formData.type === 'income' ? 'debit' : 'credit';
      const hasCaixaEntry = splits.some(s => s.type === type && (s.accountPlanName?.toLowerCase().includes('caixa') || s.accountPlanCode?.startsWith('1.1.01.01')));
      if (!hasCaixaEntry) {
        alerts.push(`Atenção: Pagamento em Dinheiro detectado. Considere ${type === 'debit' ? 'debitar' : 'creditar'} a conta "Caixa".`);
      }
    }

    // Check for Banco (Bank) -> Debit/Credit Banco
    const bankValue = payments.filter(p => ['Transferência', 'PIX', 'Cartão de Débito'].includes(p.method)).reduce((sum, p) => sum + p.value, 0);
    if (bankValue > 0) {
      const type = formData.type === 'income' ? 'debit' : 'credit';
      const hasBancoEntry = splits.some(s => s.type === type && (s.accountPlanName?.toLowerCase().includes('banco') || s.accountPlanCode?.startsWith('1.1.01.02')));
      if (!hasBancoEntry) {
        alerts.push(`Atenção: Pagamento via Banco/PIX detectado. Considere ${type === 'debit' ? 'debitar' : 'creditar'} a conta "Banco".`);
      }
    }

    // Check for "A Prazo" (Receivables/Payables) -> Debit Clientes / Credit Fornecedores
    const termValue = payments.filter(p => p.method === 'Boleto' || p.method === 'Cartão de Crédito' || p.method === 'Cheque' || p.method === 'A Definir').reduce((sum, p) => sum + p.value, 0);
    if (termValue > 0) {
        if (formData.type === 'income') {
            const hasClientesDebit = splits.some(s => s.type === 'debit' && (s.accountPlanName?.toLowerCase().includes('clientes') || s.accountPlanCode?.startsWith('1.1.02.01')));
            if (!hasClientesDebit) {
                alerts.push(`Atenção: Pagamento a prazo/a definir detectado. Considere debitar a conta "Clientes a Receber".`);
            }
        } else {
            const hasFornecedoresCredit = splits.some(s => s.type === 'credit' && (s.accountPlanName?.toLowerCase().includes('fornecedores') || s.accountPlanCode?.startsWith('2.1.01.01')));
            if (!hasFornecedoresCredit) {
                alerts.push(`Atenção: Pagamento a prazo/a definir detectado. Considere creditar a conta "Fornecedores a Pagar".`);
            }
        }
    }

    // Check for totals balance
    if (Math.abs(debits - credits) > 0.01) {
      alerts.push(`Aviso: O lançamento contábil não está balanceado (Débitos != Créditos).`);
    }

    setAccountingAlerts(alerts);
  }, [formData.payments, formData.multiAccounts, isAccountingEnabled, formData.type, totalValue, debits, credits]);

  const autoFillAccounting = () => {
    if (!isAccountingEnabled) return;
    
    const payments = formData.payments || [];
    const totalValue = Number(formData.value) || 0;
    const newSplits: TransactionSplit[] = [];
    const isIncome = formData.type === 'income';

    // 1. Main Entry (Revenue, Expense, or Liability/Asset for Payments/Receipts)
    let mainAccount = accountPlans.find(acc => acc.name === formData.category);
    let mainDescription = '';
    let mainType: 'debit' | 'credit' = isIncome ? 'credit' : 'debit';

    if (!mainAccount) {
      if (formData.transactionTypeId === 'adiantamento_cliente') {
        mainAccount = accountPlans.find(acc => acc.code === '2.1.05.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('adiantamento de clientes'));
        mainDescription = 'Adiantamento Recebido';
      } else if (formData.transactionTypeId === 'adiantamento_fornecedor') {
        mainAccount = accountPlans.find(acc => acc.code === '1.1.04.02') || accountPlans.find(acc => acc.name.toLowerCase().includes('adiantamento a fornecedores'));
        mainDescription = 'Adiantamento Pago';
      } else if (formData.transactionTypeId === 'pagamento') {
        // Paying a debt: Debit Fornecedores
        mainAccount = accountPlans.find(acc => acc.code === '2.1.01.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('fornecedores'));
        mainDescription = 'Baixa de Fornecedores';
        mainType = 'debit';
      } else if (formData.transactionTypeId === 'recebimento') {
        // Receiving a credit: Credit Clientes
        mainAccount = accountPlans.find(acc => acc.code === '1.1.02.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('clientes'));
        mainDescription = 'Baixa de Clientes';
        mainType = 'credit';
      } else if (formData.transactionTypeId === 'venda') {
        mainAccount = accountPlans.find(acc => acc.code === '4.1.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('venda'));
        mainDescription = 'Receita de Venda';
      } else if (formData.transactionTypeId === 'compra') {
        mainAccount = accountPlans.find(acc => acc.code === '1.1.03') || accountPlans.find(acc => acc.name.toLowerCase().includes('estoque'));
        mainDescription = 'Compra de Mercadoria/Insumo';
      } else {
        mainAccount = isIncome ? 
          (accountPlans.find(acc => acc.code === '4.1.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('venda'))) :
          (accountPlans.find(acc => acc.code === '6.1.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('administrativa')));
        mainDescription = isIncome ? 'Receita de Venda' : 'Despesa Operacional';
      }
    } else {
      mainDescription = formData.description || (isIncome ? 'Receita' : 'Despesa');
    }
    
    newSplits.push({
      accountPlanId: mainAccount?.id || '',
      accountPlanName: mainAccount?.name || '',
      accountPlanCode: mainAccount?.code || '',
      value: totalValue,
      type: mainType,
      description: mainDescription
    });

    // 2. Payment Entries (The other side of the double entry)
    payments.forEach(payment => {
      if (payment.value <= 0) return;

      let paymentAccount: AccountPlan | undefined;
      let paymentDescription = '';
      let paymentType: 'debit' | 'credit' = isIncome ? 'debit' : 'credit';

      // If it's a 'pagamento' or 'recebimento', the payment type logic is inverted relative to the main entry
      if (formData.transactionTypeId === 'pagamento') paymentType = 'credit';
      if (formData.transactionTypeId === 'recebimento') paymentType = 'debit';

      if (payment.method === 'Dinheiro' || payment.method === 'Espécie') {
        paymentAccount = accountPlans.find(acc => acc.code === '1.1.01.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('caixa'));
        paymentDescription = isIncome ? 'Recebimento em Caixa' : 'Pagamento em Caixa';
      } else if (['Transferência', 'PIX', 'Cartão de Débito'].includes(payment.method)) {
        paymentAccount = accountPlans.find(acc => acc.code === '1.1.01.02') || accountPlans.find(acc => acc.name.toLowerCase().includes('banco'));
        paymentDescription = isIncome ? 'Recebimento em Banco' : 'Pagamento em Banco';
      } else if (payment.method === 'Adiantamento') {
        paymentAccount = isIncome ? 
          (accountPlans.find(acc => acc.name.toLowerCase().includes('adiantamento de clientes')) || accountPlans.find(acc => acc.code === '2.1.05.01')) :
          (accountPlans.find(acc => acc.name.toLowerCase().includes('adiantamento a fornecedores')) || accountPlans.find(acc => acc.code === '1.1.04.02'));
        paymentDescription = isIncome ? 'Uso de Adiantamento' : 'Uso de Adiantamento';
      } else {
        // A Definir, Boleto, Cartão de Crédito, etc. -> Clientes or Fornecedores
        paymentAccount = isIncome ?
          (accountPlans.find(acc => acc.code === '1.1.02.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('clientes'))) :
          (accountPlans.find(acc => acc.code === '2.1.01.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('fornecedores')));
        paymentDescription = isIncome ? 'Contas a Receber (Clientes)' : 'Contas a Pagar (Fornecedores)';
      }

      if (paymentAccount) {
        newSplits.push({
          accountPlanId: paymentAccount.id,
          accountPlanName: paymentAccount.name,
          accountPlanCode: paymentAccount.code,
          value: payment.value,
          type: paymentType,
          description: paymentDescription
        });
      }
    });

    // 3. Inventory and COGS (Extra entries for Sales/Purchases)
    if (formData.transactionTypeId === 'venda') {
      const estoqueAcc = accountPlans.find(acc => acc.code === '1.1.03.10') || accountPlans.find(acc => acc.name.toLowerCase().includes('produtos acabados')) || accountPlans.find(acc => acc.code === '1.1.03');
      const cmvAcc = accountPlans.find(acc => acc.code === '5.1.01') || accountPlans.find(acc => acc.name.toLowerCase().includes('mdf')) || accountPlans.find(acc => acc.type === 'despesa' && acc.name.toLowerCase().includes('custo'));

      if (estoqueAcc && cmvAcc) {
        // Suggesting inventory reduction (Credit Inventory, Debit COGS)
        // Value is 0 as we don't know the cost, user must fill
        newSplits.push({
          accountPlanId: cmvAcc.id,
          accountPlanName: cmvAcc.name,
          accountPlanCode: cmvAcc.code,
          value: 0,
          type: 'debit',
          description: 'Custo da Mercadoria Vendida (CMV)'
        });
        newSplits.push({
          accountPlanId: estoqueAcc.id,
          accountPlanName: estoqueAcc.name,
          accountPlanCode: estoqueAcc.code,
          value: 0,
          type: 'credit',
          description: 'Baixa de Estoque'
        });
      }
    }

    setFormData(prev => ({ ...prev, multiAccounts: newSplits }));
  };

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
        payments: initialPayments,
        multiAccounts: typeId === 'venda' ? [
          { accountPlanId: '', value: prev.value || 0, description: '', type: 'debit' },
          { accountPlanId: '', value: prev.value || 0, description: '', type: 'credit' }
        ] : null
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

      // Validate multi-account splits for transactions
      if (isAccountingEnabled) {
        const splits = formData.multiAccounts || [];
        
        if (formData.value > 0 && splits.length === 0) {
          setError('O lançamento contábil é obrigatório. Use o botão "Sugerir Lançamento" para preencher automaticamente.');
          setIsSubmitting(false);
          return;
        }

        if (splits.length > 0) {
          const debits = splits.filter(s => s.type === 'debit').reduce((sum, s) => sum + s.value, 0);
          const credits = splits.filter(s => s.type === 'credit').reduce((sum, s) => sum + s.value, 0);

          // The new rule: Debits must equal Credits. They don't have to match the transaction value.
          if (Math.abs(debits - credits) > 0.01) {
            setError(`O lançamento contábil não está balanceado!\nTotal Débitos: R$ ${debits.toFixed(2)}\nTotal Créditos: R$ ${credits.toFixed(2)}\nDiferença: R$ ${Math.abs(debits - credits).toFixed(2)}`);
            setIsSubmitting(false);
            return;
          }
        }
      }

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
          linkedPaymentId: formData.linkedPaymentId,
          multiAccounts: isAccountingEnabled ? (formData.multiAccounts || []) : null
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

  const addSplit = (type: 'debit' | 'credit') => {
    setFormData(prev => ({
      ...prev,
      multiAccounts: [
        ...(prev.multiAccounts || []),
        { accountPlanId: '', value: 0, description: '', type }
      ]
    }));
  };

  const removeSplit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      multiAccounts: (prev.multiAccounts || []).filter((_, i) => i !== index)
    }));
  };

  const updateSplit = (index: number, field: keyof TransactionSplit, value: any) => {
    setFormData(prev => {
      const updatedSplits = [...(prev.multiAccounts || [])];
      const split = { ...updatedSplits[index], [field]: value };

      if (field === 'accountPlanId') {
        const plan = accountPlans.find(p => p.id === value);
        if (plan && (plan.level === 'analitica' || plan.code.split('.').length === 4)) {
          split.accountPlanName = plan.name;
          split.accountPlanCode = plan.code;
        }
      }

      if (field === 'accountPlanName') {
        const plan = accountPlans.find(p => p.name === value);
        if (plan && (plan.level === 'analitica' || plan.code.split('.').length === 4)) {
          split.accountPlanId = plan.id;
          split.accountPlanCode = plan.code;
          split.accountPlanName = plan.name;
        } else {
          split.accountPlanName = value;
        }
      }

      if (field === 'accountPlanCode') {
        const plan = accountPlans.find(p => p.code === value);
        if (plan && (plan.level === 'analitica' || plan.code.split('.').length === 4)) {
          split.accountPlanId = plan.id;
          split.accountPlanName = plan.name;
          split.accountPlanCode = plan.code;
        }
      }

      updatedSplits[index] = split;
      return { ...prev, multiAccounts: updatedSplits };
    });
  };

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

          {isAccountingEnabled && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600" />
                  Lançamento Contábil (Partidas Dobradas)
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.transactionTypeId) {
                        setError('Por favor, selecione o Tipo de Lançamento antes de prosseguir.');
                        return;
                      }
                      autoFillAccounting();
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100"
                  >
                    <Plus size={12} />
                    Sugerir Lançamento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.transactionTypeId) {
                        setError('Por favor, selecione o Tipo de Lançamento antes de prosseguir.');
                        return;
                      }
                      addSplit('debit');
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"
                  >
                    <Plus size={12} />
                    + Adicionar Conta Débito
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.transactionTypeId) {
                        setError('Por favor, selecione o Tipo de Lançamento antes de prosseguir.');
                        return;
                      }
                      addSplit('credit');
                    }}
                    className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-100"
                  >
                    <Plus size={12} />
                    + Adicionar Conta Crédito
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(formData.multiAccounts || []).map((split, index) => (
                  <div key={index} className={`grid grid-cols-12 gap-3 items-end bg-white p-3 rounded-lg border shadow-sm ${split.type === 'debit' ? 'border-emerald-200' : 'border-red-200'}`}>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipo</label>
                      <div className={`text-[10px] font-bold text-center py-1.5 rounded uppercase ${split.type === 'debit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {split.type === 'debit' ? 'D' : 'C'}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Código</label>
                      <input
                        type="text"
                        value={split.accountPlanCode || ''}
                        onChange={(e) => updateSplit(index, 'accountPlanCode', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="Código"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => setIsChartOfAccountsOpen(true)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                        title="Pesquisar no Plano de Contas"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Conta</label>
                      <input
                        list={`account-plans-splits-${index}`}
                        value={split.accountPlanName || ''}
                        onChange={(e) => {
                          const name = e.target.value;
                          const plan = accountPlans.find(p => p.name === name);
                          if (plan && (plan.level === 'analitica' || plan.code.split('.').length === 4)) {
                            updateSplit(index, 'accountPlanId', plan.id);
                          } else {
                            updateSplit(index, 'accountPlanName', name);
                          }
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite ou selecione..."
                        required
                      />
                      <datalist id={`account-plans-splits-${index}`}>
                        {accountPlans
                          .filter(acc => acc.level === 'analitica' || acc.code.split('.').length === 4)
                          .map(plan => (
                            <option key={plan.id} value={plan.name}>{plan.code} - {plan.name}</option>
                          ))}
                      </datalist>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={split.value || ''}
                        onChange={(e) => updateSplit(index, 'value', Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="0,00"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Obs.</label>
                      <input
                        type="text"
                        value={split.description || ''}
                        onChange={(e) => updateSplit(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeSplit(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {formData.multiAccounts && formData.multiAccounts.length > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Total Débitos</p>
                      <p className="text-sm font-bold text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          formData.multiAccounts.filter(s => s.type === 'debit').reduce((sum, s) => sum + s.value, 0)
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Total Créditos</p>
                      <p className="text-sm font-bold text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          formData.multiAccounts.filter(s => s.type === 'credit').reduce((sum, s) => sum + s.value, 0)
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {accountingAlerts.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {accountingAlerts.map((alert, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                        <div className="w-1 h-1 bg-amber-400 rounded-full" />
                        {alert}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
              disabled={Math.abs(remainingValue) > 0.01 || !isAccountingBalanced || isSubmitting}
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

      {/* Chart of Accounts Modal */}
      {isChartOfAccountsOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Search className="text-blue-600" size={20} />
                Plano de Contas
              </h3>
              <button 
                onClick={() => setIsChartOfAccountsOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChartOfAccounts />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsChartOfAccountsOpen(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all shadow-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
