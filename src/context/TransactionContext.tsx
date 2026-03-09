import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Account, PaymentMethod, UserProfile, CompanyProfile, Payment, NotificationSettings, Tax, Employee } from '../../types';
import { supabase } from '../lib/supabase';
import { AccountPlan, defaultAccountPlans } from '../../services/financialData';

interface TransactionContextType {
  transactions: Transaction[];
  accounts: Account[];
  accountsWithBalances: (Account & { currentBalance: number })[];
  paymentMethods: PaymentMethod[];
  accountPlans: AccountPlan[];
  userProfile: UserProfile;
  companyProfile: CompanyProfile;
  notificationSettings: NotificationSettings;
  isModalOpen: boolean;
  editingTransaction: Transaction | null;
  isLoading: boolean;
  openModal: (transaction?: Transaction) => void;
  closeModal: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  addAccountPlan: (plan: Omit<AccountPlan, 'id'>) => Promise<void>;
  updateAccountPlan: (id: string, plan: Partial<AccountPlan>) => Promise<void>;
  deleteAccountPlan: (id: string) => Promise<void>;
  resetAccountPlans: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  taxes: Tax[];
  addTax: (tax: Omit<Tax, 'id'>) => Promise<void>;
  updateTax: (id: string, tax: Partial<Tax>) => Promise<void>;
  deleteTax: (id: string) => Promise<void>;
  generateAnnualTaxes: (year: number, totalValue: number, taxType: Tax['type'], name: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vms_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Ricardo Silva',
      email: 'ricardo.silva@empresa.com.br',
      role: 'Gerente Financeiro',
      phone: '(11) 99999-9999',
      avatar: 'RS'
    };
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('vms_company_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Móveis & Design Ltda.',
      cnpj: '12.345.678/0001-90',
      email: 'contato@moveisedesign.com.br',
      phone: '(11) 3333-4444',
      address: 'Av. Paulista, 1000 - São Paulo, SP'
    };
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('vms_notification_settings');
    return saved ? JSON.parse(saved) : {
      dueDateAlert: true,
      alertDaysBefore: 3,
      emailAlerts: true
    };
  });

  const [taxes, setTaxes] = useState<Tax[]>(() => {
    const saved = localStorage.getItem('vms_taxes');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'DAS - Simples Nacional', type: 'das', competence: '01/2026', dueDate: '2026-02-20', value: 12500, status: 'paid' },
      { id: '2', name: 'FGTS', type: 'fgts', competence: '01/2026', dueDate: '2026-02-07', value: 4200, status: 'paid' },
      { id: '3', name: 'INSS', type: 'inss', competence: '01/2026', dueDate: '2026-02-20', value: 8900, status: 'pending' },
      { id: '4', name: 'ISSQN', type: 'iss', competence: '01/2026', dueDate: '2026-02-15', value: 1500, status: 'overdue' },
    ];
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('vms_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('vms_company_profile', JSON.stringify(companyProfile));
  }, [companyProfile]);

  useEffect(() => {
    localStorage.setItem('vms_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('vms_taxes', JSON.stringify(taxes));
  }, [taxes]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [accountPlans, setAccountPlans] = useState<AccountPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*');
      if (accountsError) throw accountsError;
      setAccounts(accountsData.map(a => ({
        id: a.id,
        name: a.name,
        bank: a.bank,
        accountNumber: a.account_number,
        type: a.type,
        balance: Number(a.balance),
        color: a.color
      })));

      // Fetch Payment Methods
      const { data: pmData, error: pmError } = await supabase
        .from('payment_methods')
        .select('*');
      if (pmError) throw pmError;
      setPaymentMethods(pmData.map(pm => ({
        id: pm.id,
        name: pm.name,
        type: pm.type,
        defaultAccountId: pm.default_account_id
      })));

      // Fetch Account Plans
      const { data: plansData, error: plansError } = await supabase
        .from('account_plans')
        .select('*');
      if (plansError) throw plansError;
      setAccountPlans(plansData.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        type: p.type as any
      })));

      // Fetch Transactions with Payments
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select(`
          *,
          payments (*)
        `)
        .order('date', { ascending: false });
      
      if (transError) throw transError;
      
      setTransactions(transData.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        category: t.category,
        value: Number(t.value),
        type: t.transaction_type_id === 'transferencia' ? 'transfer' : t.type,
        transactionTypeId: t.transaction_type_id,
        documentType: t.document_type,
        orderNumber: t.order_number,
        customerName: t.customer_name,
        status: t.status,
        payments: t.payments.map((p: any) => ({
          id: p.id,
          method: p.method,
          value: Number(p.value),
          dueDate: p.due_date,
          bankId: p.bank_id,
          destination: p.destination,
          source: p.source,
          status: p.status,
          reconciled: p.reconciled || false
        }))
      })));

    } catch (error: any) {
      console.error('Error fetching data from Supabase:', error);
      if (error.message === 'Failed to fetch' || error.message?.includes('TypeError')) {
        alert('Erro de conexão com o Supabase. Verifique se a URL no Vercel está correta e se o projeto não está pausado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
    } else {
      setEditingTransaction(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!supabase) return;
    try {
      // Auto-create account plan if category is new
      if (transaction.category) {
        await ensureAccountPlanExists(transaction.category, transaction.type);
      }

      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert([{
          date: transaction.date,
          description: transaction.description,
          category: transaction.category,
          value: transaction.value,
          type: transaction.type === 'transfer' ? 'expense' : transaction.type,
          transaction_type_id: transaction.transactionTypeId,
          document_type: transaction.documentType,
          order_number: transaction.orderNumber,
          customer_name: transaction.customerName,
          status: transaction.status
        }])
        .select()
        .single();

      if (transError) throw transError;

      if (transaction.payments && transaction.payments.length > 0) {
        const { error: payError } = await supabase
          .from('payments')
          .insert(transaction.payments.map(p => ({
            transaction_id: transData.id,
            method: p.method,
            value: p.value,
            due_date: p.dueDate,
            bank_id: p.bankId,
            destination: p.destination,
            source: p.source,
            status: p.status,
            reconciled: p.reconciled || false
          })));
        
        if (payError) throw payError;
      }

      await fetchData();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      alert(`Erro ao salvar lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const updateTransaction = async (id: number, updatedTransaction: Partial<Transaction>) => {
    if (!supabase) return;
    try {
      // 1. Update the transaction record
      const { error: transError } = await supabase
        .from('transactions')
        .update({
          date: updatedTransaction.date,
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          value: updatedTransaction.value,
          type: updatedTransaction.type === 'transfer' ? 'expense' : updatedTransaction.type,
          transaction_type_id: updatedTransaction.transactionTypeId,
          document_type: updatedTransaction.documentType,
          order_number: updatedTransaction.orderNumber,
          customer_name: updatedTransaction.customerName,
          status: updatedTransaction.status
        })
        .eq('id', id);

      if (transError) throw transError;

      // 2. Update payments: Delete existing and insert new ones
      // This is the most reliable way to sync a list of related items
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('transaction_id', id);
      
      if (deleteError) throw deleteError;

      if (updatedTransaction.payments && updatedTransaction.payments.length > 0) {
        const { error: insertError } = await supabase
          .from('payments')
          .insert(updatedTransaction.payments.map(p => ({
            transaction_id: id,
            method: p.method,
            value: p.value,
            due_date: p.dueDate,
            bank_id: p.bankId,
            destination: p.destination,
            source: p.source,
            status: p.status,
            reconciled: p.reconciled || false
          })));
        
        if (insertError) throw insertError;
      }

      await fetchData();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      alert(`Erro ao atualizar lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const deleteTransaction = async (id: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      alert(`Erro ao excluir lançamento: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    if (!supabase) return;
    try {
      // Auto-create account plan for the bank account
      await ensureAccountPlanExists(account.name, 'transfer');

      const { error } = await supabase
        .from('accounts')
        .insert([{
          name: account.name,
          bank: account.bank,
          account_number: account.accountNumber,
          type: account.type,
          balance: account.balance,
          color: account.color
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      console.error('Error adding account:', error);
      alert(`Erro ao adicionar conta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const updateAccount = async (id: string, updatedAccount: Partial<Account>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('accounts')
        .update({
          name: updatedAccount.name,
          bank: updatedAccount.bank,
          account_number: updatedAccount.accountNumber,
          type: updatedAccount.type,
          balance: updatedAccount.balance,
          color: updatedAccount.color
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          name: method.name,
          type: method.type,
          default_account_id: method.defaultAccountId
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const updatePaymentMethod = async (id: string, updatedMethod: Partial<PaymentMethod>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          name: updatedMethod.name,
          type: updatedMethod.type,
          default_account_id: updatedMethod.defaultAccountId
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const addAccountPlan = async (plan: Omit<AccountPlan, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .insert([{
          code: plan.code,
          name: plan.name,
          type: plan.type
        }]);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding account plan:', error);
    }
  };

  const updateAccountPlan = async (id: string, plan: Partial<AccountPlan>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .update({
          code: plan.code,
          name: plan.name,
          type: plan.type
        })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating account plan:', error);
    }
  };

  const deleteAccountPlan = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('account_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting account plan:', error);
    }
  };

  const resetAccountPlans = async () => {
    if (!supabase) return;
    if (!confirm('Isso irá remover TODOS os planos de contas atuais e restaurar o padrão profissional. Deseja continuar?')) return;
    
    try {
      setIsLoading(true);
      // 1. Delete all existing plans
      const { error: deleteError } = await supabase
        .from('account_plans')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) throw deleteError;

      // 2. Insert defaults
      const { error: insertError } = await supabase
        .from('account_plans')
        .insert(defaultAccountPlans);
      
      if (insertError) throw insertError;

      await fetchData();
      alert('Plano de contas profissional restaurado com sucesso!');
    } catch (error: any) {
      console.error('Error resetting account plans:', error);
      alert(`Erro ao restaurar plano de contas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const autoCategorize = (name: string, type: 'income' | 'expense' | 'transfer'): { parentCode: string, accountType: 'ativo' | 'passivo' | 'receita' | 'despesa' } => {
    const n = name.toLowerCase();
    
    // Liabilities (Passivos)
    if (n.includes('empréstimo') || n.includes('financiamento')) return { parentCode: '2.1.04', accountType: 'passivo' };
    if (n.includes('fornecedor') || n.includes('pagar') || n.includes('duplicata')) {
      if (n.includes('mdf')) return { parentCode: '2.1.01.01', accountType: 'passivo' };
      if (n.includes('ferragem')) return { parentCode: '2.1.01.02', accountType: 'passivo' };
      if (n.includes('ferramenta')) return { parentCode: '2.1.01.03', accountType: 'passivo' };
      return { parentCode: '2.1.01', accountType: 'passivo' };
    }
    if (n.includes('trabalhista') || n.includes('fgts') || n.includes('inss') || n.includes('salário') || n.includes('folha') || n.includes('férias') || n.includes('13º')) return { parentCode: '2.1.02', accountType: 'passivo' };
    if (n.includes('imposto') || n.includes('tributo') || n.includes('recolher') || n.includes('icms') || n.includes('iss') || n.includes('simples') || n.includes('pis') || n.includes('cofins')) return { parentCode: '2.1.03', accountType: 'passivo' };
    
    // Assets (Ativos)
    if (n.includes('máquina') || n.includes('veículo') || n.includes('imóvel') || n.includes('equipamento') || n.includes('imobilizado') || n.includes('computador') || n.includes('ferramenta') || n.includes('esquadrejadeira') || n.includes('furadeira') || n.includes('coladeira')) return { parentCode: '1.2.01', accountType: 'ativo' };
    if (n.includes('depreciação')) return { parentCode: '1.2.02', accountType: 'ativo' };
    if (n.includes('receber') || n.includes('cliente') || n.includes('duplicata') || n.includes('cheque') || n.includes('cartão')) return { parentCode: '1.1.02', accountType: 'ativo' };
    if (n.includes('estoque') || n.includes('mdf') || n.includes('ferragem') || n.includes('parafuso') || n.includes('puxador') || n.includes('corrediça') || n.includes('dobradiça') || n.includes('cola') || n.includes('acabamento')) return { parentCode: '1.1.03', accountType: 'ativo' };
    if (n.includes('caixa') || n.includes('banco') || n.includes('pix') || n.includes('dinheiro') || n.includes('itau') || n.includes('bradesco') || n.includes('nubank') || n.includes('santander') || n.includes('inter') || n.includes('safra')) return { parentCode: '1.1.01', accountType: 'ativo' };
    if (n.includes('adiantamento') || n.includes('recuperar')) return { parentCode: '1.1.04', accountType: 'ativo' };

    // Equity (PL)
    if (n.includes('capital') || n.includes('sócio') || n.includes('quotista')) return { parentCode: '3.1', accountType: 'passivo' };
    if (n.includes('reserva') || n.includes('lucro') || n.includes('prejuízo')) return { parentCode: '3.2', accountType: 'passivo' };

    // Revenues (Receitas)
    if (type === 'income') {
      if (n.includes('venda') || n.includes('móvel') || n.includes('serviço') || n.includes('montagem') || n.includes('instalação')) return { parentCode: '4.1', accountType: 'receita' };
      if (n.includes('sucata') || n.includes('desconto') || n.includes('juros') || n.includes('rendimento') || n.includes('financeira')) return { parentCode: '4.2', accountType: 'receita' };
      return { parentCode: '4.1', accountType: 'receita' };
    }
    
    // Costs and Expenses (Custos e Despesas)
    if (type === 'expense' || type === 'transfer') {
      // Production Costs (5)
      if (n.includes('mdf') || n.includes('ferragem') || n.includes('parafuso') || n.includes('dobradiça') || n.includes('puxador') || n.includes('corrediça') || n.includes('cola') || n.includes('acabamento')) return { parentCode: '5.1', accountType: 'despesa' };
      if (n.includes('produção') && (n.includes('salário') || n.includes('encargo'))) return { parentCode: '5.2', accountType: 'despesa' };
      if (n.includes('energia') && n.includes('produção')) return { parentCode: '5.3.01', accountType: 'despesa' };
      if (n.includes('manutenção') && n.includes('máquina')) return { parentCode: '5.3.02', accountType: 'despesa' };
      if (n.includes('desgaste') || n.includes('consumo')) return { parentCode: '5.3', accountType: 'despesa' };

      // Operational Expenses (6)
      if (n.includes('administrativo') || n.includes('contabilidade') || n.includes('internet') || n.includes('escritório') || n.includes('aluguel')) return { parentCode: '6.1', accountType: 'despesa' };
      if (n.includes('marketing') || n.includes('comissão') || n.includes('venda') || n.includes('frete') || n.includes('combustível') || n.includes('entrega')) return { parentCode: '6.2', accountType: 'despesa' };
      if (n.includes('juros') || n.includes('tarifa') || n.includes('bancária') || n.includes('financeira')) return { parentCode: '6.3', accountType: 'despesa' };
      
      return { parentCode: '6.1', accountType: 'despesa' };
    }
    
    return { parentCode: '6.1', accountType: 'despesa' };
  };

  const generateNextCodeForParent = (parentCode: string) => {
    const children = accountPlans.filter(p => p.code.startsWith(parentCode + '.') && p.code.split('.').length === parentCode.split('.').length + 1);
    if (children.length === 0) return `${parentCode}.01`;
    
    const lastCode = children.map(c => {
      const parts = c.code.split('.');
      return parseInt(parts[parts.length - 1] || '0');
    }).sort((a, b) => b - a)[0];
    
    return `${parentCode}.${(lastCode + 1).toString().padStart(2, '0')}`;
  };

  const ensureAccountPlanExists = async (name: string, type: 'income' | 'expense' | 'transfer') => {
    if (!name || !supabase) return;
    
    const existing = accountPlans.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) return;

    const { parentCode, accountType } = autoCategorize(name, type);
    const nextCode = generateNextCodeForParent(parentCode);
    
    try {
      await supabase
        .from('account_plans')
        .insert([{
          code: nextCode,
          name: name,
          type: accountType
        }]);
      // We don't call fetchData here to avoid multiple reloads if adding many items, 
      // but for single items it's fine.
      await fetchData();
    } catch (error) {
      console.error('Error auto-creating account plan:', error);
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    // In a real app, this would update the 'profiles' table
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const updateCompanyProfile = async (profile: Partial<CompanyProfile>) => {
    // In a real app, this would update the 'companies' table
    setCompanyProfile(prev => ({ ...prev, ...profile }));
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    // In a real app, this would update the 'settings' table
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const addTax = async (tax: Omit<Tax, 'id'>) => {
    const newTax = { ...tax, id: Math.random().toString(36).substr(2, 9) };
    setTaxes(prev => [...prev, newTax]);
  };

  const updateTax = async (id: string, updatedTax: Partial<Tax>) => {
    setTaxes(prev => prev.map(t => t.id === id ? { ...t, ...updatedTax } : t));
  };

  const deleteTax = async (id: string) => {
    setTaxes(prev => prev.filter(t => t.id !== id));
  };

  const generateAnnualTaxes = async (year: number, totalValue: number, taxType: Tax['type'], name: string) => {
    const monthlyValue = totalValue / 12;
    const newTaxes: Tax[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const competence = `${monthStr}/${year}`;
      // Due date is usually 20th of the next month for DAS, but let's simplify to 20th of the same month for now or next
      const dueDate = `${year}-${monthStr}-20`;
      
      newTaxes.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: taxType,
        competence,
        dueDate,
        value: monthlyValue,
        status: 'pending',
        year
      });
    }
    
    setTaxes(prev => [...prev, ...newTaxes]);
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      accounts, 
      paymentMethods,
      accountPlans,
      userProfile,
      companyProfile,
      notificationSettings,
      taxes,
      isModalOpen,
      editingTransaction,
      isLoading,
      openModal,
      closeModal,
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      addAccount,
      updateAccount,
      deleteAccount,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      addAccountPlan,
      updateAccountPlan,
      deleteAccountPlan,
      resetAccountPlans,
      updateUserProfile,
      updateCompanyProfile,
      updateNotificationSettings,
      addTax,
      updateTax,
      deleteTax,
      generateAnnualTaxes,
      refreshData: fetchData,
      accountsWithBalances: accounts.map(account => {
        let currentBalance = account.balance;
        transactions.forEach(t => {
          t.payments.forEach(p => {
            if (p.status !== 'completed' || p.method === 'Adiantamento') return;
            
            // Income: Add to destination account
            if (t.type === 'income' && p.destination === account.name) {
              currentBalance += p.value;
            }
            // Expense: Subtract from source account
            else if (t.type === 'expense' && p.source === account.name) {
              currentBalance -= p.value;
            }
            // Transfer: Subtract from source, add to destination
            else if (t.type === 'transfer') {
              if (p.source === account.name) {
                currentBalance -= p.value;
              }
              if (p.destination === account.name) {
                currentBalance += p.value;
              }
            }
          });
        });
        return { ...account, currentBalance };
      })
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
